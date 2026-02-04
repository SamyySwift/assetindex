'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save, Activity, Check, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setUser(json.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/settings`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
            body: JSON.stringify(data)
        })
        const json = await res.json()
        if (json.success) {
            setUser(json.data)
            setMessage('Settings saved successfully.')
        }
    } catch (err) {
        console.error(err)
    } finally {
        setSaving(false)
    }
  }

  async function handleCheckIn() {
    setCheckingIn(true)
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/checkin`, { 
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const json = await res.json()
        if (json.success) {
            setUser((prev: any) => ({ 
              ...prev, 
              lastCheckIn: json.data.lastCheckIn,
              warningSent: json.data.warningSent,
              assetsReleased: json.data.assetsReleased
            }))
        }
    } catch (err) {
        console.error(err)
    } finally {
        setCheckingIn(false)
    }
  }

  // Calculate Status Metrics
  const lastCheckInDate = user?.lastCheckIn ? new Date(user.lastCheckIn) : null
  const frequency = user?.checkInFrequency
  
  const getNextCheckIn = (last: Date | null, freq: string) => {
    if (!last) return null
    const date = new Date(last)
    if (freq === '5 Minutes') date.setMinutes(date.getMinutes() + 5)
    else if (freq === 'Weekly') date.setDate(date.getDate() + 7)
    else if (freq === 'Monthly') date.setMonth(date.getMonth() + 1)
    else if (freq === 'Yearly') date.setFullYear(date.getFullYear() + 1)
    return date
  }

  const nextCheckInDue = getNextCheckIn(lastCheckInDate, frequency)
  const now = new Date()
  const minutesSinceLastCheckIn = lastCheckInDate ? Math.floor((now.getTime() - lastCheckInDate.getTime()) / (1000 * 60)) : 0
  const isOverdue = nextCheckInDue ? now > nextCheckInDue : false

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">Settings</h1>
        <p className="text-muted-foreground font-medium">Refine your digital legacy automation logic.</p>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {/* Inactivity Status Card */}
        <section className="glass-card rounded-2xl overflow-hidden border-white/5">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                    <h3 className="text-xl font-medium tracking-tight flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-400" />
                        Inactivity Status
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Real-time status of your automated standby.</p>
                </div>
                <button 
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    {checkingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Check-in Now
                </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-gradient-to-br from-transparent to-white/[0.01]">
                <div className="grid grid-cols-2 gap-8">
                    <StatusItem label="Check-in Frequency" value={user?.checkInFrequency} />
                    <StatusItem label="Grace Period" value={`${user?.gracePeriod} Days`} />
                    <div className="col-span-2">
                        <StatusItem label="Last Check-in Timestamp" value={lastCheckInDate?.toLocaleString()} />
                    </div>
                    <StatusItem label="Time Elapsed" value={`${minutesSinceLastCheckIn} minutes`} />
                </div>
                
                <div className="flex flex-col justify-between gap-8 h-full">
                    <div className="grid grid-cols-2 gap-8">
                        <StatusItem 
                            label="Assets Released" 
                            value={user?.assetsReleased ? "YES" : "NO"} 
                            valueClassName={user?.assetsReleased ? "text-red-400 font-bold" : "text-emerald-400"}
                        />
                        <StatusItem 
                            label="Is Overdue" 
                            value={isOverdue ? "YES" : "NO"} 
                            valueClassName={isOverdue ? "text-red-400 font-bold" : "text-emerald-400"}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Next Deadline</span>
                            <span className="text-lg font-serif tracking-tight">{nextCheckInDue?.toLocaleString() || 'Calculating...'}</span>
                        </div>
                        
                        <div className={cn(
                            "inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider",
                            isOverdue ? "bg-red-400/10 text-red-400 border border-red-400/20" : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                        )}>
                            <span className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", isOverdue ? "bg-red-400 animate-pulse" : "bg-emerald-400")} />
                            {isOverdue ? "Critical: Action Required" : "System Standing By"}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Automation Rules Form */}
        <form onSubmit={handleSave} className="space-y-10">
            <div className="glass-card rounded-2xl p-8 space-y-8 border-white/5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6 -mx-8 px-8 mb-2">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-xl font-medium tracking-tight">Automation Rules</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-white">Check-in Frequency</label>
                        <p className="text-xs text-muted-foreground leading-relaxed">Defines how often the AI engine expects a life-sign before initiating the grace period countdown.</p>
                        <select 
                            name="checkInFrequency" 
                            defaultValue={user?.checkInFrequency}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300"
                        >
                            <option value="5 Minutes">5 Minutes (Testing)</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-white">Grace Period (Days)</label>
                        <p className="text-xs text-muted-foreground leading-relaxed">The safety buffer added after a missed check-in before the index is officially disclosed to contacts.</p>
                        <input 
                            type="number" 
                            name="gracePeriod" 
                            defaultValue={user?.gracePeriod}
                            min={1}
                            max={365}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-6">
                {message && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        {message}
                    </div>
                )}
                <div className="flex-1" />
                <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                    Save Configuration
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}

function StatusItem({ label, value, valueClassName = "text-white" }: { label: string, value: string | undefined, valueClassName?: string }) {
    return (
        <div className="flex flex-col gap-2 group/item">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold transition-colors group-hover/item:text-white/40">{label}</span>
            <span className={cn("text-sm font-serif tracking-wide truncate", valueClassName)}>{value || 'N/A'}</span>
        </div>
    )
}
