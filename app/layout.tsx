import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IGI Drills | Reveal MedSpas',
  description: 'Discovery call simulator for Townsquare Ignite sales reps',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#070b14', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
