import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

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
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className=''>{children}</div>
          <Toaster closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
