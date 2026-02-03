'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  const container = useRef<HTMLDivElement>(null)
  const marquee = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      // Marquee animation logic
      const marqueeElement = marquee.current
      if (!marqueeElement) return

      // Create the infinite loop
      const marqueeAnim = gsap.to(marqueeElement, {
        xPercent: -50,
        repeat: -1,
        duration: 60,
        ease: "none",
        paused: false
      })

      // Direction and Velocity control
      ScrollTrigger.create({
        onUpdate: (self) => {
          const direction = self.direction // 1 for down, -1 for up
          const velocity = self.getVelocity() / 100
          
          // Adjust time scale based on direction and velocity
          // If scrolling down (direction 1), go left (positive timeScale)
          // If scrolling up (direction -1), go right (negative timeScale)
          gsap.to(marqueeAnim, {
            timeScale: direction * (1 + Math.abs(velocity)),
            duration: 0.5,
            ease: "power2.out"
          })
        }
      })

      // Content reveal
      gsap.from(".cta-content-reveal", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
        }
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="py-64 bg-white text-black relative z-10 overflow-hidden flex flex-col items-center">
      
      {/* Single Line Marquee Background */}
      <div className="absolute inset-0 flex items-center pointer-events-none opacity-[0.08] select-none overflow-hidden text-black">
        <div ref={marquee} className="whitespace-nowrap flex text-[28vw] font-serif font-black leading-none uppercase pr-[0.1em]">
          <span>INITIALIZE YOUR INDEX • SECURE THE LEGACY • </span>
          <span>INITIALIZE YOUR INDEX • SECURE THE LEGACY • </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="cta-content-reveal mb-8">
          <span className="font-sans text-[10px] uppercase tracking-[0.6em] text-black/40">Status: Terminal // Standby</span>
        </div>

        <h2 className="cta-content-reveal font-serif text-7xl md:text-9xl lg:text-[10rem] leading-[0.8] tracking-tighter uppercase mb-16">
          Ready to<br />
          <span className="italic">Begin.</span>
        </h2>

        <div className="cta-content-reveal">
          <Link 
            href="/auth/register" 
            className="group relative inline-flex items-center gap-6 px-16 py-8 bg-black text-white text-2xl font-bold rounded-full transition-all hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            <span>Initialize Your Index</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="cta-content-reveal mt-20 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-black/5 pt-12">
          {[
            { label: "Encryption", value: "AES-256-GCM" },
            { label: "Standard", value: "ERC-7546" },
            { label: "Network", value: "Mainnet 1.0" },
            { label: "Auth", value: "Zero-Knowledge" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-sans text-[9px] uppercase tracking-widest text-black/30 mb-2">{item.label}</span>
              <span className="font-serif text-sm font-medium tracking-tight italic">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edge Accents */}
      <div className="absolute top-12 left-12 h-20 w-[1px] bg-black/10" />
      <div className="absolute top-12 left-12 w-20 h-[1px] bg-black/10" />
      <div className="absolute bottom-12 right-12 h-20 w-[1px] bg-black/10" />
      <div className="absolute bottom-12 right-12 w-20 h-[1px] bg-black/10" />
    </section>
  )
}


