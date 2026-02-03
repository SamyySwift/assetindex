'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Loader2, ShieldCheck, Clock } from 'lucide-react'
import ContactModal from '@/components/ContactModal'
import { cn } from '@/lib/utils'

interface Contact {
  _id: string
  name: string
  email: string
  relationship: string
  status: string
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function fetchContacts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const json = await res.json()
      setContacts(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Trusted Contacts</h1>
          <p className="text-muted-foreground">People designated to receive your assets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
                <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl mb-2">No contacts yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">Add friends, family, or legal representatives who should be notified securely.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-medium text-white hover:underline underline-offset-4"
            >
              Add a contact
            </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
                <div key={contact._id} className="p-5 bg-card border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-emerald-400">
                             <Users className="w-5 h-5" />
                        </div>
                        <span className={cn(
                            "text-xs px-2 py-1 rounded-full border",
                            contact.status === 'Active' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" :
                            contact.status === 'Pending' ? "border-amber-500/20 bg-amber-500/10 text-amber-400" :
                            "border-red-500/20 bg-red-500/10 text-red-400"
                        )}>
                            {contact.status}
                        </span>
                    </div>
                    <h3 className="font-medium text-lg font-serif mb-1">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contact.email}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {contact.relationship}
                        </span>
                        <span>Added {new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
      )}

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchContacts} 
      />
    </div>
  )
}
