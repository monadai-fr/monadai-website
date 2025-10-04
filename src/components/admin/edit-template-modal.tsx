'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { EmailTemplate } from '@/hooks/use-cms-email-templates'

interface EditTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: EmailTemplate
  onSuccess: () => void
}

export default function EditTemplateModal({ isOpen, onClose, template, onSuccess }: EditTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    type: template.type,
    subject: template.subject,
    html_content: template.html_content,
    variables: template.variables,
    is_active: template.is_active
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const focusRef = useFocusTrap(isOpen, onClose)

  // Empêcher scroll background
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset form quand le template change
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: template.name,
        type: template.type,
        subject: template.subject,
        html_content: template.html_content,
        variables: template.variables,
        is_active: template.is_active
      })
      setError(null)
      setShowPreview(false)
    }
  }, [isOpen, template])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      setError('Nom, objet et contenu HTML requis')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/cms/email-templates/${template.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.message || 'Erreur lors de la modification')
      }
    } catch (err) {
      setError('Impossible de modifier le template')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div 
              ref={focusRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-template-modal-title"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 id="edit-template-modal-title" className="text-xl font-bold text-gray-900">Modifier Template Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Template: <span className="font-medium">{template.name}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {showPreview ? 'Édition' : 'Aperçu'}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {!showPreview ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du template *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                        placeholder="Follow-up Lead Chaud"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                        required
                      >
                        <option value="follow_up">Follow-up</option>
                        <option value="welcome_client">Bienvenue Client</option>
                        <option value="quote_reminder">Relance Devis</option>
                        <option value="custom">Personnalisé</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objet de l'email *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                      placeholder="Votre projet {{service}} - Prochaines étapes"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez des variables: {formData.variables.join(', ')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu HTML *
                    </label>
                    <textarea
                      value={formData.html_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none resize-none font-mono text-sm"
                      placeholder="<div>Votre template HTML...</div>"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.html_content.length} caractères
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-green-sapin focus:ring-green-sapin border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">
                      Template actif
                    </label>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      Annuler
                    </button>
                    <motion.button
                      type="submit"
                      disabled={submitting || !formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()}
                      className="px-4 py-2 bg-green-sapin text-white rounded-lg hover:bg-green-sapin-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
                          </svg>
                          Modification...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Sauvegarder
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Aperçu du template</h4>
                    <div className="bg-white rounded border border-gray-200 p-4">
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <p className="text-sm text-gray-600"><strong>Objet:</strong> {formData.subject}</p>
                      </div>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.html_content }}
                      />
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-blue-800">
                        <strong>Variables disponibles:</strong> {formData.variables.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

