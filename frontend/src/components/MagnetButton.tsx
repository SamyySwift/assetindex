'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface MagnetButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export default function MagnetButton({ children, className, strength = 0.4 }: MagnetButtonProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = container.current
    if (!el) return

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" })

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = el.getBoundingClientRect()
      
      const centerX = left + width / 2
      const centerY = top + height / 2
      
      const x = clientX - centerX
      const y = clientY - centerY
      
      // Magnet pull
      xTo(x * strength)
      yTo(y * strength)
    }

    const onMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [strength])

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}
