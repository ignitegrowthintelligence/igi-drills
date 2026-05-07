'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ChatBubble from '@/components/ChatBubble'
import type { TranscriptMessage } from '@/lib/types'

const LIZ_OPENING = "Okay, so before we dig in — your email mentioned you've worked with other med spas to bring in new patients. What does that actually look like? What kind of results have you seen?"

export default function CallPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([
    { speaker: 'liz', text: LIZ_OPENING }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [listening, setListening] = useState(false)
  const interimRef = useRef('')

  const sellerMessages = transcript.filter(m => m.speaker === 'seller').length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript, loading])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    const newTranscript: TranscriptMessage[] = [...transcript, { speaker: 'seller', text }]
    setTranscript(newTranscript)
    setLoading(true)

    try {
      const res = await fetch('/api/liz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: newTranscript, messageCount: sellerMessages + 1 }),
      })
      const data = await res.json()
      setTranscript(prev => [...prev, { speaker: 'liz', text: data.response }])
    } catch {
      setTranscript(prev => [...prev, { speaker: 'liz', text: "Sorry, can you repeat that?" }])
    } finally {
      setLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function toggleMic() {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert('Speech recognition is not supported in this browser. Use Chrome.')
      return
    }

    const rec: SpeechRecognition = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    const baseText = input

    rec.onstart = () => setListening(true)

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      interimRef.current = interim
      setInput((baseText ? baseText + ' ' : '') + final + interim)
    }

    rec.onerror = () => {
      setListening(false)
      recognitionRef.current = null
    }

    rec.onend = () => {
      setListening(false)
      recognitionRef.current = null
      // Strip trailing interim (keep only final committed text)
      setInput(prev => prev.replace(interimRef.current, '').trimEnd())
      interimRef.current = ''
      setTimeout(() => textareaRef.current?.focus(), 100)
    }

    recognitionRef.current = rec
    rec.start()
  }

  function handleEndCall() {
    if (sellerMessages < 3) {
      setShowEndDialog(true)
    } else {
      endCall()
    }
  }

  function endCall() {
    sessionStorage.setItem('drills_transcript', JSON.stringify(transcript))
    router.push('/results')
  }

  return (
    <div style={{ background: '#070b14', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header screen="Live Call" />

      {/* Call bar */}
      <div style={{ background: '#0d1526', borderBottom: '1px solid #1e3054', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'blink 2s infinite' }} />
          <span style={{ fontSize: '13px', color: '#6a87ab' }}>Reveal MedSpas · Liz Rose</span>
          <span style={{ fontSize: '12px', color: '#1e3054' }}>·</span>
          <span style={{ fontSize: '12px', color: '#6a87ab' }}>{transcript.length} exchanges</span>
        </div>
        <button
          onClick={handleEndCall}
          style={{ padding: '7px 16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          End Call
        </button>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '760px', width: '100%', margin: '0 auto' }}>
        {transcript.map((msg, i) => (
          <ChatBubble key={i} speaker={msg.speaker} text={msg.text} />
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4a9eff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#070b14', flexShrink: 0 }}>LR</div>
            <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', display: 'flex', gap: '5px' }}>
              {[0,1,2].map(i => (
                <span key={i} className="typing-dot" style={{ width: '6px', height: '6px', background: '#6a87ab', borderRadius: '50%', display: 'inline-block' }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#0d1526', borderTop: '1px solid #1e3054', padding: '16px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
              rows={2}
              style={{
                width: '100%', background: '#131f38', border: `1px solid ${listening ? 'rgba(248,113,113,0.5)' : '#1e3054'}`, borderRadius: '8px',
                padding: '12px', fontSize: '14px', color: '#e2eaf6', resize: 'none', fontFamily: 'inherit',
                opacity: loading ? 0.5 : 1, boxSizing: 'border-box',
              }}
            />
            {listening && (
              <div style={{
                position: 'absolute', bottom: '8px', left: '12px',
                fontSize: '11px', color: '#f87171', fontWeight: 600,
                letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px',
                pointerEvents: 'none',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'blink 1s infinite' }} />
                Listening...
              </div>
            )}
          </div>
          {/* Mic button */}
          <button
            onClick={toggleMic}
            disabled={loading}
            title={listening ? 'Stop recording' : 'Start voice input'}
            style={{
              padding: '12px 14px', borderRadius: '8px', border: 'none', cursor: loading ? 'default' : 'pointer',
              background: listening ? 'rgba(248,113,113,0.15)' : '#131f38',
              color: listening ? '#f87171' : '#6a87ab',
              fontSize: '18px', lineHeight: 1, transition: 'all 0.15s', flexShrink: 0,
              boxShadow: listening ? '0 0 0 1px rgba(248,113,113,0.4)' : '0 0 0 1px #1e3054',
            }}>
            🎙️
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px', background: loading || !input.trim() ? '#131f38' : '#f59e0b',
              border: 'none', borderRadius: '8px', color: loading || !input.trim() ? '#6a87ab' : '#070b14',
              fontSize: '14px', fontWeight: 700, cursor: loading || !input.trim() ? 'default' : 'pointer',
              transition: 'all 0.15s', flexShrink: 0,
            }}>
            Send
          </button>
        </div>
      </div>

      {/* End call dialog */}
      {showEndDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,20,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '10px', padding: '28px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2eaf6', marginBottom: '8px' }}>End the call early?</h3>
            <p style={{ fontSize: '14px', color: '#6a87ab', lineHeight: 1.6, marginBottom: '20px' }}>You&apos;ve only had {sellerMessages} exchanges with Liz. Ending early will affect your score. Are you sure?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowEndDialog(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #1e3054', borderRadius: '6px', color: '#6a87ab', fontSize: '14px', cursor: 'pointer' }}>Keep Going</button>
              <button onClick={endCall} style={{ flex: 1, padding: '12px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>End Call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
