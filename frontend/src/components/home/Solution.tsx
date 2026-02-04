'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Users, Clock, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: <>Secure <br/> Archive</>,
    desc: "Vault your digital, financial, and physical legacy in our encrypted cloud with bank-grade security.",
    label: "Security"
  },
  {
    icon: Users,
    title: <>Trusted <br/> Contacts</>,
    desc: "Select the individuals who will receive keys to specific assets with granular control.",
    label: "Permissions"
  },
  {
    icon: Clock,
    title: <>Active <br/> Monitoring</>,
    desc: "Define check-in intervals to confirm your presence and ensure data safety.",
    label: "Continuity"
  },
  {
    icon: Zap,
    title: <>Smart <br/> Execution</>,
    desc: "Our automated protocols handle the verification and asset release process seamlessly.",
    label: "Automation"
  }
]

export default function Solution() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const xParallax = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])
  const smoothX = useSpring(xParallax, { stiffness: 50, damping: 20 })

  return (
    <section ref={containerRef} className="min-h-screen bg-[#D6D0C7] text-[#1A110D] py-40 px-6 md:px-12 relative overflow-hidden z-20">
      
      {/* Parallax Background Text */}
      <motion.div 
        style={{ x: smoothX }}
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-[0.05] select-none"
      >
        {/* <h2 className="text-[20vw] font-black tracking-tighter leading-none font-serif uppercase">
          ASSET INDEX
        </h2> */}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="mb-48"
        >
          <span className="inline-block font-sans text-xs uppercase tracking-[0.4em] opacity-40 mb-6 font-medium">
            The Solution
          </span>
          <h2 className="text-4xl md:text-7xl font-serif font-black leading-[0.85] tracking-tighter uppercase text-left">
            Complete <br/> Control . <br/> 
            <span className="opacity-20 italic">Unshakeable</span> <br/> Peace.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-32 md:gap-48">
          {features.map((f, i) => (
            <FeatureItem key={i} title={f.title} desc={f.desc} label={f.label} index={i} icon={f.icon} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureItem({ title, desc, label, index, icon: Icon }: { title: React.ReactNode, desc: string, label: string, index: number, icon: any }) {
    const itemRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "center center", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85])
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    const ySkew = useTransform(scrollYProgress, [0, 1], [5, -5])
    const brightness = useTransform(scrollYProgress, [0, 0.5, 1], ["brightness(0.4)", "brightness(1)", "brightness(0.4)"])

    return (
        <motion.div 
            ref={itemRef}
            style={{ 
                scale, 
                opacity, 
                filter: brightness,
                rotateX: ySkew 
            }}
            className={`w-full max-w-5xl flex flex-col ${index % 2 === 0 ? 'ml-0' : 'ml-auto md:text-right'} group`}
        >
            <div className={`border-l-2 border-[#1A110D]/10 ${index % 2 !== 0 ? 'md:border-l-0 md:border-r-2 md:pr-12 md:pl-0' : 'pl-12'} py-4`}>
                <div className={`flex items-center gap-4 mb-8 ${index % 2 !== 0 ? 'md:justify-end' : ''}`}>
                  <div className="w-12 h-12 rounded-full border border-[#1A110D]/20 flex items-center justify-center opacity-60">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.5em] opacity-40 uppercase font-sans">
                      0{index + 1} // {label}
                  </span>
                </div>
                
                <h3 className="text-4xl md:text-6xl font-serif font-black mb-8 tracking-tighter uppercase leading-none">
                    {title}
                </h3>
                
                <p className={`text-lg md:text-2xl opacity-60 max-w-xl leading-snug font-sans uppercase tracking-tight ${index % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                    {desc}
                </p>
            </div>
            
            {/* Visual Line Accent */}
            <motion.div 
                className="h-[1px] bg-gradient-to-r from-transparent via-[#1A110D]/20 to-transparent w-full mt-12"
                style={{ scaleX: scrollYProgress }}
            />
        </motion.div>
    )
}
