'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { Plus, Users, Loader2, ShieldCheck, FolderOpen } from 'lucide-react'
import MagnetButton from '@/components/MagnetButton'
import ContactModal from '@/components/ContactModal'
import AssetAssignmentModal from '@/components/AssetAssignmentModal'
import { cn } from '@/lib/utils'

interface Contact {
  _id: string
  name: string
  email: string
  relationship: string
  createdAt: string
}

interface Assignment {
  _id: string
  contactId: string
  assetId: string
}

interface Asset {
  _id: string
  name: string
}

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const container = useRef<HTMLDivElement>(null)

  async function fetchContacts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const json = await res.json()
      setContacts(json)
      
      // Staggered entry for contacts
      gsap.fromTo(".contact-card", 
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: "expo.out", delay: 0.1 }
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAssignments() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const json = await res.json()
      setAssignments(json)
    } catch (e) {
      console.error(e)
    }
  }

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

  useEffect(() => {
    fetchContacts()
    fetchAssignments()
    fetchAssets()
  }, [])

  function getAssignmentCount(contactId: string) {
    return assignments.filter(a => a.contactId === contactId).length
  }

  function handleAssignAssets(contact: Contact) {
    setSelectedContact(contact)
    setIsAssignmentModalOpen(true)
  }

  function handleAddContact() {
    if (assets.length === 0) {
      alert('Please create at least one asset before adding contacts.')
      router.push('/dashboard/assets')
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif mb-2">Trusted Contacts</h1>
          <p className="text-muted-foreground">People designated to receive your assets.</p>
        </div>
        <MagnetButton>
          <button 
            onClick={handleAddContact}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </MagnetButton>
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
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">Add friends, family, or legal representatives who should receive your assets.</p>
            <button 
              onClick={handleAddContact}
              className="text-sm font-medium text-white hover:underline underline-offset-4"
            >
              Add a contact
            </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact, i) => {
              const assignmentCount = getAssignmentCount(contact._id)
              
              return (
                <div 
                  key={contact._id} 
                  className="contact-card group relative p-8 glass-card glass-card-hover rounded-2xl border-white/5 cursor-pointer overflow-hidden transition-all duration-500"
                  onClick={() => router.push(`/dashboard/contacts/${contact._id}`)}
                >
                    {/* Hover Glow */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-white/5 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                 <Users className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 font-bold uppercase tracking-wider">
                                {contact.relationship}
                            </span>
                        </div>
                        
                        <h3 className="text-2xl font-serif mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground mb-8 font-medium">{contact.email}</p>
                        
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4 border-t border-white/5 mb-6">
                            <span className="flex items-center gap-2">
                                <FolderOpen className="w-3.5 h-3.5" />
                                {assignmentCount} {assignmentCount === 1 ? 'Asset' : 'Assets'}
                            </span>
                            <span className="opacity-60">ID: {contact._id.slice(-4).toUpperCase()}</span>
                        </div>

                        <MagnetButton strength={0.2}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAssignAssets(contact)
                              }}
                              className="w-full py-3 text-sm font-bold bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20 active:scale-[0.98]"
                            >
                              Assign Assets
                            </button>
                        </MagnetButton>
                    </div>
                </div>
              )
            })}
        </div>
      )}

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          fetchContacts()
          fetchAssignments()
        }} 
      />

      {selectedContact && (
        <AssetAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false)
            setSelectedContact(null)
          }}
          onSuccess={() => {
            fetchAssignments()
          }}
          contactId={selectedContact._id}
          contactName={selectedContact.name}
        />
      )}
    </div>
  )
}
