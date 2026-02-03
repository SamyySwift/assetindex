'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileText, UserPlus, Clock, Bell, Lock } from 'lucide-react'

export default function HowItWorks() {
  const container = useRef<HTMLDivElement>(null)
  const pinSpacer = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Document Assets",
      desc: "Vault your digital, financial, and physical legacy in our encrypted cloud."
    },
    {
      number: "02",
      icon: UserPlus,
      title: "Assign Trustees",
      desc: "Select the individuals who will receive keys to specific assets."
    },
    {
      number: "03",
      icon: Clock,
      title: "Active Monitoring",
      desc: "Define check-in intervals to confirm your presence and safety."
    },
    {
      number: "04",
      icon: Bell,
      title: "Grace Period",
      desc: "If a ping is missed, a secure multi-layered timeout protocol begins."
    },
    {
      number: "05",
      icon: Lock,
      title: "Final Release",
      desc: "After verification, information is automatically released to your trustees."
    }
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      const stepElements = stepsRef.current

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSpacer.current,
          start: "top top",
          end: `+=${steps.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      })

      stepElements.forEach((step, i) => {
        if (!step) return
        
        const titleChars = step.querySelectorAll('.title-char')
        const bgNum = step.querySelector('.bg-number')
        const content = step.querySelector('.step-content')
        const icon = step.querySelector('.step-icon')

        const startTime = i * 2

        // Entrance
        tl.fromTo(bgNum, 
          { opacity: 0, scale: 0.8 },
          { opacity: 0.05, scale: 1, duration: 1.5, ease: "power2.out" },
          startTime
        )
        .fromTo(titleChars, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.02, ease: "expo.out" },
          startTime + 0.2
        )
        .fromTo(content,
          { opacity: 0, y: 20 },
          { opacity: 0.6, y: 0, duration: 1, ease: "power2.out" },
          startTime + 0.5
        )
        .fromTo(icon,
          { scale: 0, rotate: -45, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" },
          startTime + 0.3
        )

        // Exit (except for the last one)
        if (i < steps.length - 1) {
          tl.to(step, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power2.in"
          }, startTime + 1.5)
        }
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="bg-black text-white relative z-10 overflow-hidden">
      <div ref={pinSpacer} className="h-screen w-full flex items-center justify-center relative">
        {/* Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/5 rounded-full blur-[200px] pointer-events-none" />
        
        {steps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { if(el) stepsRef.current[i] = el }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0 pointer-events-none"
            style={{ opacity: 1 }} // Controlled by GSAP
          >
            {/* Massive Background Number */}
            <span className="bg-number absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-black text-[40vw] text-white opacity-0 select-none">
              {step.number}
            </span>

            <div className="relative z-10 flex flex-col items-center">
              <div className="step-icon w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-12 shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)]">
                <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <h3 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none tracking-tighter uppercase mb-6 text-center">
                {step.title.split("").map((c, ci) => (
                  <span key={ci} className="title-char inline-block">{c === " " ? "\u00A0" : c}</span>
                ))}
              </h3>

              <div className="step-content max-w-xl text-center">
                <p className="font-sans text-lg md:text-xl text-white/50 tracking-tight leading-relaxed uppercase">
                  {step.desc}
                </p>
              </div>
            </div>
            
            {/* Step Counter */}
            <div className="absolute bottom-12 flex items-center gap-12 pointer-events-auto">
               <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/20">Protocols</span>
               <div className="flex gap-2">
                 {steps.map((_, idx) => (
                   <div key={idx} className={`w-1 h-1 rounded-full ${idx === i ? "bg-white scale-150" : "bg-white/20"}`} />
                 ))}
               </div>
               <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/20">System v4.0</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

