'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderClosed, Users, Settings, LogOut } from 'lucide-react'
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
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 border-r border-white/5 bg-card/50 backdrop-blur-xl z-50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="font-serif text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            A.I.
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                            isActive 
                                ? "bg-white/10 text-white" 
                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
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
