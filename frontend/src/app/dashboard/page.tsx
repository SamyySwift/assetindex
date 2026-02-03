'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FolderClosed, Users, Activity } from 'lucide-react'

export default function DashboardPage() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      })
    }, container)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={container} className="space-y-8">
      <header className="mb-12">
        <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Your index is secure.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card p-6 rounded-xl border border-white/5 bg-card hover:bg-white/5 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
              <FolderClosed className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Assets</span>
          </div>
          <div className="text-4xl font-serif mb-1 group-hover:scale-105 transition-transform origin-left">0</div>
          <p className="text-sm text-muted-foreground">Documents secured</p>
        </div>

        <div className="stat-card p-6 rounded-xl border border-white/5 bg-card hover:bg-white/5 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contacts</span>
          </div>
          <div className="text-4xl font-serif mb-1 group-hover:scale-105 transition-transform origin-left">0</div>
          <p className="text-sm text-muted-foreground">Trusted assignees</p>
        </div>

        <div className="stat-card p-6 rounded-xl border border-white/5 bg-card hover:bg-white/5 transition-colors group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
          </div>
          <div className="text-3xl font-serif mb-1 text-emerald-400">Active</div>
          <p className="text-sm text-muted-foreground">Last check-in: Today</p>
        </div>
      </div>
    </div>
  )
}
