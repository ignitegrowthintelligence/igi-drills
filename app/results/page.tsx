'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ScoreBar from '@/components/ScoreBar'
import type { ScoreResult } from '@/lib/types'

const LOADING_STEPS = [
  'Analyzing pre-call preparation...',
  'Evaluating 7 discovery elements...',
  'Scoring assignment playback...',
  'Assessing call craft...',
  'Checking for buried opportunity...',
  'Writing coaching narrative...',
]

export default function ResultsPage() {
  const router = useRouter()
  const [loadingStep, setLoadingStep] = useState(0)
  const [scores, setScores] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')
  const postScoreRan = useRef(false)

  useEffect(() => {
    // ── Bug fix: skip re-scoring if results already exist ──────────────────
    const existingScores = sessionStorage.getItem('drills_scores')
    if (existingScores) {
      try {
        setScores(JSON.parse(existingScores))
        return
      } catch {
        // corrupt — fall through to re-score
      }
    }

    const transcriptRaw = sessionStorage.getItem('drills_transcript')
    const prepQRaw = sessionStorage.getItem('drills_prep_questions')
    const prepARaw = sessionStorage.getItem('drills_prep_answers')

    if (!transcriptRaw) { router.push('/'); return }

    const transcript = JSON.parse(transcriptRaw)
    const prepQuestions = prepQRaw ? JSON.parse(prepQRaw) : []
    const prepAnswers = prepARaw ? JSON.parse(prepARaw) : []

    // Animate loading steps
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < LOADING_STEPS.length) setLoadingStep(step)
    }, 1500)

    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, prepQuestions, prepAnswers }),
    })
      .then(r => r.json())
      .then(data => {
        clearInterval(interval)
        setLoadingStep(LOADING_STEPS.length - 1)
        sessionStorage.setItem('drills_scores', JSON.stringify(data))
        sessionStorage.setItem('drills_coaching', data.coaching || '')
        sessionStorage.setItem('drills_sbs', JSON.stringify(data.sideBySide || []))
        setTimeout(() => setScores(data), 600)

        // Fire email + save-session best-effort (non-blocking)
        if (!postScoreRan.current) {
          postScoreRan.current = true
          const sellerRaw = sessionStorage.getItem('drills_seller')
          const seller = sellerRaw ? JSON.parse(sellerRaw) : { name: 'Unknown', email: '' }
          sendPostScoreActions(data, transcript, prepAnswers, seller)
        }
      })
      .catch(() => {
        clearInterval(interval)
        setError('Scoring failed. Please try again.')
      })

    return () => clearInterval(interval)
  }, [router])

  if (error) return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Results" />
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontSize: '15px' }}>{error}</p>
        <button onClick={() => router.push('/')} style={{ marginTop: '20px', padding: '12px 24px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>Start Over</button>
      </div>
    </div>
  )

  if (!scores) return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Results" />
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '32px' }}>
          <p style={{ fontSize: '12px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>Scoring Your Call</p>
          {LOADING_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', opacity: i <= loadingStep ? 1 : 0.25, transition: 'opacity 0.4s' }}>
              <span style={{ fontSize: '13px', color: i < loadingStep ? '#75BE19' : i === loadingStep ? '#00aebd' : '#888888' }}>
                {i < loadingStep ? '✓' : i === loadingStep ? '›' : '○'}
              </span>
              <span style={{ fontSize: '13px', color: i < loadingStep ? '#888888' : i === loadingStep ? '#ffffff' : '#404040' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const { total, totalWithBonus, buriedOpportunity, proposalReadiness, disqualifying, preCall, discovery, assignment, callCraft } = scores
  const scoreColor = totalWithBonus >= 85 ? '#75BE19' : totalWithBonus >= 60 ? '#00aebd' : '#f87171'
  const elements = discovery.elements

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Results" />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Overall Score</p>
          <div style={{ fontSize: '80px', fontWeight: 800, color: scoreColor, lineHeight: 1, marginBottom: '8px' }}>
            {totalWithBonus}
          </div>
          <p style={{ fontSize: '13px', color: '#888888', marginBottom: '16px' }}>
            out of 100{buriedOpportunity.bonus > 0 && ` · base ${total} + ${buriedOpportunity.bonus} bonus`}
          </p>
          {disqualifying.detected && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(0,174,189,0.35)', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: '#00aebd', fontWeight: 700, marginBottom: '4px' }}>⚠ Score capped at 60</p>
              {disqualifying.behaviors.map((b, i) => <p key={i} style={{ fontSize: '13px', color: '#ffffff', marginBottom: '2px' }}>· {b}</p>)}
            </div>
          )}
          <span style={{
            display: 'inline-block', padding: '6px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 700,
            background: proposalReadiness === 'pass' ? 'rgba(117,190,25,0.12)' : 'rgba(248,113,113,0.12)',
            color: proposalReadiness === 'pass' ? '#75BE19' : '#f87171',
            border: `1px solid ${proposalReadiness === 'pass' ? 'rgba(117,190,25,0.3)' : 'rgba(248,113,113,0.3)'}`,
          }}>
            Proposal Readiness: {proposalReadiness.toUpperCase()}
          </span>
        </div>

        {/* Section breakdown */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>Section Breakdown</p>
          <ScoreBar label="Pre-Call Preparation" score={preCall.score} max={preCall.max} />
          <ScoreBar label="7 Discovery Elements" score={discovery.score} max={discovery.max} />
          <ScoreBar label="The Assignment" score={assignment.score} max={assignment.max} reason={assignment.reason} />
          <ScoreBar label="Call Craft" score={callCraft.score} max={callCraft.max} />
          {buriedOpportunity.bonus > 0 && (
            <ScoreBar label="Buried Opportunity Bonus" score={buriedOpportunity.bonus} max={5} color="#22c55e" reason={buriedOpportunity.reason} />
          )}
        </div>

        {/* Discovery elements detail */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>Discovery Elements</p>
          <ScoreBar label="Current Marketing" score={elements.currentMarketing.score} max={elements.currentMarketing.max} reason={elements.currentMarketing.reason} />
          <ScoreBar label="Marketing Objective" score={elements.marketingObjective.score} max={elements.marketingObjective.max} reason={elements.marketingObjective.reason} />
          <ScoreBar label="USP" score={elements.usp.score} max={elements.usp.max} reason={elements.usp.reason} />
          <ScoreBar label="Target Audience" score={elements.targetAudience.score} max={elements.targetAudience.max} reason={elements.targetAudience.reason} />
          <ScoreBar label="Measurable KPI" score={elements.measurableKpi.score} max={elements.measurableKpi.max} reason={elements.measurableKpi.reason} />
          <ScoreBar label="Timing" score={elements.timing.score} max={elements.timing.max} reason={elements.timing.reason} />
          <ScoreBar label="Budget" score={elements.budget.score} max={elements.budget.max} reason={elements.budget.reason} />
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/coaching')}
          style={{ width: '100%', padding: '16px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          View Coaching →
        </button>
      </main>
    </div>
  )
}

// ── Post-score side effects (fire and forget) ──────────────────────────────
function sendPostScoreActions(
  scores: ScoreResult,
  transcript: Array<{ speaker: string; text: string }>,
  prepAnswers: string[],
  seller: { name: string; email: string }
) {
  // Send results email
  if (seller.email) {
    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scores, seller }),
    }).catch(() => { /* best-effort */ })
  }

  // Save session to Supabase
  fetch('/api/save-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scores, transcript, prepAnswers, seller }),
  }).catch(() => { /* best-effort */ })
}
