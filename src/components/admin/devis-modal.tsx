'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { LeadData } from '@/hooks/use-admin-data'

interface DevisModalProps {
  isOpen: boolean
  onClose: () => void
  lead: LeadData
  onSuccess?: () => void
}

export default function DevisModal({ isOpen, onClose, lead, onSuccess }: DevisModalProps) {
  const [formData, setFormData] = useState({
    prestations: '',
    prix_ht: '',
    conditions_paiement: '40% à la signature du devis, 60% à la livraison du projet. Paiement par virement bancaire sous 30 jours.',
    validite_jours: 30,
    notes_additionnelles: ''
  })
  
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const focusRef = useFocusTrap(isOpen)
  
  // Empêcher scroll background quand modal ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup au unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Pré-remplissage intelligente selon le service
  useEffect(() => {
    if (isOpen) {
      const servicePrestations = {
        'web': `Site web sur mesure responsive et optimisé SEO

🎨 CONCEPTION & DESIGN
• Maquettage personnalisé selon votre identité
• Design mobile-first responsive 
• Interface utilisateur moderne et intuitive

⚙️ DÉVELOPPEMENT TECHNIQUE  
• Développement React/Next.js performant
• Optimisation vitesse de chargement (< 2s)
• Sécurisation et bonnes pratiques

📈 SEO & PERFORMANCE
• Optimisation référencement naturel
• Analytics et suivi des performances
• Configuration domaine et hébergement

🚀 LIVRAISON & SUIVI
• Formation à la gestion du contenu
• 1 mois de support technique inclus
• Documentation complète`,

        'ia': `Solution d'automatisation IA sur mesure

🤖 ANALYSE & CONCEPTION
• Audit des processus actuels
• Identification des gains d'automatisation
• Architecture de la solution IA

⚙️ DÉVELOPPEMENT IA
• Développement des algorithmes personnalisés
• Intégration APIs et systèmes existants  
• Interface de gestion intuitive

📊 OPTIMISATION & TESTS
• Tests et ajustements des modèles
• Optimisation des performances
• Validation des résultats

🚀 DÉPLOIEMENT & FORMATION
• Mise en production sécurisée
• Formation équipes utilisatrices
• Support technique 3 mois inclus`,

        'transformation': `Accompagnement transformation digitale complète

📋 AUDIT & STRATÉGIE  
• Diagnostic complet de l'existant
• Définition roadmap transformation
• Priorisation des actions

🛠️ SOLUTIONS TECHNIQUES
• Sélection et déploiement d'outils
• Intégrations systèmes et données
• Automatisation des processus clés

👥 CONDUITE DU CHANGEMENT
• Formation des équipes
• Accompagnement utilisateurs
• Optimisation des nouveaux workflows

📈 SUIVI & AMÉLIORATION
• Tableau de bord des KPI
• Optimisations continues
• Support sur 6 mois`,

        'audit': `Audit technique et stratégique approfondi

🔍 AUDIT TECHNIQUE
• Analyse architecture et code existant
• Evaluation sécurité et performances  
• Identification des points d'amélioration

📊 AUDIT FONCTIONNEL
• Review UX/UI et parcours utilisateurs
• Analyse des conversions et métriques
• Benchmarking concurrentiel

📋 RECOMMANDATIONS
• Plan d'actions priorisé et chiffré
• Roadmap d'amélioration sur 6-12 mois
• Best practices et standards à adopter

🚀 ACCOMPAGNEMENT
• Présentation détaillée des résultats
• Conseils stratégiques personnalisés
• Support conseil 1 mois inclus`
      }

      // Prix suggérés selon service et budget lead
      const budgetValues = {
        'less-5k': { web: 3500, ia: 4500, transformation: 4000, audit: 2500 },
        '5k-10k': { web: 7500, ia: 8500, transformation: 8000, audit: 5500 },
        '10k-25k': { web: 15000, ia: 18000, transformation: 20000, audit: 12000 },
        '25k-50k': { web: 35000, ia: 40000, transformation: 45000, audit: 25000 },
        'more-50k': { web: 60000, ia: 75000, transformation: 80000, audit: 45000 },
        'not-defined': { web: 8000, ia: 12000, transformation: 15000, audit: 6000 }
      }

      const suggestedPrice = budgetValues[lead.budget as keyof typeof budgetValues]?.[lead.service as keyof typeof budgetValues['less-5k']] || 8000

      setFormData({
        prestations: servicePrestations[lead.service as keyof typeof servicePrestations] || `Prestations personnalisées pour votre projet ${lead.service}`,
        prix_ht: suggestedPrice.toString(),
        conditions_paiement: '40% à la signature du devis, 60% à la livraison du projet. Paiement par virement bancaire sous 30 jours.',
        validite_jours: 30,
        notes_additionnelles: ''
      })
      
      setError(null)
    }
  }, [isOpen, lead])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSendDevis = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.prestations.trim() || !formData.prix_ht || Number(formData.prix_ht) <= 0) {
      setError('Prestations et prix HT requis')
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          prix_ht: Number(formData.prix_ht)
        })
      })

      const result = await response.json()

      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.message || 'Erreur lors de l\'envoi du devis')
      }
    } catch (err) {
      setError('Impossible d\'envoyer le devis')
    } finally {
      setSending(false)
    }
  }

  // Calculs temps réel
  const prixHT = Number(formData.prix_ht) || 0
  const tva = Math.round(prixHT * 0.20)
  const prixTTC = prixHT + tva
  const acompte40 = Math.round(prixTTC * 0.40)
  const solde60 = prixTTC - acompte40

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
                <h2 className="text-xl font-bold text-gray-900">Générer Devis</h2>
                <p className="text-sm text-gray-600">
                  Devis pour <span className="font-medium">{lead.name}</span> ({lead.email})
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
                <div className="flex-1 lg:w-2/3 p-2 sm:p-4 md:p-6 overflow-y-auto">
                <form onSubmit={handleSendDevis} className="space-y-6">
                  
                  {/* Prestations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prestations détaillées *
                    </label>
                    <textarea
                      value={formData.prestations}
                      onChange={(e) => handleInputChange('prestations', e.target.value)}
                      placeholder="Décrivez les prestations incluses dans le devis..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin resize-none"
                      rows={12}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.prestations.length} caractères (utilisez des emojis et listes pour plus de clarté)
                    </p>
                  </div>

                  {/* Prix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix HT (€) *
                      </label>
                      <input
                        type="number"
                        value={formData.prix_ht}
                        onChange={(e) => handleInputChange('prix_ht', e.target.value)}
                        placeholder="8000"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin"
                        min="0"
                        step="50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Validité (jours)
                      </label>
                      <select
                        value={formData.validite_jours}
                        onChange={(e) => handleInputChange('validite_jours', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin"
                      >
                        <option value={15}>15 jours</option>
                        <option value={30}>30 jours</option>
                        <option value={45}>45 jours</option>
                        <option value={60}>60 jours</option>
                      </select>
                    </div>
                  </div>

                  {/* Conditions de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conditions de paiement
                    </label>
                    <textarea
                      value={formData.conditions_paiement}
                      onChange={(e) => handleInputChange('conditions_paiement', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Notes additionnelles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes additionnelles (optionnel)
                    </label>
                    <textarea
                      value={formData.notes_additionnelles}
                      onChange={(e) => handleInputChange('notes_additionnelles', e.target.value)}
                      placeholder="Informations complémentaires, conditions spéciales..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-sapin focus:border-green-sapin resize-none"
                      rows={3}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded border">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Annuler
                    </button>
                    
                    <motion.button
                      type="submit"
                      disabled={!formData.prestations.trim() || !formData.prix_ht || sending}
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
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Envoyer Devis</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
                </div>

                {/* Sidebar Info & Preview - Responsive + Scrollable */}
                <div className="lg:w-1/3 p-2 sm:p-4 md:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                
                {/* Infos Lead */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Infos Client</h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm text-gray-900">
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
                      <span className="text-gray-600">Budget indicatif:</span>
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

                {/* Calculs en temps réel */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Calculs Devis</h3>
                  <div className="bg-green-50 rounded-lg p-3 space-y-2 text-sm text-gray-900">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Prix HT:</span>
                      <span className="font-medium">{prixHT.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">TVA (20%):</span>
                      <span className="font-medium">{tva.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="font-bold text-green-800">Total TTC:</span>
                      <span className="font-bold text-green-800">{prixTTC.toLocaleString('fr-FR')} €</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex justify-between text-xs text-green-700">
                        <span>Acompte (40%):</span>
                        <span className="font-medium">{acompte40.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="flex justify-between text-xs text-green-700">
                        <span>Solde (60%):</span>
                        <span className="font-medium">{solde60.toLocaleString('fr-FR')} €</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Instructions
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Le devis sera envoyé automatiquement par email</p>
                    <p>• Le status du lead passera en "Devisé"</p>
                    <p>• Une note sera ajoutée automatiquement</p>
                    <p>• Vous recevrez une copie du devis</p>
                    <p>• Format: HTML professionnel en pièce jointe</p>
                  </div>
                </div>
                </div>
                </>
              ) : (
                /* Aperçu Devis HTML */
                <div className="flex-1 p-6">
                  <div className="h-full overflow-y-auto">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Aperçu du devis HTML</h3>
                      <div className="bg-white rounded border p-4 text-sm">
                        <div className="border-b border-gray-200 pb-3 mb-4">
                          <p><strong>De:</strong> MonadAI &lt;raph@monadai.fr&gt;</p>
                          <p><strong>À:</strong> {lead.name} &lt;{lead.email}&gt;</p>
                          <p><strong>Objet:</strong> Devis DEV-2024-{String(Date.now()).slice(-6)} - MonadAI</p>
                          <p><strong>Pièce jointe:</strong> Devis-MonadAI.html</p>
                        </div>
                        
                        {/* Aperçu HTML miniature */}
                        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
                          {/* Header */}
                          <div style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D5A3D 100%)', padding: '15px', textAlign: 'center', borderRadius: '4px 4px 0 0', color: 'white' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>MonadAI</div>
                            <div style={{ fontSize: '10px', opacity: '0.8' }}>Solutions Web & IA sur mesure</div>
                          </div>

                          {/* Content preview */}
                          <div style={{ padding: '15px', background: '#ffffff', border: '1px solid #e5e7eb' }}>
                            <h2 style={{ color: '#1B4332', margin: '0 0 10px 0', fontSize: '14px' }}>
                              Bonjour {lead.name.split(' ')[0]} 👋
                            </h2>
                            
                            <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#374151' }}>
                              Merci pour votre intérêt pour nos services. Vous trouverez le devis détaillé en pièce jointe.
                            </p>

                            {/* Résumé devis */}
                            <div style={{ background: '#F0FDF4', borderLeft: '3px solid #1B4332', padding: '10px', margin: '10px 0', borderRadius: '0 4px 4px 0' }}>
                              <h3 style={{ color: '#1B4332', margin: '0 0 8px 0', fontSize: '12px' }}>
                                <svg style={{ display: 'inline-block', width: '12px', height: '12px', marginRight: '4px' }} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Récapitulatif
                              </h3>
                              <div style={{ fontSize: '10px', color: '#374151' }}>
                                <p style={{ margin: '0 0 4px 0' }}><strong>Service:</strong> {
                                  lead.service === 'web' ? 'Développement Web' :
                                  lead.service === 'ia' ? 'Automatisation IA' :
                                  lead.service === 'transformation' ? 'Transformation Digitale' :
                                  lead.service === 'audit' ? 'Audit Technique' : 'Service personnalisé'
                                }</p>
                                <p style={{ margin: '0 0 4px 0' }}><strong>Prix HT:</strong> {prixHT.toLocaleString('fr-FR')} €</p>
                                <p style={{ margin: '0 0 4px 0' }}><strong>Prix TTC:</strong> {prixTTC.toLocaleString('fr-FR')} €</p>
                                <p style={{ margin: '0' }}><strong>Acompte (40%):</strong> {acompte40.toLocaleString('fr-FR')} €</p>
                              </div>
                            </div>

                            {/* Prestations preview */}
                            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
                              <h4 style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold' }}>
                                <svg style={{ display: 'inline-block', width: '11px', height: '11px', marginRight: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Prestations proposées
                              </h4>
                              <div style={{ fontSize: '9px', color: '#6b7280', maxHeight: '60px', overflow: 'hidden' }}>
                                {formData.prestations.slice(0, 200)}...
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div style={{ background: '#F9FAFB', padding: '10px', borderTop: '1px solid #E5E7EB', textAlign: 'center', fontSize: '9px', color: '#6b7280' }}>
                            <strong>Raphael LOTTE</strong> - Fondateur MonadAI<br/>
                            📞 06 47 24 48 09 • ✉️ raph@monadai.fr
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-amber-800">
                            <strong>Format HTML :</strong> Le devis est généré en HTML stylisé et envoyé en pièce jointe. 
                            Pour un PDF, le client peut imprimer ou utiliser "Enregistrer en PDF" de son navigateur.
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
