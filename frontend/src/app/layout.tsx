'use client'

import type { Metadata } from 'next'
import { Syne, Instrument_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import SmoothScroll from '@/components/smooth-scroll'
import { usePathname } from 'next/navigation'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

import Navbar from '@/components/home/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        syne.variable,
        instrumentSans.variable
      )}>
        {!isDashboard && <Navbar />}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
