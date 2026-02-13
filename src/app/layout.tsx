import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/layout/header'
import { ReactQueryProvider } from '@/providers/react-query-provider'

import './globals.css'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Clean minimal dashboard application',
}

const themeScript = `
(function() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ReactQueryProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
