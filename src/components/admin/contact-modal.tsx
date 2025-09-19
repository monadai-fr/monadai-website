'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { LeadData } from '@/hooks/use-admin-data'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  lead: LeadData
  onSuccess?: () => void
}

export default function ContactModal({ isOpen, onClose, lead, onSuccess }: ContactModalProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const focusRef = useFocusTrap(isOpen)

  // Génération automatique objet email
  useEffect(() => {
    if (isOpen) {
      const serviceLabel = 
        lead.service === 'web' ? 'développement web' :
        lead.service === 'ia' ? 'automatisation IA' :
        lead.service === 'transformation' ? 'transformation digitale' :
        lead.service === 'audit' ? 'audit technique' : 'votre projet'

      setSubject(`Suite à votre demande ${serviceLabel} - MonadAI`)
      setMessage('')
      setShowPreview(false)
      setError(null)
    }
  }, [isOpen, lead])

  // Envoyer email
  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Objet et message requis')
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() })
      })

      const result = await response.json()

      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.message || 'Erreur lors de l\'envoi')
      }
    } catch (err) {
      setError('Impossible d\'envoyer l\'email')
    } finally {
      setSending(false)
    }
  }

  // Template suggestions
  const templates = [
    {
      name: 'Premier contact',
      content: `Je vous remercie pour votre demande concernant ${
        lead.service === 'web' ? 'le développement web' :
        lead.service === 'ia' ? 'l\'automatisation IA' :
        lead.service === 'transformation' ? 'la transformation digitale' :
        lead.service === 'audit' ? 'l\'audit technique' : 'votre projet'
      }.

J'ai bien pris connaissance de vos besoins et je serais ravi d'échanger avec vous pour mieux comprendre vos objectifs.

Seriez-vous disponible pour un appel de 30 minutes cette semaine ? Cela nous permettrait de discuter de votre projet en détail et de voir comment MonadAI peut vous accompagner.

Dans l'attente de votre retour.

Cordialement,`
    },
    {
      name: 'Relance douce',
      content: `J'espère que vous allez bien.

Je reviens vers vous concernant votre demande pour ${
        lead.service === 'web' ? 'le développement web' :
        lead.service === 'ia' ? 'l\'automatisation IA' :
        lead.service === 'transformation' ? 'la transformation digitale' :
        lead.service === 'audit' ? 'l\'audit technique' : 'votre projet'
      }.

Avez-vous eu l'occasion de réfléchir à notre collaboration ? Je reste à votre disposition pour toute question ou pour planifier un échange.

N'hésitez pas à me faire savoir si vous souhaitez que nous discutions de votre projet.

Bien cordialement,`
    },
    {
      name: 'Proposer RDV',
      content: `Suite à notre échange, je vous propose de nous rencontrer pour approfondir votre projet ${
        lead.service === 'web' ? 'de développement web' :
        lead.service === 'ia' ? 'd\'automatisation IA' :
        lead.service === 'transformation' ? 'de transformation digitale' :
        lead.service === 'audit' ? 'd\'audit technique' : ''
      }.

Seriez-vous disponible pour un rendez-vous de 45 minutes la semaine prochaine ?

Je peux me déplacer ou nous pouvons organiser une visioconférence, selon votre préférence.

Quelques créneaux possibles :
- Mardi 14h00 - 18h00
- Mercredi 9h00 - 12h00
- Jeudi 14h00 - 17h00

N'hésitez pas à me proposer d'autres créneaux si ceux-ci ne conviennent pas.

Au plaisir de vous rencontrer,`
    }
  ]

  const insertTemplate = (template: typeof templates[0]) => {
    setMessage(template.content)
  }

  const formatBudget = (budget: string) => {
    const budgetMap = {
      'less-5k': 'moins de 5K€',
      '5k-10k': '5K€ - 10K€',
      '10k-25k': '10K€ - 25K€',
      '25k-50k': '25K€ - 50K€',
      'more-50k': 'plus de 50K€',
      'not-defined': 'à définir'
    }
    return budgetMap[budget as keyof typeof budgetMap] || budget
  }

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
            className="bg-white rounded-lg max-w-4xl md:max-w-6xl w-full max-h-[90vh] flex flex-col mx-2 sm:mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contacter le lead</h2>
                <p className="text-sm text-gray-600">
                  Email à <span className="font-medium">{lead.name}</span> ({lead.email})
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {showPreview ? 'Édition' : 'Aperçu'}
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Corps - Layout responsive */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              
              {!showPreview ? (
                <>
                  {/* Formulaire - Stack mobile, side-by-side desktop */}
                  <div className="flex-1 lg:w-2/3 p-2 sm:p-4 md:p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objet de l'email
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Objet de votre email..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin"
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500 mt-1">{subject.length}/100 caractères</p>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message personnalisé
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Rédigez votre message personnalisé..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin resize-none min-h-[300px]"
                        maxLength={2000}
                      />
                      <p className="text-xs text-gray-500 mt-1">{message.length}/2000 caractères</p>
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded border">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      
                      <motion.button
                        onClick={handleSendEmail}
                        disabled={!subject.trim() || !message.trim() || sending}
                        className="bg-green-sapin text-white px-6 py-2 rounded-lg font-medium hover:bg-green-sapin-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {sending ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
                            </svg>
                            <span>Envoi...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Envoyer Email</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Templates & Lead Info - Responsive */}
                  <div className="lg:w-1/3 p-2 sm:p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 space-y-6">
                    
                    {/* Infos Lead */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Infos Lead</h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nom:</span>
                          <span className="font-medium">{lead.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{lead.email}</span>
                        </div>
                        {lead.company && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Entreprise:</span>
                            <span className="font-medium">{lead.company}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium capitalize">{lead.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{formatBudget(lead.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Score:</span>
                          <span className={`font-bold ${
                            lead.score >= 70 ? 'text-red-600' :
                            lead.score >= 40 ? 'text-amber-600' : 'text-gray-600'
                          }`}>
                            {lead.score}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Templates */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Templates suggérés</h3>
                      <div className="space-y-2">
                        {templates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => insertTemplate(template)}
                            className="w-full text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          >
                            <div className="font-medium text-blue-900 mb-1">{template.name}</div>
                            <div className="text-blue-700 text-xs">
                              {template.content.substring(0, 80)}...
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Aperçu Email */
                <div className="flex-1 p-6">
                  <div className="h-full overflow-y-auto">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Aperçu de l'email</h3>
                      <div className="bg-white rounded border p-4 text-sm">
                        <div className="border-b border-gray-200 pb-3 mb-4">
                          <p><strong>De:</strong> MonadAI &lt;raph@monadai.fr&gt;</p>
                          <p><strong>À:</strong> {lead.name} &lt;{lead.email}&gt;</p>
                          <p><strong>Objet:</strong> {subject || '[Objet à remplir]'}</p>
                        </div>
                        
                        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#ffffff' }}>
                          {/* Header MonadAI */}
                          <div style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)', padding: '20px', textAlign: 'center', borderRadius: '8px 8px 0 0' }}>
                            <div style={{ background: '#ffffff', width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#1B4332', fontSize: '16px', fontWeight: 'bold' }}>M</span>
                            </div>
                            <h1 style={{ color: '#ffffff', margin: '0', fontSize: '18px', fontWeight: 'bold' }}>MonadAI</h1>
                            <p style={{ color: '#E8F5E8', margin: '0', fontSize: '12px' }}>Solutions Web & IA sur mesure</p>
                          </div>

                          {/* Corps */}
                          <div style={{ padding: '20px' }}>
                            <h2 style={{ color: '#1B4332', margin: '0 0 15px 0', fontSize: '16px' }}>
                              Bonjour {lead.name.split(' ')[0]} 👋
                            </h2>
                            
                            <div style={{ color: '#374151', lineHeight: '1.6', fontSize: '14px', whiteSpace: 'pre-wrap', margin: '15px 0' }}>
                              {message || '[Votre message personnalisé]'}
                            </div>

                            {/* Rappel projet */}
                            <div style={{ background: '#F0FDF4', borderLeft: '3px solid #1B4332', padding: '15px', margin: '20px 0', borderRadius: '0 6px 6px 0' }}>
                              <h3 style={{ color: '#1B4332', margin: '0 0 10px 0', fontSize: '14px' }}>📋 Rappel de votre demande :</h3>
                              <div style={{ fontSize: '12px', color: '#374151' }}>
                                <p style={{ margin: '0 0 5px 0' }}><strong>Service :</strong> {
                                  lead.service === 'web' ? 'Développement Web' :
                                  lead.service === 'ia' ? 'Automatisation IA' :
                                  lead.service === 'transformation' ? 'Transformation Digitale' :
                                  lead.service === 'audit' ? 'Audit Technique' : 'Autre'
                                }</p>
                                <p style={{ margin: '0 0 5px 0' }}><strong>Budget :</strong> {formatBudget(lead.budget)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div style={{ background: '#F9FAFB', padding: '15px', borderTop: '1px solid #E5E7EB', textAlign: 'center', borderRadius: '0 0 8px 8px' }}>
                            <p style={{ margin: '0 0 10px 0', color: '#6B7280', fontSize: '12px' }}>
                              <strong>Raphael LOTTE</strong><br/>
                              Fondateur MonadAI
                            </p>
                            <p style={{ margin: '0', color: '#374151', fontSize: '12px' }}>
                              📞 06 47 24 48 09 • ✉️ raph@monadai.fr
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
