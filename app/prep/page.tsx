'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { pickQuestions } from '@/lib/questions'
import type { PrepQuestion } from '@/lib/types'

export default function PrepPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<PrepQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [step, setStep] = useState(0)

  useEffect(() => {
    const qs = pickQuestions()
    setQuestions(qs)
  }, [])

  const current = questions[step]
  const isLast = step === 2

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
        <textarea
          value={answers[step]}
          onChange={e => {
            const next = [...answers]
            next[step] = e.target.value
            setAnswers(next)
          }}
          placeholder="Type your answer here..."
          style={{
            width: '100%', minHeight: '160px', background: '#2a2a2a', border: '1px solid #1e3054',
            borderRadius: '4px', padding: '16px', fontSize: '14px', color: '#ffffff', lineHeight: 1.6,
            resize: 'vertical', fontFamily: "'Inter', sans-serif",
          }}
        />

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
