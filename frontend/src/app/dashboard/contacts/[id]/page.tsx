'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FolderOpen, Loader2, Trash2, Edit2, Mail, User } from 'lucide-react'
import AssetAssignmentModal from '@/components/AssetAssignmentModal'
import { cn } from '@/lib/utils'

interface Contact {
  _id: string
  name: string
  email: string
  relationship: string
  createdAt: string
}

interface Asset {
  _id: string
  name: string
  type: string
  sensitivity: string
  description?: string
}

interface Assignment {
  _id: string
  contactId: string
  assetId: Asset
  permissionLevel: string
  createdAt: string
}

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  const [contact, setContact] = useState<Contact | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)

  async function fetchContactDetails() {
    try {
      // Fetch contact
      const contactRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const contacts = await contactRes.json()
      const foundContact = contacts.find((c: Contact) => c._id === contactId)
      setContact(foundContact || null)

      // Fetch assignments
      const assignmentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/contact/${contactId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const assignmentsData = await assignmentsRes.json()
      setAssignments(assignmentsData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveAssignment(assignmentId: string) {
    if (!confirm('Remove this asset assignment?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (res.ok) {
        fetchContactDetails()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleUpdatePermission(assignmentId: string, newPermission: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ permissionLevel: newPermission })
      })

      if (res.ok) {
        fetchContactDetails()
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchContactDetails()
  }, [contactId])

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'view': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      case 'edit': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'full_access': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      default: return 'text-white/60 bg-white/5 border-white/10'
    }
  }

  const getPermissionLabel = (level: string) => {
    switch (level) {
      case 'view': return 'View Only'
      case 'edit': return 'Edit'
      case 'full_access': return 'Full Access'
      default: return level
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Contact not found</p>
        <button
          onClick={() => router.push('/dashboard/contacts')}
          className="mt-4 text-sm text-white hover:underline"
        >
          Back to Contacts
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => router.push('/dashboard/contacts')}
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Contacts
      </button>

      {/* Contact Info Card */}
      <div className="bg-card border border-white/5 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-white/5 rounded-lg text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-serif mb-2">{contact.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {contact.email}
                </span>
                <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/70">
                  {contact.relationship}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Added {new Date(contact.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAssignmentModalOpen(true)}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors text-sm"
          >
            Assign More Assets
          </button>
        </div>
      </div>

      {/* Assigned Assets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif mb-1">Assigned Assets</h2>
            <p className="text-sm text-muted-foreground">
              {assignments.length} asset{assignments.length !== 1 ? 's' : ''} assigned to this contact
            </p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
              <FolderOpen className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg mb-2">No assets assigned yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Assign assets to this contact to grant them access with specific permissions.
            </p>
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="text-sm font-medium text-white hover:underline underline-offset-4"
            >
              Assign assets now
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="p-5 bg-card border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-3 bg-white/5 rounded-lg text-muted-foreground">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg font-serif mb-2">
                        {assignment.assetId.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/70">
                          {assignment.assetId.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getSensitivityColor(assignment.assetId.sensitivity)}`}>
                          {assignment.assetId.sensitivity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permission Control */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Permission Level</span>
                    <select
                      value={assignment.permissionLevel}
                      onChange={(e) => handleUpdatePermission(assignment._id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded border ${getPermissionColor(assignment.permissionLevel)} bg-background focus:outline-none cursor-pointer`}
                    >
                      <option value="view">View Only</option>
                      <option value="edit">Edit</option>
                      <option value="full_access">Full Access</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleRemoveAssignment(assignment._id)}
                    className="w-full py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      <AssetAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSuccess={() => {
          fetchContactDetails()
        }}
        contactId={contact._id}
        contactName={contact.name}
      />
    </div>
  )
}
