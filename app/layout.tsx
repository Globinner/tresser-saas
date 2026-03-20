import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, Heebo, Noto_Sans_Arabic, Rubik } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/i18n/language-context'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

// Hebrew font - beautiful modern font with Hebrew support
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: '--font-hebrew',
  display: 'swap',
});

// Bold Hebrew display font for hero titles
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["700", "800", "900"],
  variable: '--font-hebrew-display',
  display: 'swap',
});

// Arabic font - clean modern Arabic font
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tresser | Premium Barber SaaS',
  description: 'The ultimate operating system for modern barbershops. Bookings, analytics, and client management—all in one powerful platform.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${heebo.variable} ${rubik.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
