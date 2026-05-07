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
          background: '#00aebd', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: 700,
          color: '#ffffff', flexShrink: 0,
        }}>LR</div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isLiz ? '#2a2a2a' : '#333333',
        border: `1px solid ${isLiz ? '#404040' : '#404040'}`,
        borderRadius: isLiz ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#ffffff',
      }}>
        <div style={{ fontSize: '11px', color: '#888888', marginBottom: '4px', fontWeight: 600, letterSpacing: '0.04em' }}>
          {isLiz ? 'LIZ ROSE' : 'YOU'}
        </div>
        {text}
      </div>
      {!isLiz && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#404040', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '11px', fontWeight: 700,
          color: '#888888', flexShrink: 0,
        }}>You</div>
      )}
    </div>
  )
}
