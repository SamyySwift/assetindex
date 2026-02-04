'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const inner = innerRef.current
    if (!cursor || !inner) return

    const moveCursor = (e: MouseEvent) => {
      // Main follower with slight lag
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
      })
      
      // Fast inner dot
      gsap.to(inner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power3.out'
      })
    }

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, .stat-card, input, select, textarea')
      
      if (isInteractive) {
        gsap.to(cursor, {
          scale: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          duration: 0.3
        })
      } else {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3
        })
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleHover)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleHover)
    }
  }, [])

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      <div 
        ref={innerRef}
        className="fixed top-0 left-0 w-1 h-1 pointer-events-none z-[9999] bg-white rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
    </>
  )
}
