'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { FAQItem } from '@/hooks/use-cms-faq'

interface EditFAQModalProps {
  isOpen: boolean
  onClose: () => void
  faq: FAQItem
  onSuccess: () => void
}

export default function EditFAQModal({ isOpen, onClose, faq, onSuccess }: EditFAQModalProps) {
  const [formData, setFormData] = useState({
    section: faq.section,
    question: faq.question,
    answer: faq.answer,
    is_visible: faq.is_visible
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  // Reset form quand la FAQ change
  useEffect(() => {
    if (isOpen) {
      setFormData({
        section: faq.section,
        question: faq.question,
        answer: faq.answer,
        is_visible: faq.is_visible
      })
      setError(null)
    }
  }, [isOpen, faq])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Question et réponse requises')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/cms/faq/${faq.id}`, {
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
      setError('Impossible de modifier la FAQ')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={focusRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
              aria-labelledby="edit-faq-modal-title"
          >
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 id="edit-faq-modal-title" className="text-xl font-bold text-gray-900">Modifier FAQ</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Section: <span className="font-medium">{faq.section}</span>
                    </p>
                  </div>
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

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                    required
                  >
                    <option value="homepage">Homepage</option>
                    <option value="services">Services</option>
                    <option value="general">Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                    placeholder="Quelle est votre question fréquente ?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Réponse *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none resize-none"
                    placeholder="Réponse détaillée et professionnelle..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.answer.length} caractères
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                    className="w-4 h-4 text-green-sapin focus:ring-green-sapin border-gray-300 rounded"
                  />
                  <label htmlFor="is_visible" className="text-sm text-gray-700">
                    Visible sur le site public
                  </label>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
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
                    disabled={submitting || !formData.question.trim() || !formData.answer.trim()}
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
            </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  )
}

