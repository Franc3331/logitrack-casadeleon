import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | LogiTrack',
    default: 'LogiTrack — Portal de Seguimiento Logístico',
  },
  description:
    'Rastrea tus envíos en tiempo real y descarga tus documentos de manera sencilla con LogiTrack.',
  keywords: ['logística', 'seguimiento', 'envíos', 'tracking', 'remitos'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
