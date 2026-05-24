'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { apiFetch } from '@/lib/api-client'
import ScoreBar from '@/components/ScoreBar'

export default function SessionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sbsMoments, setSbsMoments] = useState<any[]>([])
  const [sbsIndex, setSbsIndex] = useState(0)
  const [sbsLoading, setSbsLoading] = useState(false)
  const [sbsGenerated, setSbsGenerated] = useState(false)
  const [sbsError, setSbsError] = useState('')

  useEffect(() => {
    if (!id) return
    apiFetch(`/api/sessions/${id}`)
      .then(r => r.json())
      .then(data => { setSession(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Session Detail" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>
        <p style={{ color: '#888888', fontSize: '14px' }}>Loading session...</p>
      </main>
    </div>
  )

  if (!session || session.error) return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Session Detail" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>
        <p style={{ color: '#f87171', fontSize: '14px' }}>Session not found.</p>
        <button
          onClick={() => router.push('/records')}
          style={{ marginTop: '16px', padding: '8px 16px', background: '#00aebd', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
        >
          ← Back to Records
        </button>
      </main>
    </div>
  )

  const scores = session.scores_json || {}

  async function generateKeyMoments() {
    if (!session.transcript || sbsGenerated) return
    setSbsLoading(true)
    setSbsError('')
    try {
      const res = await apiFetch('/api/sbs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: session.transcript }),
      })
      const data = await res.json()
      if (data.error || !data.moments?.length) {
        setSbsError('Could not generate key moments. Try again.')
      } else {
        setSbsMoments(data.moments)
        setSbsGenerated(true)
        setSbsIndex(0)
      }
    } catch {
      setSbsError('Request failed. Try again.')
    } finally {
      setSbsLoading(false)
    }
  }

  function readinessColor(r: string) {
    return r === 'pass' ? '#75BE19' : '#f87171'
  }

  function readinessLabel(r: string) {
    return r === 'pass' ? 'Proposal Ready' : 'Not Ready'
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const scoreColor = (session.total_with_bonus ?? session.total_score) >= 85
    ? '#75BE19'
    : (session.total_with_bonus ?? session.total_score) >= 60
    ? '#ef9809'
    : '#f87171'

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Session Detail" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back link */}
        <button
          onClick={() => router.push('/records')}
          style={{ background: 'none', border: 'none', color: '#888888', fontSize: '13px', cursor: 'pointer', marginBottom: '24px', padding: 0, fontFamily: 'Inter, sans-serif' }}
        >
          ← Back to Records
        </button>

        {/* Header card */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', fontFamily: 'Roboto, sans-serif' }}>{session.seller_name}</h1>
              <p style={{ fontSize: '13px', color: '#888888' }}>{formatDate(session.date_taken)} · {session.persona || 'Mooradians Furniture and Mattresses'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '36px', fontWeight: 700, color: scoreColor, lineHeight: 1, fontFamily: 'Roboto, sans-serif' }}>
                {session.total_with_bonus ?? session.total_score}
              </p>
              <p style={{ fontSize: '12px', color: '#888888' }}>out of 105</p>
            </div>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #404040', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px',
              background: `${readinessColor(session.proposal_readiness)}18`,
              color: readinessColor(session.proposal_readiness),
              border: `1px solid ${readinessColor(session.proposal_readiness)}40`,
              fontFamily: 'Inter, sans-serif',
            }}>
              {readinessLabel(session.proposal_readiness)}
            </span>
            {session.buried_opportunity_bonus > 0 && (
              <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', background: 'rgba(117,190,25,0.1)', color: '#75BE19', border: '1px solid rgba(117,190,25,0.3)', fontFamily: 'Inter, sans-serif' }}>
                +{session.buried_opportunity_bonus} Buried Opportunity
              </span>
            )}
            {session.disqualifying_detected && (
              <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', fontFamily: 'Inter, sans-serif' }}>
                ⚠ Disqualifying Move
              </span>
            )}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>Score Breakdown</h2>
          <ScoreBar label="Pre-Call Prep" score={session.pre_call_score ?? 0} max={20} reason={scores.preCall?.details?.map((d: any) => d.reason).join(' · ')} />
          <ScoreBar label="Discovery Elements" score={session.discovery_score ?? 0} max={45} />
          <ScoreBar label="Assignment Playback" score={session.assignment_score ?? 0} max={20} reason={scores.assignment?.reason} />
          <ScoreBar label="Call Craft" score={session.call_craft_score ?? 0} max={15} />
        </div>

        {/* Coaching narrative */}
        {session.coaching_narrative && (
          <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>Coaching Feedback</h2>
            {session.coaching_narrative.split('\n\n').filter(Boolean).map((para: string, i: number) => (
              <p key={i} style={{ fontSize: '14px', color: '#ffffff', lineHeight: 1.8, marginBottom: '16px', fontFamily: 'Roboto, sans-serif' }}>{para}</p>
            ))}
          </div>
        )}

        {/* Key Moments — on demand */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: sbsGenerated ? '20px' : '0' }}>
            <h2 style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Key Moments</h2>
            {sbsGenerated && <span style={{ fontSize: '12px', color: '#888888' }}>{sbsIndex + 1} of {sbsMoments.length}</span>}
          </div>

          {!sbsGenerated && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#888888', marginBottom: '16px', lineHeight: 1.6 }}>
                See 2–3 specific moments from this call side-by-side with what great looks like.
              </p>
              {sbsError && <p style={{ fontSize: '13px', color: '#f87171', marginBottom: '12px' }}>{sbsError}</p>}
              <button
                onClick={generateKeyMoments}
                disabled={sbsLoading}
                style={{
                  padding: '12px 24px', background: sbsLoading ? '#333333' : '#00aebd',
                  border: 'none', borderRadius: '4px', color: sbsLoading ? '#888888' : '#1a1a1a',
                  fontSize: '14px', fontWeight: 700, cursor: sbsLoading ? 'default' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {sbsLoading ? 'Generating key moments...' : 'Generate Key Moments'}
              </button>
            </div>
          )}

          {sbsGenerated && sbsMoments[sbsIndex] && (
            <>
              <p style={{ fontSize: '13px', color: '#888888', marginBottom: '16px', fontStyle: 'italic' }}>{sbsMoments[sbsIndex].context}</p>

              {sbsMoments[sbsIndex].lizSaid && (
                <div style={{ background: '#333333', border: '1px solid #404040', borderLeft: '3px solid #00aebd', borderRadius: '4px', padding: '14px 16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#00aebd', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>Liz Said</p>
                  <p style={{ fontSize: '14px', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.6 }}>&quot;{sbsMoments[sbsIndex].lizSaid}&quot;</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: '#333333', border: '1px solid #404040', borderRadius: '4px', padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>What You Said</p>
                  <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.6 }}>{sbsMoments[sbsIndex].whatYouSaid}</p>
                </div>
                <div style={{ background: '#333333', border: '1px solid rgba(117,190,25,0.35)', borderRadius: '4px', padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#75BE19', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>What Great Sounds Like</p>
                  <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.6 }}>{sbsMoments[sbsIndex].whatGreatLooksLike}</p>
                </div>
              </div>

              {sbsMoments[sbsIndex].theGap && (
                <div style={{ background: 'rgba(0,174,189,0.06)', border: '1px solid rgba(0,174,189,0.2)', borderLeft: '3px solid #00aebd', borderRadius: '4px', padding: '14px 16px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: '#00aebd', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>The Gap</p>
                  <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: 1.7 }}>{sbsMoments[sbsIndex].theGap}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setSbsIndex(Math.max(0, sbsIndex - 1))}
                  disabled={sbsIndex === 0}
                  style={{ padding: '8px 16px', border: '1px solid #404040', borderRadius: '4px', background: 'transparent', color: sbsIndex === 0 ? '#404040' : '#888888', cursor: sbsIndex === 0 ? 'default' : 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setSbsIndex(Math.min(sbsMoments.length - 1, sbsIndex + 1))}
                  disabled={sbsIndex === sbsMoments.length - 1}
                  style={{ padding: '8px 16px', background: sbsIndex === sbsMoments.length - 1 ? '#333333' : '#00aebd', border: 'none', borderRadius: '4px', color: sbsIndex === sbsMoments.length - 1 ? '#888888' : '#ffffff', cursor: sbsIndex === sbsMoments.length - 1 ? 'default' : 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  )
}
