'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { FolderClosed, Users, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const container = useRef<HTMLDivElement>(null)

  const [stats, setStats] = useState({ assets: 0, contacts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [assetsRes, contactsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ])
        const [assets, contacts] = await Promise.all([assetsRes.json(), contactsRes.json()])
        setStats({ 
          assets: assets.length || 0, 
          contacts: contacts.length || 0 
        })
      } catch (e) {
        console.error('Failed to fetch stats:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    const ctx = gsap.context(() => {
      // Entrance animation for content
      gsap.from(".stat-card", {
        y: 60,
        opacity: 0,
        scale: 0.9,
        filter: "blur(20px)",
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        clearProps: "all"
      })

      gsap.from(".dashboard-header", {
        y: -20,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power4.out"
      })
      
      // Infinite floating animation for background elements
      gsap.to(".bg-blob", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={container} className="relative min-h-full">
      {/* Subtle Background Blobs for depth */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 blur-[120px] bg-blob pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-500/5 blur-[100px] bg-blob pointer-events-none" />

      <header className="mb-16 dashboard-header">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">Overview</h1>
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <p className="text-muted-foreground font-medium tracking-wide uppercase text-xs">A.I. Engine Standby</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
            icon={FolderClosed} 
            label="Digital Assets" 
            value={loading ? "..." : stats.assets.toString()} 
            desc="Encrypted documents" 
            color="blue"
        />
        <StatCard 
            icon={Users} 
            label="Trusted Contacts" 
            value={loading ? "..." : stats.contacts.toString()} 
            desc="Verified assignees" 
            color="emerald"
        />
        <StatCard 
            icon={Activity} 
            label="System Status" 
            value="Active" 
            desc="Monitoring legacy" 
            color="amber"
            isStatus
        />
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, desc, color, isStatus = false }: any) {
    const colorClasses: any = {
        blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        emerald: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        amber: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
    }

    return (
        <div className="stat-card group relative p-8 rounded-2xl glass-card glass-card-hover border-white/5 overflow-hidden">
            {/* Hover Glow Effect */}
            <div className={cn(
                "absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none",
                color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
            )} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className={cn("p-4 rounded-xl transition-all duration-500 group-hover:scale-110", colorClasses[color])}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
                </div>
                
                <div className={cn(
                    "text-5xl font-serif mb-2 tracking-tighter transition-all duration-500 group-hover:translate-x-2 text-white",
                    isStatus && "text-emerald-400 text-glow-emerald"
                )}>
                    {value}
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
