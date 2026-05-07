interface HeaderProps {
  screen: string
}

export default function Header({ screen }: HeaderProps) {
  return (
    <header style={{
      background: '#0d1526',
      borderBottom: '1px solid #1e3054',
      padding: '0 24px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', color: '#f59e0b' }}>
        IGI DRILLS
      </span>
      <span style={{ color: '#1e3054', fontSize: '13px' }}>|</span>
      <span style={{ fontSize: '13px', color: '#6a87ab', letterSpacing: '0.04em' }}>
        {screen}
      </span>
    </header>
  )
}
