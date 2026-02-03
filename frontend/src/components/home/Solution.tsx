'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Shield, Users, Clock, Zap } from 'lucide-react'

export default function Solution() {
  const container = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features staggering in
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      })
    }, container)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: Shield,
      title: "Secure Archive",
      desc: "Bank-grade encryption for your most sensitive data and documents."
    },
    {
      icon: Users,
      title: "Trusted Contacts",
      desc: "Designate exactly who receives what, with granular permission controls."
    },
    {
      icon: Clock,
      title: "Automatic Monitoring",
      desc: "Our system checks in on you periodically based on your preferences."
    },
    {
      icon: Zap,
      title: "Smart Escalation",
      desc: "If you don't respond, we safely and automatically execute your instructions."
    }
  ]

  return (
    <section ref={container} className="py-24 md:py-32 bg-primary text-primary-foreground relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-primary-foreground selection:bg-black/20">Complete Control. Total Peace of Mind.</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-light">Asset Index is the bridge between your digital legacy and the people who matter most.</p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="feature-card p-8 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors duration-300">
              <feature.icon className="w-10 h-10 mb-6 text-primary-foreground/80" />
              <h3 className="text-2xl font-serif mb-3 text-primary-foreground">{feature.title}</h3>
              <p className="text-primary-foreground/70 leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
