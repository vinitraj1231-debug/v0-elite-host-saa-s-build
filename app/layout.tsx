import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
})

export const metadata: Metadata = {
  title: 'EliteHost - AI-Powered Code Deployment',
  description: 'Deploy your code to production in seconds with AI-powered automation. VPS-first, domain-ready, production-grade hosting.',
  keywords: ['deployment', 'hosting', 'VPS', 'AI', 'Docker', 'cloud'],
  authors: [{ name: 'EliteHost' }],
  openGraph: {
    title: 'EliteHost - AI-Powered Code Deployment',
    description: 'Deploy your code to production in seconds with AI-powered automation.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
