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
    sessionStorage.setItem('drills_seller', JSON.stringify({ name: name.trim(), email: email.trim() }))
    router.push('/brief')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleContinue()
  }

  return (
    <div style={{ background: '#070b14', minHeight: '100vh' }}>
      <Header screen="Welcome" />
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Title */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', color: '#f59e0b', marginBottom: '12px', textTransform: 'uppercase' }}>
            IGI DRILLS
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e2eaf6', marginBottom: '8px' }}>
            Discovery Call Simulator
          </h1>
          <p style={{ fontSize: '14px', color: '#6a87ab', lineHeight: 1.6 }}>
            Enter your details to get started. Your results will be emailed to you when the drill is complete.
          </p>
        </div>

        {/* Form */}
        <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '10px', padding: '28px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6a87ab', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
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
                width: '100%', background: '#131f38', border: '1px solid #1e3054',
                borderRadius: '6px', padding: '12px 14px', fontSize: '14px',
                color: '#e2eaf6', fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6a87ab', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="your@email.com"
              style={{
                width: '100%', background: '#131f38', border: '1px solid #1e3054',
                borderRadius: '6px', padding: '12px 14px', fontSize: '14px',
                color: '#e2eaf6', fontFamily: 'inherit',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#f87171', marginBottom: '16px' }}>{error}</p>
          )}

          <button
            onClick={handleContinue}
            style={{
              width: '100%', padding: '14px', background: '#f59e0b', border: 'none',
              borderRadius: '6px', color: '#070b14', fontSize: '15px', fontWeight: 700,
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
