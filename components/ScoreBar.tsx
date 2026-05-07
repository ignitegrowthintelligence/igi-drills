interface ScoreBarProps {
  label: string
  score: number
  max: number
  reason?: string
  color?: string
}

export default function ScoreBar({ label, score, max, reason, color }: ScoreBarProps) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0
  const barColor = color || (pct >= 75 ? '#75BE19' : pct >= 45 ? '#ef9809' : '#f87171')

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '13px', color: barColor, fontWeight: 700 }}>{score}<span style={{ color: '#888888', fontWeight: 400 }}>/{max}</span></span>
      </div>
      <div style={{ height: '6px', background: '#404040', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: barColor,
          borderRadius: '3px',
          transition: 'width 0.6s ease',
        }} />
      </div>
      {reason && (
        <p style={{ fontSize: '12px', color: '#888888', marginTop: '5px', lineHeight: 1.5 }}>{reason}</p>
      )}
    </div>
  )
}
