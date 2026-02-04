'use client'

import { Mail, Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#D6D0C7] text-[#1A110D] pt-24 pb-12 px-6 md:px-12 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Contact Section */}
          <div className="space-y-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#1A110D]/40">Contact</span>
            <div className="space-y-4 font-serif text-lg md:text-xl">
              <p className="hover:italic cursor-pointer transition-all">hello@assetindex.io</p>
              <div className="h-[1px] w-12 bg-[#1A110D]/20" />
              <div className="leading-tight">
                <p>880 Atlantic Avenue</p>
                <p>Brooklyn, NY 11238</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#1A110D]/40">Navigator</span>
            <div className="flex flex-col gap-4 font-serif text-lg md:text-xl">
              <Link href="/" className="hover:italic hover:translate-x-2 transition-all">The Index</Link>
              <Link href="/about" className="hover:italic hover:translate-x-2 transition-all">Philosophy</Link>
              <Link href="/security" className="hover:italic hover:translate-x-2 transition-all">Infrastructure</Link>
              <Link href="/manifesto" className="hover:italic hover:translate-x-2 transition-all">Manifesto</Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#1A110D]/40">Connect</span>
            <div className="flex flex-col gap-4 font-serif text-lg md:text-xl">
              <a href="#" className="hover:italic hover:translate-x-2 transition-all">Twitter / X</a>
              <a href="#" className="hover:italic hover:translate-x-2 transition-all">LinkedIn</a>
              <a href="#" className="hover:italic hover:translate-x-2 transition-all">GitHub</a>
              <a href="#" className="hover:italic hover:translate-x-2 transition-all">Instagram</a>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-[#1A110D]/40">Status</span>
            <div className="font-serif">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                 <span className="text-lg">Network Operational</span>
               </div>
               <p className="text-sm opacity-60">Verified Continuity Protocol Active</p>
            </div>
          </div>
        </div>

        {/* Monumental Branding */}
        <div className="border-t border-[#1A110D]/10 pt-12 mt-12 overflow-hidden">
          <h2 className="font-serif text-[13vw] leading-[0.75] tracking-[-0.05em] uppercase text-[#1A110D] select-none pointer-events-none whitespace-nowrap">
            Asset Index
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-[10px] uppercase tracking-[0.2em] text-[#1A110D]/50 border-t border-[#1A110D]/5 pt-8">
          <p>© {currentYear} Asset Index Protocols. All Rights Reserved.</p>
          <div className="flex gap-12">
            <Link href="/privacy" className="hover:text-[#1A110D] transition-colors">Privacy Privacy</Link>
            <Link href="/terms" className="hover:text-[#1A110D] transition-colors">Legal Framework</Link>
          </div>
          <p className="flex items-center gap-2">
            Built for Permanence 
            <span className="w-1 h-1 rounded-full bg-[#1A110D]/20" /> 
            v4.2.0
          </p>
        </div>
      </div>
    </footer>
  )
}