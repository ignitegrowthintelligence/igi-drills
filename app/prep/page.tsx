'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { pickQuestions } from '@/lib/questions'
import type { PrepQuestion } from '@/lib/types'

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

export default function PrepPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<PrepQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [step, setStep] = useState(0)

  useEffect(() => {
    const qs = pickQuestions()
    setQuestions(qs)
  }, [])

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [listening, setListening] = useState(false)
  const interimRef = useRef('')

  const current = questions[step]
  const isLast = step === 2

  function toggleMic() {
    if (listening) { recognitionRef.current?.stop(); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Speech recognition is not supported in this browser. Use Chrome.'); return }
    const rec: SpeechRecognition = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    const baseText = answers[step]
    rec.onstart = () => setListening(true)
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let committed = ''
      let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) committed += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      interimRef.current = interim
      const next = [...answers]
      next[step] = (baseText ? baseText.trimEnd() + ' ' : '') + committed + interim
      setAnswers(next)
    }
    rec.onerror = () => { setListening(false); recognitionRef.current = null }
    rec.onend = () => { setListening(false); recognitionRef.current = null; interimRef.current = '' }
    recognitionRef.current = rec
    rec.start()
  }

  function handleNext() {
    if (isLast) {
      sessionStorage.setItem('drills_prep_questions', JSON.stringify(questions))
      sessionStorage.setItem('drills_prep_answers', JSON.stringify(answers))
      router.push('/call')
    } else {
      setStep(step + 1)
    }
  }

  if (!current) return <div style={{ background: '#1a1a1a', minHeight: '100vh' }} />

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Pre-Call Prep" />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>
        
        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#888888' }}>Question {step + 1} of 3</span>
            <span style={{ fontSize: '12px', color: '#00aebd', fontWeight: 600 }}>{current.tier} · {current.pts} pts available</span>
          </div>
          <div style={{ height: '4px', background: '#333333', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((step + 1) / 3) * 100}%`, background: '#00aebd', borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
          <p style={{ fontSize: '15px', color: '#ffffff', lineHeight: 1.7, fontWeight: 500 }}>{current.question}</p>
        </div>

        {/* Answer */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={answers[step]}
            onChange={e => {
              const next = [...answers]
              next[step] = e.target.value
              setAnswers(next)
            }}
            placeholder="Type your answer here or use the mic..."
            style={{
              width: '100%', minHeight: '160px', background: '#2a2a2a',
              border: listening ? '1px solid rgba(248,113,113,0.5)' : '1px solid #404040',
              borderRadius: '4px', padding: '16px', fontSize: '14px', color: '#ffffff',
              lineHeight: 1.6, resize: 'vertical', fontFamily: "'Inter', sans-serif",
            }}
          />
          {listening && (
            <p style={{ position: 'absolute', bottom: '10px', left: '14px', fontSize: '12px', color: '#f87171', pointerEvents: 'none' }}>
              ● Listening...
            </p>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={toggleMic}
            title={listening ? 'Stop recording' : 'Start voice input'}
            style={{
              padding: '8px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: listening ? 'rgba(248,113,113,0.15)' : '#2a2a2a',
              color: listening ? '#f87171' : '#888888',
              fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500,
              boxShadow: listening ? '0 0 0 1px rgba(248,113,113,0.4)' : '0 0 0 1px #404040',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{listening ? '⏹' : '🎤'}</span>
            {listening ? 'Stop' : 'Use Mic'}
          </button>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '12px' }}>
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #1e3054', borderRadius: '4px', color: step === 0 ? '#404040' : '#888888', fontSize: '14px', cursor: step === 0 ? 'default' : 'pointer' }}>
            ← Back
          </button>
          <button
            onClick={handleNext}
            style={{ padding: '12px 28px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            {isLast ? 'Start the Call →' : 'Next →'}
          </button>
        </div>
      </main>
    </div>
  )
}
