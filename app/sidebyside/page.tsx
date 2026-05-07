'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import type { SbsMoment } from '@/lib/types'

export default function SideBySidePage() {
  const router = useRouter()
  const [moments, setMoments] = useState<SbsMoment[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const raw = sessionStorage.getItem('drills_sbs') || '[]'
    try {
      setMoments(JSON.parse(raw))
    } catch {
      setMoments([])
    }
  }, [])

  if (moments.length === 0) {
    return (
      <div style={{ background: '#070b14', minHeight: '100vh' }}>
        <Header screen="Side by Side" />
        <div style={{ maxWidth: '640px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ color: '#6a87ab', fontSize: '15px' }}>No side-by-side moments available.</p>
          <button
            onClick={() => router.push('/results')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#f59e0b',
              border: 'none',
              borderRadius: '6px',
              color: '#070b14',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Back to Results
          </button>
        </div>
      </div>
    )
  }

  const moment = moments[idx]
  const isLast = idx === moments.length - 1

  return (
    <div style={{ background: '#070b14', minHeight: '100vh' }}>
      <Header screen="Side by Side" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Counter + label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#e2eaf6' }}>{moment.label}</h2>
          <span style={{ fontSize: '12px', color: '#6a87ab' }}>{idx + 1} of {moments.length}</span>
        </div>

        {/* Context */}
        <p style={{ fontSize: '13px', color: '#6a87ab', marginBottom: '20px', lineHeight: 1.6 }}>{moment.context}</p>

        {/* Liz said */}
        <div style={{
          background: '#0d1526',
          border: '1px solid #1e3054',
          borderLeft: '3px solid #4a9eff',
          borderRadius: '6px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '11px', color: '#4a9eff', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Liz Said
          </p>
          <p style={{ fontSize: '14px', color: '#e2eaf6', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{moment.lizSaid}"
          </p>
        </div>

        {/* Two-column comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#6a87ab', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              What You Said
            </p>
            <p style={{ fontSize: '13px', color: '#e2eaf6', lineHeight: 1.6 }}>{moment.whatYouSaid}</p>
          </div>
          <div style={{ background: '#0d1526', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              What Great Sounds Like
            </p>
            <p style={{ fontSize: '13px', color: '#e2eaf6', lineHeight: 1.6 }}>{moment.whatGreatLooksLike}</p>
          </div>
        </div>

        {/* The Gap */}
        <div style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderLeft: '3px solid #f59e0b',
          borderRadius: '6px',
          padding: '16px 20px',
          marginBottom: '28px',
        }}>
          <p style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            The Gap
          </p>
          <p style={{ fontSize: '13px', color: '#e2eaf6', lineHeight: 1.7 }}>{moment.theGap}</p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={() => setIdx(idx - 1)}
            disabled={idx === 0}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #1e3054',
              borderRadius: '6px',
              color: idx === 0 ? '#1e3054' : '#6a87ab',
              fontSize: '14px',
              cursor: idx === 0 ? 'default' : 'pointer',
            }}
          >
            ← Previous
          </button>
          <button
            onClick={isLast ? () => router.push('/results') : () => setIdx(idx + 1)}
            style={{
              padding: '12px 28px',
              background: '#f59e0b',
              border: 'none',
              borderRadius: '6px',
              color: '#070b14',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Done → Results' : 'Next →'}
          </button>
        </div>
      </main>
    </div>
  )
}
