'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save, Activity, Check } from 'lucide-react'
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
            setUser((prev: any) => ({ ...prev, lastCheckIn: json.data.lastCheckIn }))
        }
    } catch (err) {
        console.error(err)
    } finally {
        setCheckingIn(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-serif mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Configure automation and privacy logic.</p>

      <div className="mb-8 p-6 bg-card border border-emerald-500/20 rounded-xl">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Status Check
                </h3>
                <p className="text-sm text-muted-foreground">Confirm you are active to reset the timer.</p>
            </div>
            <button 
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
                {checkingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Check-in Now
            </button>
        </div>
        <div className="text-sm bg-background/50 p-3 rounded border border-white/5">
            Last check-in: <span className="text-white font-mono">{new Date(user?.lastCheckIn).toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4 p-6 bg-card border border-white/5 rounded-xl">
            <h3 className="text-lg font-medium">Automation Rules</h3>
            
            <div className="grid gap-2">
                <label className="text-sm font-medium">Check-in Frequency</label>
                <p className="text-xs text-muted-foreground mb-2">How often should we ask for confirmation?</p>
                <select 
                    name="checkInFrequency" 
                    defaultValue={user?.checkInFrequency}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20"
                >
                    <option value="5 Minutes">5 Minutes (Testing)</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Grace Period (Days)</label>
                <p className="text-xs text-muted-foreground mb-2">Time to wait after a missed check-in before notifying contacts.</p>
                <input 
                    type="number" 
                    name="gracePeriod" 
                    defaultValue={user?.gracePeriod}
                    min={1}
                    max={365}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20"
                />
            </div>
        </div>

        {message && <p className="text-emerald-400 text-sm">{message}</p>}

        <button 
            type="submit" 
            disabled={saving}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
        >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
        </button>
      </form>
    </div>
  )
}
