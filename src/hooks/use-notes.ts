'use client'

import { useState, useEffect } from 'react'
import { ContactNote } from '@/lib/supabase'

/**
 * Hook Notes CRM - Gestion des notes pour leads
 * Pattern DRY : CRUD complet avec état et optimistic updates
 */

export type NoteFormData = {
  type: 'call' | 'email' | 'meeting' | 'note'
  content: string
}

export function useNotes(leadId: string) {
  const [notes, setNotes] = useState<ContactNote[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer notes du lead
  const fetchNotes = async () => {
    if (!leadId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`)
      const result = await response.json()

      if (result.success) {
        setNotes(result.notes || [])
      } else {
        setError(result.message || 'Erreur lors du chargement des notes')
      }
    } catch (err) {
      setError('Impossible de charger les notes')
    } finally {
      setLoading(false)
    }
  }

  // Ajouter nouvelle note
  const addNote = async (data: NoteFormData): Promise<boolean> => {
    if (!leadId || !data.content.trim()) return false

    setSubmitting(true)
    setError(null)

    // Optimistic update
    const tempNote: ContactNote = {
      id: `temp_${Date.now()}`,
      date: new Date().toISOString(),
      type: data.type,
      content: data.content.trim(),
      author: 'Raphael'
    }
    
    setNotes(prev => [tempNote, ...prev])

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        // Remplacer note temporaire par celle du serveur
        setNotes(prev => 
          prev.map(note => 
            note.id === tempNote.id ? result.note : note
          )
        )
        return true
      } else {
        // Rollback optimistic update
        setNotes(prev => prev.filter(note => note.id !== tempNote.id))
        setError(result.message || 'Erreur lors de l\'ajout')
        return false
      }
    } catch (err) {
      // Rollback optimistic update
      setNotes(prev => prev.filter(note => note.id !== tempNote.id))
      setError('Impossible d\'ajouter la note')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  // Modifier note existante
  const updateNote = async (noteId: string, content: string): Promise<boolean> => {
    if (!content.trim()) return false

    setError(null)

    // Optimistic update
    const originalNotes = [...notes]
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId ? { ...note, content: content.trim() } : note
      )
    )

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, content })
      })

      const result = await response.json()

      if (result.success) {
        // Mettre à jour avec les données serveur
        setNotes(prev => 
          prev.map(note => 
            note.id === noteId ? result.note : note
          )
        )
        return true
      } else {
        // Rollback
        setNotes(originalNotes)
        setError(result.message || 'Erreur lors de la modification')
        return false
      }
    } catch (err) {
      // Rollback
      setNotes(originalNotes)
      setError('Impossible de modifier la note')
      return false
    }
  }

  // Supprimer note
  const deleteNote = async (noteId: string): Promise<boolean> => {
    setError(null)

    // Optimistic update
    const originalNotes = [...notes]
    setNotes(prev => prev.filter(note => note.id !== noteId))

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/notes?noteId=${noteId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        return true
      } else {
        // Rollback
        setNotes(originalNotes)
        setError(result.message || 'Erreur lors de la suppression')
        return false
      }
    } catch (err) {
      // Rollback
      setNotes(originalNotes)
      setError('Impossible de supprimer la note')
      return false
    }
  }

  // Helper : Statistiques notes
  const getNotesStats = () => {
    const byType = notes.reduce((acc, note) => {
      acc[note.type] = (acc[note.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const lastContact = notes
      .filter(note => ['call', 'email', 'meeting'].includes(note.type))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    return {
      total: notes.length,
      byType,
      lastContact: lastContact ? {
        type: lastContact.type,
        date: lastContact.date
      } : null
    }
  }

  // Helper : Formater type de note
  const formatNoteType = (type: ContactNote['type']): string => {
    const types = {
      call: 'Appel',
      email: 'Email', 
      meeting: 'RDV',
      note: 'Note'
    }
    return types[type] || type
  }

  // Initialisation
  useEffect(() => {
    fetchNotes()
  }, [leadId])

  return {
    notes,
    loading,
    submitting,
    error,
    // Actions
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
    // Utils
    getNotesStats,
    formatNoteType,
    // État
    hasNotes: notes.length > 0,
    isEmpty: !loading && notes.length === 0
  }
}
