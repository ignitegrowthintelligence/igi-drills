'use client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function BriefPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <Header screen="Pre-Call Brief" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', fontFamily: 'Roboto, sans-serif' }}>
            Your Prospect
          </h1>
          <p style={{ fontSize: '14px', color: '#888888' }}>Read this before you start. This is a real business. Treat the call like it&apos;s live.</p>
        </div>

        {/* Business card */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', fontFamily: 'Roboto, sans-serif' }}>Mooradians Furniture and Mattresses</h2>
              <p style={{ fontSize: '13px', color: '#888888' }}>Albany, NY · Clifton Park, NY</p>
            </div>
            <span style={{ background: 'rgba(0,174,189,0.12)', color: '#00aebd', border: '1px solid rgba(0,174,189,0.3)', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
              Furniture Retail
            </span>
          </div>

          <div style={{ borderTop: '1px solid #404040', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Buyer</p>
              <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>Elizabeth &quot;Liz&quot; Rose</p>
              <p style={{ fontSize: '13px', color: '#888888' }}>Marketing Manager</p>
              <p style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>~20 months in role</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Call Format</p>
              <p style={{ fontSize: '14px', color: '#ffffff' }}>16 minutes</p>
              <p style={{ fontSize: '13px', color: '#888888' }}>Warm open — she agreed because you were persistent</p>
            </div>
          </div>
        </div>

        {/* Why she agreed */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Why She Agreed to the Meeting</p>
          <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: 1.6, fontStyle: 'italic' }}>
            &quot;You were pretty persistent about getting on my calendar. I respect that.&quot;
          </p>
          <p style={{ fontSize: '13px', color: '#888888', marginTop: '8px', lineHeight: 1.6 }}>
            She is curious but not sold. She has been pitched by every digital agency in the Capital Region. She is looking for a strategic partner, not another vendor.
          </p>
        </div>

        {/* Research links */}
        <div style={{ background: '#2a2a2a', border: '1px solid #404040', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#888888', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Research Links</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Mooradians Website', url: 'https://mooradians.com' },
              { label: 'Meta Ad Library — Mooradians', url: 'https://www.facebook.com/ads/library/?search_type=page&q=mooradians' },
              { label: 'Google Ads Transparency — mooradians.com', url: 'https://adstransparency.google.com/advertiser/AR17010818085732352001?region=US' },
              { label: 'Mooradians on Facebook', url: 'https://www.facebook.com/MooradiansFurniture' },
              { label: 'Mooradians on Instagram', url: 'https://www.instagram.com/mooradiansfurniture/' },
              { label: 'Google Business — Albany', url: 'https://www.google.com/maps/search/Mooradians+Furniture+Albany+NY' },
            ].map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00aebd', fontSize: '13px', textDecoration: 'none', padding: '8px 12px', background: '#333333', borderRadius: '4px', border: '1px solid #404040' }}>
                <span style={{ opacity: 0.6 }}>↗</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Heads up callout */}
        <div style={{ background: 'rgba(0,174,189,0.06)', border: '1px solid rgba(0,174,189,0.25)', borderLeft: '3px solid #00aebd', borderRadius: '4px', padding: '16px 20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#00aebd', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>Know Before You Go In</p>
          <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: 1.6 }}>
            Liz built and runs a real paid digital program — Meta paid social, Google search, display retargeting. Do not treat her like a beginner. The opportunity is in the channel gaps she has not built yet, not the channels she already runs.
          </p>
        </div>

        <button
          onClick={() => router.push('/prep')}
          style={{ width: '100%', padding: '16px', background: '#00aebd', color: '#ffffff', borderRadius: '4px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          I&apos;m Ready — Start Pre-Call Prep →
        </button>
      </main>
    </div>
  )
}
