'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function CapturePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function validate() {
    if (!name.trim()) { setError('Please enter your full name.'); return false }
    if (!email.trim()) { setError('Please enter your email address.'); return false }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email.trim())) { setError('Please enter a valid email address.'); return false }
    return true
  }

  function handleContinue() {
    if (!validate()) return
    // Clear any previous session data so results page scores fresh
    sessionStorage.removeItem('drills_scores')
    sessionStorage.removeItem('drills_coaching')
    sessionStorage.removeItem('drills_transcript')
    sessionStorage.removeItem('drills_prep_questions')
    sessionStorage.removeItem('drills_prep_answers')
    sessionStorage.setItem('drills_seller', JSON.stringify({ name: name.trim(), email: email.trim() }))
    router.push('/brief')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleContinue()
  }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Welcome" />
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Title */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', color: '#00aebd', marginBottom: '12px', textTransform: 'uppercase' }}>
            IGI DRILLS
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            Discovery Call Simulator
          </h1>
          <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.6 }}>
            Enter your details to get started. Your results will be emailed to you when the drill is complete.
          </p>
        </div>

        {/* Quick-access nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <a href="/records?tab=tests" style={{
            display: 'block', padding: '12px 16px', background: '#2a2a2a',
            border: '1px solid #404040', borderRadius: '4px', textDecoration: 'none',
            textAlign: 'center', fontFamily: 'Inter, sans-serif',
          }}>
            <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>View</p>
            <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>Past Tests</p>
          </a>
          <a href="/records?tab=leaderboard" style={{
            display: 'block', padding: '12px 16px', background: '#2a2a2a',
            border: '1px solid #404040', borderRadius: '4px', textDecoration: 'none',
            textAlign: 'center', fontFamily: 'Inter, sans-serif',
          }}>
            <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>All-Time</p>
            <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>Leaderboard</p>
          </a>
        </div>

        {/* Form */}
        <div style={{ background: '#2a2a2a', border: '1px solid #1e3054', borderRadius: '4px', padding: '28px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="Your full name"
              autoFocus
              style={{
                width: '100%', background: '#333333', border: '1px solid #1e3054',
                borderRadius: '4px', padding: '12px 14px', fontSize: '14px',
                color: '#ffffff', fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#888888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="your@email.com"
              style={{
                width: '100%', background: '#333333', border: '1px solid #1e3054',
                borderRadius: '4px', padding: '12px 14px', fontSize: '14px',
                color: '#ffffff', fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#f87171', marginBottom: '16px' }}>{error}</p>
          )}

          <button
            onClick={handleContinue}
            style={{
              width: '100%', padding: '14px', background: '#00aebd', border: 'none',
              borderRadius: '4px', color: '#ffffff', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.01em',
            }}
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  )
}
