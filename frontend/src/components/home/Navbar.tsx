'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Background change on scroll
      setIsScrolled(currentScrollY > 50)

      // Hide/Show on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-6",
            isScrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent"
          )}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tighter text-white uppercase italic">
                Asset <span className="text-white/40 group-hover:text-white transition-colors duration-500">Index</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-12 font-sans text-[11px] uppercase tracking-[0.3em] font-medium text-white/50">
              <Link href="/#solution" className="hover:text-white transition-colors duration-300">Architecture</Link>
              <Link href="/#process" className="hover:text-white transition-colors duration-300">Methodology</Link>
              <Link href="/#security" className="hover:text-white transition-colors duration-300">Infosec</Link>
            </div>

            <div className="flex items-center gap-8">
              <Link 
                href="/auth/login" 
                className="hidden md:block font-sans text-[11px] uppercase tracking-[0.3em] font-medium text-white/50 hover:text-white transition-colors duration-300"
              >
                Access
              </Link>
              <Link 
                href="/auth/register"
                className="group relative px-6 py-2 rounded-full border border-white/20 bg-white/5 overflow-hidden transition-all duration-300 hover:border-white hover:scale-105 active:scale-95"
              >
                <div className="relative z-10 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-white transition-colors duration-300 group-hover:text-black">
                  Register
                </div>
                <div className="absolute inset-0 bg-white translate-y-full transition-transform duration-500 cubic-bezier group-hover:translate-y-0" />
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
