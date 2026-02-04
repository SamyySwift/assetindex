'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { X, Loader2, Check } from 'lucide-react'

interface Asset {
  _id: string
  name: string
  type: string
  sensitivity: string
}

interface AssetAssignment {
  assetId: string
  permissionLevel: 'view' | 'edit' | 'full_access'
}

interface AssetAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  contactId: string
  contactName: string
}

export default function AssetAssignmentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  contactId,
  contactName 
}: AssetAssignmentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAssignments, setSelectedAssignments] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    if (isOpen) {
      fetchAssets()
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      )
    }
  }, [isOpen])

  async function fetchAssets() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const json = await res.json()
      setAssets(json)
    } catch (e) {
      console.error(e)
    }
  }

  function toggleAsset(assetId: string) {
    const newMap = new Map(selectedAssignments)
    if (newMap.has(assetId)) {
      newMap.delete(assetId)
    } else {
      newMap.set(assetId, 'view') // Default permission
    }
    setSelectedAssignments(newMap)
  }

  function updatePermission(assetId: string, permission: string) {
    const newMap = new Map(selectedAssignments)
    newMap.set(assetId, permission)
    setSelectedAssignments(newMap)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const assignments = Array.from(selectedAssignments.entries()).map(([assetId, permissionLevel]) => ({
      assetId,
      permissionLevel
    }))

    if (assignments.length === 0) {
      setError('Please select at least one asset')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ contactId, assignments }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to assign assets')
      
      onSuccess()
      onClose()
      setSelectedAssignments(new Map())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'view': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'edit': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'full_access': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      default: return 'text-white/60 bg-white/5 border-white/10'
    }
  }

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'Critical': return 'bg-red-500/10 text-red-400'
      case 'High': return 'bg-amber-500/10 text-amber-400'
      case 'Medium': return 'bg-blue-500/10 text-blue-400'
      default: return 'bg-emerald-500/10 text-emerald-400'
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
        className="relative w-full max-w-3xl bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif">Assign Assets</h2>
            <p className="text-sm text-muted-foreground">to {contactName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {error && <div className="mx-6 mt-4 text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

          <div className="flex-1 overflow-y-auto p-6">
            {assets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No assets available to assign.</p>
                <p className="text-sm mt-2">Create some assets first.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {assets.map((asset) => {
                  const isSelected = selectedAssignments.has(asset._id)
                  const permission = selectedAssignments.get(asset._id) || 'view'

                  return (
                    <div 
                      key={asset._id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-white/20 bg-white/5' 
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => toggleAsset(asset._id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-white bg-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-black" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{asset.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/70">
                                  {asset.type}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded ${getSensitivityColor(asset.sensitivity)}`}>
                                  {asset.sensitivity}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={permission}
                                  onChange={(e) => updatePermission(asset._id, e.target.value)}
                                  className={`text-xs px-3 py-1.5 rounded border ${getPermissionColor(permission)} bg-background focus:outline-none`}
                                >
                                  <option value="view">View Only</option>
                                  <option value="edit">Edit</option>
                                  <option value="full_access">Full Access</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-card">
            <p className="text-sm text-muted-foreground">
              {selectedAssignments.size} asset{selectedAssignments.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || selectedAssignments.size === 0}
                className="px-4 py-2 text-sm font-medium bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin"/>}
                Assign {selectedAssignments.size > 0 && `(${selectedAssignments.size})`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
