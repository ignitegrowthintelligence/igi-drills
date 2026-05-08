import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IGI Drills | Mooradians',
  description: 'Discovery call simulator for Townsquare Ignite sales reps',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
