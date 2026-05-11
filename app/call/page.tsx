'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ChatBubble from '@/components/ChatBubble'
import type { TranscriptMessage } from '@/lib/types'

declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
  }
  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }
  interface SpeechRecognitionResult {
    readonly isFinal: boolean
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onstart: (() => void) | null
    onend: (() => void) | null
    onerror: ((e: Event) => void) | null
    onresult: ((e: SpeechRecognitionEvent) => void) | null
    start(): void
    stop(): void
  }
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

const LIZ_OPENING = "Hey — I'll be honest, you were pretty persistent about getting on my calendar, and I respect that. I've got about 16 minutes. Tell me what's on your mind — what did you want to cover today?"

const DEAD_AIR_RESPONSES = [
  "You still there?",
  "Go ahead, I'm listening.",
  "Take your time.",
  "Still with me?",
  "I've got a few minutes — what's on your mind?",
]

const CALL_DURATION = 16 * 60 // 16 minutes in seconds

export default function CallPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([
    { speaker: 'liz', text: LIZ_OPENING }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [timeLeft, setTimeLeft] = useState(CALL_DURATION)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [listening, setListening] = useState(false)
  const interimRef = useRef('')
  const deadAirRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transcriptRef = useRef(transcript)
  useEffect(() => { transcriptRef.current = transcript }, [transcript])

  const sellerMessages = transcript.filter(m => m.speaker === 'seller').length

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          endCall()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Dead air detection — fires 30s after Liz responds if seller hasn't typed or sent
  useEffect(() => {
    const lastMsg = transcript[transcript.length - 1]
    if (!loading && lastMsg?.speaker === 'liz') {
      deadAirRef.current = setTimeout(() => {
        const response = DEAD_AIR_RESPONSES[Math.floor(Math.random() * DEAD_AIR_RESPONSES.length)]
        setTranscript(prev => [...prev, { speaker: 'liz', text: response }])
      }, 30000)
    }
    return () => {
      if (deadAirRef.current) clearTimeout(deadAirRef.current)
    }
  }, [transcript, loading])

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

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
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
      if (deadAirRef.current) clearTimeout(deadAirRef.current)
      let committed = ''
      let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) committed += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      interimRef.current = interim
      setInput((baseText ? baseText.trimEnd() + ' ' : '') + committed + interim)
    }

    rec.onerror = () => {
      setListening(false)
      recognitionRef.current = null
    }

    rec.onend = () => {
      setListening(false)
      recognitionRef.current = null
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
    sessionStorage.setItem('drills_transcript', JSON.stringify(transcriptRef.current))
    router.push('/results')
  }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header screen="Live Call" />

      {/* Call bar */}
      <div style={{ background: '#2a2a2a', borderBottom: '1px solid #1e3054', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#75BE19', borderRadius: '50%', animation: 'blink 2s infinite' }} />
          <span style={{ fontSize: '13px', color: '#888888' }}>Mooradians Furniture · Liz Rose</span>
          <span style={{ fontSize: '12px', color: '#404040' }}>·</span>
          <span style={{ fontSize: '12px', color: '#888888' }}>{transcript.length} exchanges</span>
        </div>
        <button
          onClick={handleEndCall}
          style={{ padding: '7px 16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#00aebd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#ffffff', flexShrink: 0 }}>LR</div>
            <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px 12px 12px 12px', padding: '12px 16px', display: 'flex', gap: '5px' }}>
              {[0,1,2].map(i => (
                <span key={i} className="typing-dot" style={{ width: '6px', height: '6px', background: '#888888', borderRadius: '50%', display: 'inline-block' }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#2a2a2a', borderTop: '1px solid #1e3054', padding: '16px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                if (deadAirRef.current) clearTimeout(deadAirRef.current)
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
              rows={2}
              style={{
                width: '100%', background: '#333333', border: `1px solid ${listening ? 'rgba(248,113,113,0.5)' : '#404040'}`, borderRadius: '4px',
                padding: '12px', fontSize: '14px', color: '#ffffff', resize: 'none', fontFamily: "'Inter', sans-serif",
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
              padding: '12px 14px', borderRadius: '4px', border: 'none', cursor: loading ? 'default' : 'pointer',
              background: listening ? 'rgba(248,113,113,0.15)' : '#333333',
              color: listening ? '#f87171' : '#888888',
              fontSize: '18px', lineHeight: 1, transition: 'all 0.15s', flexShrink: 0,
              boxShadow: listening ? '0 0 0 1px rgba(248,113,113,0.4)' : '0 0 0 1px #1e3054',
            }}>
            🎙️
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px', background: loading || !input.trim() ? '#333333' : '#00aebd',
              border: 'none', borderRadius: '4px', color: loading || !input.trim() ? '#888888' : '#1a1a1a',
              fontSize: '14px', fontWeight: 700, cursor: loading || !input.trim() ? 'default' : 'pointer',
              transition: 'all 0.15s', flexShrink: 0,
            }}>
            Send
          </button>
        </div>
        <div style={{ maxWidth: '760px', margin: '10px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '22px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
            color: timeLeft <= 120 ? '#f87171' : timeLeft <= 300 ? '#f59e0b' : '#888888',
            fontFamily: 'Roboto, sans-serif',
          }}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
          <button
            onClick={handleEndCall}
            style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: 0.7, letterSpacing: '0.02em' }}>
            End Call
          </button>
        </div>
      </div>

      {/* End call dialog */}
      {showEndDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '28px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>End the call early?</h3>
            <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.6, marginBottom: '20px' }}>You&apos;ve only had {sellerMessages} exchanges with Liz. Ending early will affect your score. Are you sure?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowEndDialog(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #1e3054', borderRadius: '4px', color: '#888888', fontSize: '14px', cursor: 'pointer' }}>Keep Going</button>
              <button onClick={endCall} style={{ flex: 1, padding: '12px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>End Call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
