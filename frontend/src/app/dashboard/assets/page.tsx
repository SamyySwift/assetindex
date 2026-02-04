'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Plus, FolderClosed, Trash2, Eye, Loader2, X } from 'lucide-react'
import AssetModal from '@/components/AssetModal'
import MagnetButton from '@/components/MagnetButton'
import { cn } from '@/lib/utils'

interface Asset {
  _id: string
  name: string
  type: string
  sensitivity: string
  description?: string
  accessInstructions?: string
  createdAt: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  async function fetchAssets() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const json = await res.json()
      setAssets(json)
      
      // Staggered entry for assets
      gsap.fromTo(".asset-item", 
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.ok) {
        fetchAssets()
      }
    } catch (e) {
      console.error(e)
    }
  }

  function handleView(asset: Asset) {
    setSelectedAsset(asset)
    setIsViewModalOpen(true)
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  return (
    <div className="relative min-h-full">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">My Assets</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <p className="text-muted-foreground font-medium tracking-wide uppercase text-xs">Secure Repository</p>
          </div>
        </div>
        <MagnetButton>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </MagnetButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
                <FolderClosed className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl mb-2">No assets found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">Start by adding your first important asset to the index.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-white hover:underline underline-offset-4"
            >
              Add an asset now
            </button>
        </div>
      ) : (
        <div className="grid gap-6">
            {assets.map((asset, i) => (
                <div 
                  key={asset._id} 
                  className="asset-item group p-6 glass-card glass-card-hover rounded-2xl flex items-center justify-between border-white/5 overflow-hidden"
                >
                    {/* Glow background on hover */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

                    <div 
                      className="flex items-center gap-6 flex-1 cursor-pointer relative z-10"
                      onClick={() => handleView(asset)}
                    >
                        <div className="p-4 bg-white/5 rounded-xl text-muted-foreground group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all duration-500 group-hover:scale-110">
                            <FolderClosed className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">{asset.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5 text-white/60 font-medium">{asset.type}</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className={cn(
                                    "px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]",
                                    asset.sensitivity === 'Critical' ? "bg-red-500/10 text-red-400" :
                                    asset.sensitivity === 'High' ? "bg-amber-500/10 text-amber-400" :
                                    "bg-emerald-500/10 text-emerald-400"
                                )}>{asset.sensitivity}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <button 
                        onClick={() => handleView(asset)}
                        className="p-3 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(asset._id)}
                        className="p-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                        title="Delete asset"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
            fetchAssets()
        }} 
      />

      {/* Asset View Modal */}
      {isViewModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsViewModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-serif">Asset Details</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Asset Name</label>
                <p className="text-lg font-medium mt-1">{selectedAsset?.name}</p>
              </div>
 
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="mt-1">{selectedAsset?.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sensitivity</label>
                  <p className={cn(
                    "mt-1 inline-block px-2 py-0.5 rounded text-sm",
                    selectedAsset?.sensitivity === 'Critical' ? "bg-red-500/10 text-red-400" :
                    selectedAsset?.sensitivity === 'High' ? "bg-amber-500/10 text-amber-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  )}>{selectedAsset?.sensitivity}</p>
                </div>
              </div>
 
              {selectedAsset?.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{selectedAsset?.description}</p>
                </div>
              )}
 
              {selectedAsset?.accessInstructions && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Access Instructions</label>
                  <div className="mt-1 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm whitespace-pre-wrap">{selectedAsset?.accessInstructions}</p>
                  </div>
                </div>
              )}
 
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="mt-1 text-sm">{selectedAsset?.createdAt ? new Date(selectedAsset.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}</p>
              </div>
            </div>
 
            <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if (selectedAsset) {
                    setIsViewModalOpen(false)
                    handleDelete(selectedAsset._id)
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
