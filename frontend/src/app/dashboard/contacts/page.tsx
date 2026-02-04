'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Loader2, ShieldCheck, FolderOpen } from 'lucide-react'
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
        <button 
          onClick={handleAddContact}
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
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">Add friends, family, or legal representatives who should receive your assets.</p>
            <button 
              onClick={handleAddContact}
              className="text-sm font-medium text-white hover:underline underline-offset-4"
            >
              Add a contact
            </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => {
              const assignmentCount = getAssignmentCount(contact._id)
              
              return (
                <div 
                  key={contact._id} 
                  className="p-5 bg-card border border-white/5 rounded-xl hover:border-white/10 transition-all cursor-pointer group"
                  onClick={() => router.push(`/dashboard/contacts/${contact._id}`)}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-emerald-400">
                             <Users className="w-5 h-5" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                            {contact.relationship}
                        </span>
                    </div>
                    <h3 className="font-medium text-lg font-serif mb-1">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contact.email}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/5 mb-3">
                        <span className="flex items-center gap-1">
                            <FolderOpen className="w-3 h-3" />
                            {assignmentCount} asset{assignmentCount !== 1 ? 's' : ''}
                        </span>
                        <span>Added {new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAssignAssets(contact)
                      }}
                      className="w-full py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                    >
                      Assign Assets
                    </button>
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
