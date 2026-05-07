'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function CoachingPage() {
  const router = useRouter()
  const [coaching, setCoaching] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('drills_coaching') || ''
    setCoaching(raw)
  }, [])

  const paragraphs = coaching.split('\n\n').filter(Boolean)

  return (
    <div style={{ background: '#070b14', minHeight: '100vh' }}>
      <Header screen="Coaching" />
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2eaf6', marginBottom: '4px' }}>Your Coaching</h2>
          <p style={{ fontSize: '13px', color: '#6a87ab' }}>From your SVP of Digital Sales</p>
        </div>

        <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '10px', padding: '32px', marginBottom: '28px' }}>
          {paragraphs.length > 0 ? paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: '15px',
                color: '#e2eaf6',
                lineHeight: 1.8,
                marginBottom: i < paragraphs.length - 1 ? '20px' : 0,
              }}
            >
              {p}
            </p>
          )) : (
            <p style={{ fontSize: '15px', color: '#6a87ab' }}>
              No coaching available. Try completing a full call first.
            </p>
          )}
        </div>

        <button
          onClick={() => router.push('/sidebyside')}
          style={{
            width: '100%',
            padding: '16px',
            background: '#f59e0b',
            border: 'none',
            borderRadius: '6px',
            color: '#070b14',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          See Side by Side →
        </button>
      </main>
    </div>
  )
}
