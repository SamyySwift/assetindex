import { FolderClosed, Lock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Asset {
  _id: string
  name: string
  type: string
  description?: string
  accessInstructions?: string
}

export default async function DisclosurePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ key: string }>
}) {
  const { id } = await params
  const { key } = await searchParams

  // Fetch from Backend API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disclosure/${id}?key=${key}`, { cache: 'no-store' })
  const json = await res.json()

  if (!json.success) {
      if (json.error === 'Access Denied') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <Lock className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-serif mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">Invalid access credentials.</p>
                </div>
            </div>
          )
      }
      if (json.error === 'Disclosure Not Authorized') {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <h1 className="text-2xl font-serif mb-2">Disclosure Not Authorized</h1>
                    <p className="text-muted-foreground">The assets for this account have not been released.</p>
                </div>
            </div>
          )
      }
      return <div>Error loading disclosure.</div>
  }

  const { contact, user, assets } = json.data;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-white/10 pb-6">
            <h1 className="text-3xl md:text-4xl font-serif mb-2">Asset Disclosure</h1>
            <p className="text-muted-foreground">Prepared for {contact.name} regarding the estate of {user.name}.</p>
        </header>

        <div className="space-y-6">
            {assets.length === 0 ? (
                <p className="text-muted-foreground">No assets were documented.</p>
            ) : assets.map((asset: Asset) => (
                <div key={asset._id} className="bg-card border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                            <FolderClosed className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">{asset.name}</h3>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">{asset.type}</span>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 bg-black/20 p-4 rounded-lg">
                        <div>
                             <h4 className="text-xs text-muted-foreground uppercase mb-1">Access Instructions</h4>
                             <p className="font-mono text-sm">{asset.accessInstructions}</p>
                        </div>
                        {asset.description && (
                            <div>
                                <h4 className="text-xs text-muted-foreground uppercase mb-1">Description</h4>
                                <p className="text-sm">{asset.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
