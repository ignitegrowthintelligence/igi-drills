'use client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function BriefPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#070b14', minHeight: '100vh' }}>
      <Header screen="Pre-Call Brief" />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#e2eaf6', marginBottom: '6px' }}>
            Your Prospect
          </h1>
          <p style={{ fontSize: '14px', color: '#6a87ab' }}>Read this before you start. This is real research. Treat it like a live call.</p>
        </div>

        {/* Business card */}
        <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2eaf6', marginBottom: '4px' }}>Reveal MedSpas</h2>
              <p style={{ fontSize: '13px', color: '#6a87ab' }}>Colorado Springs, CO</p>
            </div>
            <span style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
              MedSpa
            </span>
          </div>

          <div style={{ borderTop: '1px solid #1e3054', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#6a87ab', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Buyer</p>
              <p style={{ fontSize: '14px', color: '#e2eaf6', fontWeight: 600 }}>Elizabeth &quot;Liz&quot; Rose</p>
              <p style={{ fontSize: '13px', color: '#6a87ab' }}>Marketing Director</p>
              <p style={{ fontSize: '12px', color: '#6a87ab', marginTop: '2px' }}>~14 months in role</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#6a87ab', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Call Format</p>
              <p style={{ fontSize: '14px', color: '#e2eaf6' }}>16 minutes</p>
              <p style={{ fontSize: '13px', color: '#6a87ab' }}>Begins mid-call, no warmup</p>
            </div>
          </div>
        </div>

        {/* Why she agreed */}
        <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#6a87ab', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Why She Agreed to the Meeting</p>
          <p style={{ fontSize: '14px', color: '#e2eaf6', lineHeight: 1.6, fontStyle: 'italic' }}>
            &quot;Your outreach mentioned Ignite&apos;s experience helping other med spas attract new patients.&quot;
          </p>
        </div>

        {/* Research links */}
        <div style={{ background: '#0d1526', border: '1px solid #1e3054', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: '#6a87ab', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Research Links</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Reveal MedSpas Website', url: 'https://revealmedspas.com' },
              { label: 'Google: Reveal MedSpas Colorado Springs reviews', url: 'https://www.google.com/search?q=Reveal+MedSpas+Colorado+Springs+reviews' },
              { label: 'Reveal MedSpas Instagram', url: 'https://www.instagram.com/revealmedspas/' },
            ].map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a9eff', fontSize: '13px', textDecoration: 'none', padding: '8px 12px', background: '#131f38', borderRadius: '6px', border: '1px solid #1e3054' }}>
                <span style={{ opacity: 0.5 }}>↗</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Warning callout */}
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.35)', borderLeft: '3px solid #f59e0b', borderRadius: '6px', padding: '16px 20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>Heads Up</p>
          <p style={{ fontSize: '14px', color: '#e2eaf6', lineHeight: 1.6 }}>
            Liz is going to open the call by testing you. She will ask you to back up the claim from your outreach. Have one or two specific examples ready. Then pivot into discovery — don&apos;t pitch.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/prep')}
          style={{ width: '100%', padding: '16px', background: '#f59e0b', color: '#070b14', borderRadius: '6px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em' }}>
          I&apos;m Ready — Start Pre-Call Prep →
        </button>
      </main>
    </div>
  )
}
