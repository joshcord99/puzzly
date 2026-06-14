import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Puzzly Companion',
  description: 'A shared puzzle companion for collaborative play.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
