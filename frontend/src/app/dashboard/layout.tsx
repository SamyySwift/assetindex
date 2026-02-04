'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderClosed, Users, Settings, LogOut } from 'lucide-react'
import CursorFollower from '@/components/CursorFollower'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: FolderClosed, label: 'Assets', href: '/dashboard/assets' },
    { icon: Users, label: 'Contacts', href: '/dashboard/contacts' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground bg-mesh">
      <CursorFollower />
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 glass-card border-y-0 border-l-0 border-r-white/10 z-50 hidden md:flex flex-col">
        <div className="p-8 border-b border-white/5">
          <Link href="/dashboard" className="font-serif text-3xl tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2">
            <span className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm text-xl font-bold italic">A</span>
            Index
          </Link>
        </div>
        
        <nav className="flex-1 p-4 py-8 space-y-3">
            {navItems.map((item, i) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isActive 
                                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                        )}
                    >
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                        )}
                        <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="font-medium tracking-tight">{item.label}</span>
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-4 px-4 py-3 w-full text-left text-muted-foreground hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-500/10 group"
            >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium tracking-tight">Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Mobile Nav (Bottom or Top - Simplified for MVP as a top bar or similar, but for now just hidden on mobile and letting main content take over or simple top bar) */}
      
      {/* Main Content */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  )
}
