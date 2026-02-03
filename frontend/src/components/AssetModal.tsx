'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { X, Loader2 } from 'lucide-react'

interface AssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AssetModal({ isOpen, onClose, onSuccess }: AssetModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Animate In
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      )
    } else {
      // It's tricky to animate out with conditional rendering if component unmounts.
      // Usually we keep it mounted or handle exit before unmount.
      // For simplicity in this version, we accept hard unmount or use a library.
      // We'll rely on React key or just fast exit if possible, but standard conditional rendering makes exit animations hard without AnimatePresence.
      // We will make the parent handle "closing" state if we want exit anims, or just instant close for MVP.
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Need to handle token logic update too?
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to create asset')
      
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
        className="relative w-full max-w-lg bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-serif">Add New Asset</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</div>}

            <div className="grid gap-2">
                <label className="text-sm font-medium">Asset Name</label>
                <input required name="name" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20" placeholder="e.g. Coinbase Account" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Type</label>
                    <select required name="type" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20">
                        <option value="Financial">Financial</option>
                        <option value="Digital">Digital</option>
                        <option value="Physical">Physical</option>
                        <option value="Document">Document</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Sensitivity</label>
                    <select required name="sensitivity" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Access Instructions (Encrypted)</label>
                <textarea required name="accessInstructions" rows={3} className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20" placeholder="Where to find the key, password hint, etc." />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea name="description" rows={2} className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/20" placeholder="Extra details..." />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors">Cancel</button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-3 h-3 animate-spin"/>}
                    Safe Asset
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
