'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

export default function Hero() {
  const container = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const titleGroupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      
      tl.set(container.current, { visibility: 'visible' })
      
      // Text and UI Elements Reveal
      tl.from(".char", {
        y: "110%",
        opacity: 0,
        rotate: 5,
        duration: 2,
        stagger: 0.02,
        ease: "expo.out"
      })
      .from(".ui-fade", {
        opacity: 0,
        y: 20,
        duration: 1.5,
        stagger: 0.2,
      }, "-=1.5")
      .from(bgRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 3,
        ease: "power2.out"
      }, 0)

      // Parallax & Masking Scroll
      gsap.to(bgRef.current, {
        yPercent: 40,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })

      gsap.to(titleGroupRef.current, {
        yPercent: -20,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="relative h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-black invisible">
      {/* Cinematic Background Layer */}
      <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[0.2]"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        {/* Deep Black Gradients (The Void) */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" /> */}
        {/* <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-black to-transparent z-10" /> */}
      </div>
      
      {/* Content Container */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <div ref={titleGroupRef} className="flex flex-col items-center">
          {/* <div className="ui-fade mb-6 opacity-60">
            <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-light text-white">Automated Digital Legacy</span>
          </div> */}

          <h1 className="font-serif font-bold text-[12vw] md:text-[10vw] leading-[0.8] tracking-[-0.03em] text-white uppercase text-center flex flex-col items-center">
            <div className="overflow-hidden py-4 h-[12vw] md:h-[10vw] flex items-center justify-center">
              {"Your".split("").map((c, i) => <span key={i} className="char inline-block">{c}</span>)}
              <span className="char inline-block opacity-0 w-[0.2em]">-</span>
              {"Assets.".split("").map((c, i) => <span key={i} className="char inline-block">{c}</span>)}
            </div>
            <div className="overflow-hidden py-4 h-[12vw] md:h-[10vw] text-white/20 italic flex items-center justify-center">
              {"Your".split("").map((c, i) => <span key={i} className="char inline-block">{c}</span>)}
              <span className="char inline-block opacity-0 w-[0.2em]">-</span>
              {"Rules.".split("").map((c, i) => <span key={i} className="char inline-block">{c}</span>)}
            </div>
          </h1>

          <div className="ui-fade max-w-lg mx-auto text-center mt-12 px-6">
            <p className="font-sans text-sm md:text-base text-white/50 tracking-wider leading-relaxed uppercase">
              The Architecture of Permanence in a <span className="text-white">Transient</span> Digital World.
            </p>
          </div>
        </div>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-10 bottom-24 z-30 hidden xl:flex flex-col gap-4 items-start ui-fade">
        <div className="w-[1px] h-32 bg-white/20" />
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] [writing-mode:vertical-rl] text-white/40">Secure Node 402</span>
      </div>

      <div className="absolute right-10 bottom-24 z-30 hidden xl:flex flex-col gap-4 items-end ui-fade text-right">
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/40 max-w-[150px]">
          Encrypted Documentation
        </span>
        <div className="w-[1px] h-32 bg-white/20" />
      </div>
    </section>
  )
}

