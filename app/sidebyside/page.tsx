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
    // Always reset to first moment on mount
    setIdx(0)
  }, [])

  function handlePrev() {
    setIdx(i => Math.max(0, i - 1))
  }

  function handleNext() {
    setIdx(i => Math.min(moments.length - 1, i + 1))
  }

  if (moments.length === 0) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <Header screen="Side by Side" />
        <div style={{ maxWidth: '640px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ color: '#888888', fontSize: '15px' }}>No side-by-side moments available.</p>
          <button
            onClick={() => router.push('/results')}
            style={{ marginTop: '20px', padding: '12px 24px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
          >
            ← Back to Results
          </button>
        </div>
      </div>
    )
  }

  const moment = moments[idx]
  const isFirst = idx === 0
  const isLast = idx === moments.length - 1

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Side by Side" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Counter + label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff' }}>{moment.label}</h2>
          <span style={{ fontSize: '12px', color: '#888888' }}>{idx + 1} of {moments.length}</span>
        </div>

        {/* Context */}
        <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px', lineHeight: 1.6 }}>{moment.context}</p>

        {/* Liz said */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderLeft: '3px solid #4a9eff', borderRadius: '4px', padding: '16px 20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#00aebd', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Liz Said
          </p>
          <p style={{ fontSize: '14px', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.6 }}>
            &quot;{moment.lizSaid}&quot;
          </p>
        </div>

        {/* Two-column comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              What You Said
            </p>
            <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.6 }}>{moment.whatYouSaid}</p>
          </div>
          <div style={{ background: '#2a2a2a', border: '1px solid rgba(117,190,25,0.3)', borderRadius: '4px', padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#75BE19', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              What Great Sounds Like
            </p>
            <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.6 }}>{moment.whatGreatLooksLike}</p>
          </div>
        </div>

        {/* The Gap */}
        <div style={{ background: 'rgba(0,174,189,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderLeft: '3px solid #f59e0b', borderRadius: '4px', padding: '16px 20px', marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', color: '#00aebd', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            The Gap
          </p>
          <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.7 }}>{moment.theGap}</p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <button
            onClick={handlePrev}
            disabled={isFirst}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: `1px solid ${isFirst ? '#2a2a2a' : '#404040'}`,
              borderRadius: '4px',
              color: isFirst ? '#333333' : '#888888',
              fontSize: '14px',
              cursor: isFirst ? 'default' : 'pointer',
              pointerEvents: isFirst ? 'none' : 'auto',
            }}
          >
            ← Previous
          </button>
          {isLast ? (
            <button
              onClick={() => router.push('/results')}
              style={{ padding: '12px 28px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Done → Results
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{ padding: '12px 28px', background: '#00aebd', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
