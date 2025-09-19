'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNotes, type NoteFormData } from '@/hooks/use-notes'
import { ContactNote } from '@/lib/supabase'
import { useFocusTrap } from '@/hooks/use-focus-trap'

interface NotesModalProps {
  isOpen: boolean
  onClose: () => void
  leadId: string
  leadName: string
}

export default function NotesModal({ isOpen, onClose, leadId, leadName }: NotesModalProps) {
  const {
    notes,
    loading,
    submitting,
    error,
    addNote,
    updateNote,
    deleteNote,
    formatNoteType,
    getNotesStats
  } = useNotes(leadId)

  const [newNote, setNewNote] = useState<NoteFormData>({
    type: 'note',
    content: ''
  })
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const focusRef = useFocusTrap(isOpen)

  // Reset formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setNewNote({ type: 'note', content: '' })
      setEditingNote(null)
      setEditContent('')
    }
  }, [isOpen])

  // Ajouter nouvelle note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.content.trim()) return

    const success = await addNote(newNote)
    if (success) {
      setNewNote({ type: 'note', content: '' })
    }
  }

  // Commencer édition
  const startEdit = (note: ContactNote) => {
    setEditingNote(note.id)
    setEditContent(note.content)
  }

  // Sauvegarder édition
  const saveEdit = async (noteId: string) => {
    const success = await updateNote(noteId, editContent)
    if (success) {
      setEditingNote(null)
      setEditContent('')
    }
  }

  // Annuler édition
  const cancelEdit = () => {
    setEditingNote(null)
    setEditContent('')
  }

  // Supprimer note avec confirmation
  const handleDelete = async (noteId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      await deleteNote(noteId)
    }
  }

  // Formater date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    } else if (diffInHours < 48) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const stats = getNotesStats()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={focusRef}
            className="bg-white rounded-lg max-w-xs sm:max-w-2xl md:max-w-4xl w-full max-h-[90vh] flex flex-col mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notes CRM</h2>
                <p className="text-sm text-gray-600">
                  Lead: <span className="font-medium">{leadName}</span>
                  {stats.total > 0 && (
                    <span className="ml-3 text-green-600">
                      {stats.total} note{stats.total > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Corps scrollable */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              
              {/* Formulaire nouvelle note - Stack mobile, side desktop */}
              <div className="md:w-1/3 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Nouvelle note</h3>
                
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de note
                    </label>
                    <select
                      value={newNote.type}
                      onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-sapin focus:border-green-sapin"
                    >
                      <option value="note">📝 Note libre</option>
                      <option value="call">📞 Appel téléphonique</option>
                      <option value="email">✉️ Email</option>
                      <option value="meeting">🤝 Rendez-vous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu
                    </label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Décrivez votre interaction avec le lead..."
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-sapin focus:border-green-sapin resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newNote.content.length}/500 caractères
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">
                      {error}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={!newNote.content.trim() || submitting}
                    className="w-full bg-green-sapin text-white py-2 px-4 rounded-lg font-medium hover:bg-green-sapin-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? 'Ajout...' : 'Ajouter note'}
                  </motion.button>
                </form>
              </div>

              {/* Liste des notes - Responsive */}
              <div className="flex-1 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Historique ({stats.total})
                  </h3>
                  
                  {stats.lastContact && (
                    <div className="text-xs text-gray-500">
                      Dernier contact: {formatNoteType(stats.lastContact.type)} 
                      • {formatDate(stats.lastContact.date)}
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-24" />
                      ))}
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">Aucune note pour ce lead</p>
                      <p className="text-sm text-gray-400">Ajoutez la première note ci-contre</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {formatNoteType(note.type)}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(note.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => startEdit(note)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(note.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Supprimer"
                            >
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-sapin focus:border-green-sapin resize-none"
                              rows={3}
                              maxLength={500}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {editContent.length}/500
                              </span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={cancelEdit}
                                  className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={() => saveEdit(note.id)}
                                  className="text-xs bg-green-sapin text-white px-3 py-1 rounded hover:bg-green-sapin-light"
                                >
                                  Sauver
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <span>Par {note.author}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
