'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Problem() {
  const container = useRef<HTMLDivElement>(null)
  const pinSpacer = useRef<HTMLDivElement>(null)
  const textsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      const phrases = textsRef.current

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSpacer.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
        }
      })

      phrases.forEach((phrase, i) => {
        if (!phrase) return
        
        const chars = phrase.querySelectorAll('.char')
        const startTime = i * 2

        // Entrance: staggered characters + scale/y
        tl.fromTo(chars, 
          { 
            opacity: 0, 
            y: 50, 
            rotateX: -90,
            scale: 0.8
          },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            scale: 1,
            duration: 1.5, 
            stagger: 0.03,
            ease: "expo.out" 
          },
          startTime
        )
        // Exit: Move upwards and fade
        .to(phrase, {
          opacity: 0,
          y: -100,
          filter: "blur(20px)",
          duration: 1,
          ease: "power2.in"
        }, startTime + 1.5)
      })

      // Background Light Leaks animation
      gsap.to(".light-leak", {
        x: "20vw",
        y: "10vh",
        opacity: 0.4,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

    }, container)

    return () => ctx.revert()
  }, [])

  const phrasesItems = [
    {
      text: "Life is beautifully unpredictable.",
      align: "items-center text-center",
      accent: "Automated Digital Legacy"
    },
    {
      text: "But important information often gets lost.",
      align: "items-start text-left ml-[10%]",
      accent: "The Architecture of Permanence"
    },
    {
      text: "Leaving the people you love guessing.",
      align: "items-end text-right mr-[10%]",
      accent: "Secure Node 402"
    },
    {
      text: "It doesn't have to be this way.",
      align: "items-center text-center mt-12",
      accent: "Asset Index Protocols"
    }
  ]

  return (
    <section ref={container} className="bg-black text-white relative z-10 overflow-hidden">
      {/* Background Accents (The Void Texture) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="light-leak absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[150px]" />
        <div className="light-leak absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div ref={pinSpacer} className="h-screen w-full flex items-center justify-center relative">
        {phrasesItems.map((item, i) => (
          <div
            key={i}
            ref={(el) => { if(el) textsRef.current[i] = el }}
            className={`absolute inset-0 flex flex-col justify-center px-6 md:px-24 mb-12 ${item.align} opacity-0 pointer-events-none`}
            style={{ opacity: 1 }} // Controlled by GSAP
          >
            {/* <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/40 mb-4 block">
              {item.accent}
            </span> */}
            <h2 className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter uppercase max-w-6xl">
              {item.text.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap mr-[0.2em]">
                  {word.split("").map((char, ci) => (
                    <span key={ci} className="char inline-block">{char}</span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        ))}
      </div>
    </section>
  )
}

