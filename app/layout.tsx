// Tresser SaaS v0.1.2 - Client dropdown fix, appointment reminders, next appointment ticker
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
  title: 'Tresser | Premium Barber SaaS Platform',
  description: 'The ultimate operating system for modern barbershops. Bookings, analytics, and client management—all in one powerful platform.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tresserlogo-oXjiHRXm3b6u5yNlVyxJiJ30jezifY.svg',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tresserlogo-oXjiHRXm3b6u5yNlVyxJiJ30jezifY.svg',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tresserlogo-oXjiHRXm3b6u5yNlVyxJiJ30jezifY.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tresser',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d0d0f' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0f' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
