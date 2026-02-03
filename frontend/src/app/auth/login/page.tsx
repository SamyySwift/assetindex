'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      })
    })
    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Success
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="bg-card border border-white/5 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Sign in to access your secure vault.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80" htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            required
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-muted-foreground/50"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground/80" htmlFor="password">Password</label>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Forgot?</Link>
            </div>
          <input 
            type="password" 
            name="password" 
            id="password"
            required
            className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-muted-foreground/50"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-foreground underline underline-offset-4 hover:opacity-80">
          Create one
        </Link>
      </div>
    </div>
  )
}
