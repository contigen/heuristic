import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { Provider } from 'jotai'

export const metadata: Metadata = {
  title: 'heuristic | AI-Powered Code Documentation',
  description: 'Generate intelligent documentation for your code repositories',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${GeistSans.className} ${GeistMono.variable}
      }`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Provider>{children}</Provider>
          <Toaster closeButton richColors duration={3000} />
        </ThemeProvider>
      </body>
    </html>
  )
}
