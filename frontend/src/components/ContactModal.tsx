'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { X, Users, Loader2 } from 'lucide-react'
import MagnetButton from './MagnetButton'

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: 'Family'
  })

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

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0" 
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg glass-card rounded-3xl border-white/10 shadow-2xl overflow-hidden opacity-0"
      >
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-2xl font-serif tracking-tight">Add Contact</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Alexander Pierce"
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="alexander@guardian.com"
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Relationship</label>
              <select
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 appearance-none cursor-pointer"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Legal Representative">Legal Representative</option>
                <option value="Business Partner">Business Partner</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-muted-foreground hover:text-white transition-colors"
            >
              Cancel
            </button>
            <MagnetButton strength={0.2}>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                  Register Contact
                </button>
            </MagnetButton>
          </div>
        </form>
      </div>
    </div>
  )
}
