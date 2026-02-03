'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { X, Loader2 } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ContactModal({ isOpen, onClose, onSuccess }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      )
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create contact')
      
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0" 
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-serif">Add Trusted Contact</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</div>}

            <div className="grid gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <input required name="name" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20" placeholder="e.g. John Doe" />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Email Address</label>
                <input required type="email" name="email" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20" placeholder="john@example.com" />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Relationship</label>
                <select required name="relationship" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20">
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Legal">Legal</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors">Cancel</button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-3 h-3 animate-spin"/>}
                    Send Invitation
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
