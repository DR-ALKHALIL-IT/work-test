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

const themeScript =
  '(function(){var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s||(d?"dark":"light");document.documentElement.classList.toggle("dark",t==="dark");})();'

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
