interface HeaderProps {
  screen: string
}

export default function Header({ screen }: HeaderProps) {
  return (
    <header style={{
      background: '#1a1a1a',
      borderBottom: '1px solid #404040',
      padding: '0 24px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', color: '#00aebd', fontFamily: 'Inter, sans-serif' }}>
        IGI DRILLS
      </span>
      <span style={{ color: '#404040', fontSize: '13px' }}>|</span>
      <span style={{ fontSize: '13px', color: '#888888', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif' }}>
        {screen}
      </span>
    </header>
  )
}
