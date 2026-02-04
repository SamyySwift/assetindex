'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { X, Save, Loader2 } from 'lucide-react'
import MagnetButton from './MagnetButton'

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
  const [formData, setFormData] = useState({
    name: '',
    type: 'Credentials',
    sensitivity: 'Medium',
    description: '',
    accessInstructions: ''
  })

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

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0" 
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg glass-card rounded-3xl border-white/10 shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
      >
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-2xl font-serif tracking-tight">Register Asset</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</div>}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Asset Name</label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g. BTC Private Keys"
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Type</label>
                <select
                  name="type"
                  className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Crypto Ledger">Crypto Ledger</option>
                  <option value="Seed Phrases">Seed Phrases</option>
                  <option value="Stock Portfolio">Stock Portfolio</option>
                  <option value="Real Estate Deeds">Real Estate Deeds</option>
                  <option value="Social Media Account">Social Media Account</option>
                  <option value="Insurance Policy">Insurance Policy</option>
                  <option value="Credentials">Credentials</option>
                  <option value="Document">Document</option>
                  <option value="Secret Note">Secret Note</option>
                  <option value="Hardware Access">Hardware Access</option>
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none opacity-20">
                    <Save className="w-3 h-3 rotate-90" />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Sensitivity</label>
                <select
                  name="sensitivity"
                  className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 appearance-none cursor-pointer"
                  value={formData.sensitivity}
                  onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none opacity-20">
                    <Save className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Description (Optional)</label>
              <textarea
                name="description"
                rows={1}
                placeholder="Briefly describe what this asset is..."
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 resize-none placeholder:text-white/10"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Access Instructions</label>
              <p className="text-[10px] text-muted-foreground mb-4 italic opacity-50">These instructions will be encrypted and only shared with assigned contacts upon disclosure.</p>
              <textarea
                required
                name="accessInstructions"
                rows={3}
                placeholder="How should your heirs access this asset? (e.g. Master password is...)"
                className="w-full bg-transparent border-0 border-b border-white/10 px-0 py-4 text-sm focus:outline-none focus:border-white transition-all duration-500 placeholder:text-white/10"
                value={formData.accessInstructions}
                onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
              />
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
                  className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 group shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  Register Asset
                </button>
            </MagnetButton>
          </div>
        </form>
      </div>
    </div>
  )
}
