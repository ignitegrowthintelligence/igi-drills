'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

type SessionRow = {
  id: string
  seller_name: string
  persona: string
  date_taken: string
  total_score: number
  total_with_bonus: number
  proposal_readiness: string
}

export default function RecordsPage() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'tests' | 'leaderboard'>(
    searchParams.get('tab') === 'leaderboard' ? 'leaderboard' : 'tests'
  )
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => { setSessions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const leaderboard = [...sessions].sort((a, b) => b.total_with_bonus - a.total_with_bonus).slice(0, 20)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function readinessColor(r: string) {
    if (r === 'pass') return '#75BE19'
    return '#f87171'
  }

  const rankColors = ['#00aebd', '#888888', '#ef9809']

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Records" />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#2a2a2a', borderRadius: '4px', padding: '4px', width: 'fit-content' }}>
          {(['tests', 'leaderboard'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#00aebd' : 'transparent',
              color: tab === t ? '#ffffff' : '#888888',
              fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}>
              {t === 'tests' ? 'Past Tests' : 'All-Time Leaderboard'}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: '#888888', fontSize: '14px' }}>Loading...</p>}

        {/* Past Tests tab */}
        {!loading && tab === 'tests' && (
          <div>
            {sessions.length === 0 && (
              <p style={{ color: '#888888', fontSize: '14px' }}>No sessions recorded yet.</p>
            )}
            {sessions.length > 0 && (
              <div style={{ background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden', border: '1px solid #404040' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '10px 20px', background: '#1a1a1a', borderBottom: '1px solid #404040' }}>
                  {['Full Name', 'Persona', 'Date', 'Score'].map(h => (
                    <span key={h} style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>{h}</span>
                  ))}
                </div>
                {/* Rows */}
                {sessions.map((s, i) => (
                  <a
                    key={s.id}
                    href={`/records/${s.id}`}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr',
                      padding: '14px 20px', textDecoration: 'none',
                      background: i % 2 === 0 ? '#2a2a2a' : '#333333',
                      borderBottom: i < sessions.length - 1 ? '1px solid #404040' : 'none',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#3a3a3a')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#2a2a2a' : '#333333')}
                  >
                    <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>{s.seller_name}</span>
                    <span style={{ fontSize: '14px', color: '#888888' }}>{s.persona || 'Reveal MedSpas'}</span>
                    <span style={{ fontSize: '14px', color: '#888888' }}>{formatDate(s.date_taken)}</span>
                    <span style={{ fontSize: '14px', color: '#00aebd', fontWeight: 700 }}>
                      {s.total_with_bonus ?? s.total_score}
                      <span style={{ color: '#888888', fontWeight: 400 }}>/105</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard tab */}
        {!loading && tab === 'leaderboard' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', fontFamily: 'Roboto, sans-serif' }}>All-Time Top Scores</h2>
              <p style={{ fontSize: '14px', color: '#888888' }}>Ranked by total score including bonus points</p>
            </div>
            {leaderboard.length === 0 && (
              <p style={{ color: '#888888', fontSize: '14px' }}>No sessions recorded yet.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.map((s, i) => (
                <a
                  key={s.id}
                  href={`/records/${s.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px',
                    padding: '14px 20px', textDecoration: 'none',
                    borderLeft: i < 3 ? `3px solid ${rankColors[i]}` : '1px solid #404040',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#333333')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
                >
                  <span style={{
                    fontSize: '18px', fontWeight: 700,
                    color: i < 3 ? rankColors[i] : '#404040',
                    width: '28px', textAlign: 'center', fontFamily: 'Roboto, sans-serif',
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>{s.seller_name}</p>
                    <p style={{ fontSize: '12px', color: '#888888' }}>{formatDate(s.date_taken)} · {s.persona || 'Reveal MedSpas'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '22px', fontWeight: 700, color: '#00aebd', lineHeight: 1, fontFamily: 'Roboto, sans-serif' }}>{s.total_with_bonus ?? s.total_score}</p>
                    <p style={{ fontSize: '11px', color: '#888888' }}>out of 105</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
