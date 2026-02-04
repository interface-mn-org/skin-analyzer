import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Manrope, Noto_Sans } from 'next/font/google'

import './globals.css'

const notoSans = Noto_Sans({ variable: '--font-sans' })

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Арьсны шинжилгээ',
  description: 'Арьсны шинжилгээ болон хувь хүнд тохируулсан зөвлөмж',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  minimumScale: 1,
  viewportFit: 'contain',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" className={manrope.variable} suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased bg-linear-to-b from-background via-background to-muted/40`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster position="top-center" closeButton richColors />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
