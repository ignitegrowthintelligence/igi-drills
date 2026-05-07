interface ChatBubbleProps {
  speaker: 'liz' | 'seller'
  text: string
}

export default function ChatBubble({ speaker, text }: ChatBubbleProps) {
  const isLiz = speaker === 'liz'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isLiz ? 'flex-start' : 'flex-end',
      marginBottom: '16px',
      gap: '10px',
      alignItems: 'flex-start',
    }}>
      {isLiz && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#4a9eff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: 700,
          color: '#070b14', flexShrink: 0,
        }}>LR</div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isLiz ? '#0d1526' : '#131f38',
        border: `1px solid ${isLiz ? '#1e3054' : '#1e3054'}`,
        borderRadius: isLiz ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#e2eaf6',
      }}>
        <div style={{ fontSize: '11px', color: '#6a87ab', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.04em' }}>
          {isLiz ? 'LIZ ROSE' : 'YOU'}
        </div>
        {text}
      </div>
      {!isLiz && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#1e3054', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: 700,
          color: '#6a87ab', flexShrink: 0,
        }}>You</div>
      )}
    </div>
  )
}
