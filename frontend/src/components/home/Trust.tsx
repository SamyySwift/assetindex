'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Lock, ShieldCheck, EyeOff } from 'lucide-react'

export default function Trust() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trust-item", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-24 bg-background text-foreground relative z-10">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-16 text-foreground tracking-wide">Built on unshakeable foundations.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="trust-item flex flex-col items-center gap-4">
            <Lock className="w-10 h-10 text-primary" />
            <h3 className="text-xl font-bold">AES-256 Encryption</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Your data is encrypted at rest and in transit. Even we cannot read your content.</p>
          </div>
          <div className="trust-item flex flex-col items-center gap-4">
            <EyeOff className="w-10 h-10 text-primary" />
            <h3 className="text-xl font-bold">Zero-Knowledge</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">You hold the keys. We simply facilitate the transfer when the time is right.</p>
          </div>
          <div className="trust-item flex flex-col items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
            <h3 className="text-xl font-bold">Verified Contacts</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Multi-factor identity verification ensures only your intended recipients gain access.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
