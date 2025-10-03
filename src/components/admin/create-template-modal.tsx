'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { EmailTemplateFormData } from '@/hooks/use-cms-email-templates'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmailTemplateFormData) => Promise<boolean>
}

export default function CreateTemplateModal({ isOpen, onClose, onSubmit }: CreateTemplateModalProps) {
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: '',
    type: 'custom',
    subject: '',
    html_content: '',
    variables: ['{{name}}', '{{company}}', '{{service}}']
  })
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newVariable, setNewVariable] = useState('')
  
  const focusRef = useFocusTrap(isOpen)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      return
    }

    setSubmitting(true)
    
    const success = await onSubmit(formData)
    
    if (success) {
      setFormData({
        name: '',
        type: 'custom',
        subject: '',
        html_content: '',
        variables: ['{{name}}', '{{company}}', '{{service}}']
      })
      setShowPreview(false)
      onClose()
    }
    
    setSubmitting(false)
  }

  const addVariable = () => {
    if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable.trim()]
      }))
      setNewVariable('')
    }
  }

  const removeVariable = (variableToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variableToRemove)
    }))
  }

  // Template suggestions par type
  const templateSuggestions = {
    follow_up: {
      subject: 'Votre projet {{service}} - Prochaines étapes',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">MonadAI</h1>
  </div>
  <div style="padding: 30px 20px;">
    <h2 style="color: #1B4332;">Bonjour {{name}} 👋</h2>
    <p style="color: #374151; line-height: 1.6;">Suite à votre demande concernant {{service}}, je souhaitais faire le point avec vous sur l'avancement de votre projet.</p>
  </div>
</div>`
    },
    welcome_client: {
      subject: 'Bienvenue chez MonadAI - {{name}}',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Bienvenue chez MonadAI</h1>
  </div>
  <div style="padding: 30px 20px;">
    <h2 style="color: #1B4332;">Merci de votre confiance {{name}} 🎉</h2>
    <p style="color: #374151; line-height: 1.6;">Nous sommes ravis de travailler avec {{company}} sur votre projet {{service}}.</p>
  </div>
</div>`
    },
    quote_reminder: {
      subject: 'Rappel : Devis MonadAI - {{company}}',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">MonadAI</h1>
  </div>
  <div style="padding: 30px 20px;">
    <h2 style="color: #1B4332;">Bonjour {{name}}</h2>
    <p>Je me permets de revenir vers vous concernant le devis que je vous ai envoyé pour {{service}}.</p>
  </div>
</div>`
    }
  }

  const loadSuggestion = (type: keyof typeof templateSuggestions) => {
    const suggestion = templateSuggestions[type]
    setFormData(prev => ({
      ...prev,
      type,
      subject: suggestion.subject,
      html_content: suggestion.html
    }))
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
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Nouveau Template Email</h3>
                    <p className="text-sm text-gray-600 mt-1">Créez un template réutilisable pour vos emails</p>
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
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  
                  {/* Templates suggérés */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Templates suggérés</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(templateSuggestions).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => loadSuggestion(type as keyof typeof templateSuggestions)}
                          className="text-xs bg-white text-blue-700 px-3 py-1.5 rounded border border-blue-300 hover:bg-blue-100 transition-colors"
                        >
                          {type === 'follow_up' ? 'Follow-up Lead' : 
                           type === 'welcome_client' ? 'Bienvenue Client' : 
                           'Relance Devis'}
                        </button>
                      ))}
                    </div>
                  </div>

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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variables dynamiques
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.variables.map((variable) => (
                        <span 
                          key={variable}
                          className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                        >
                          {variable}
                          <button
                            type="button"
                            onClick={() => removeVariable(variable)}
                            className="ml-1 text-blue-500 hover:text-red-500"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVariable}
                        onChange={(e) => setNewVariable(e.target.value)}
                        placeholder="{{nouvelle_variable}}"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addVariable()
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addVariable}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {`{{nom_variable}}`} - Appuyez sur Entrée pour ajouter
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
                      placeholder="<div>Votre template HTML avec variables {{name}}...</div>"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.html_content.length} caractères • Utilisez les variables définies ci-dessus
                    </p>
                  </div>

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
                          Création...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Créer Template
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
                        <p className="text-sm text-gray-600">
                          <strong>Objet:</strong> {formData.subject || '[Objet à définir]'}
                        </p>
                      </div>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formData.html_content || '<p class="text-gray-400">Aucun contenu HTML</p>' }}
                      />
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-blue-800">
                        <strong>Variables:</strong> {formData.variables.join(', ') || 'Aucune variable'}
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

