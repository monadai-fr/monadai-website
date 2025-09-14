'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useDevis, ServiceType, ComplexityType } from '@/hooks/useDevis'
import { formatPrice } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useAnalytics } from '@/hooks/use-analytics'

interface DevisModalProps {
  isOpen: boolean
  onClose: () => void
}

const serviceIcons = {
  web: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  ia: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  transformation: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

export default function DevisModal({ isOpen, onClose }: DevisModalProps) {
  const {
    devisState,
    calculatedTotal,
    estimatedDuration,
    toggleService,
    setComplexity,
    toggleAddon,
    resetDevis,
    serviceLabels,
    complexityLabels,
    addonLabels
  } = useDevis()

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Hooks accessibilité et analytics
  const focusRef = useFocusTrap(isOpen)
  const { trackDevis } = useAnalytics()
  
  // Track ouverture modal
  useEffect(() => {
    if (isOpen) {
      trackDevis.opened('services')
    }
  }, [isOpen, trackDevis])

  // Gérer la fermeture avec Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Empêcher le scroll du body quand modal ouvert
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmitDevis = () => {
    const devisDetails = `Services: ${devisState.services.map(s => serviceLabels[s]).join(', ')}
Complexité: ${complexityLabels[devisState.complexity]}
Add-ons: ${Object.entries(devisState.addons).filter(([, enabled]) => enabled).map(([addon]) => addonLabels[addon as keyof typeof addonLabels]).join(', ')}
Total estimé: ${formatPrice(calculatedTotal)}
Durée estimée: ${estimatedDuration} jours`

    setContactForm(prev => ({
      ...prev,
      message: `Bonjour,\n\nJe suis intéressé(e) par un devis pour :\n\n${devisDetails}\n\nMerci de me recontacter pour discuter de ce projet.`
    }))

    // Track soumission devis (lead haute qualité)
    trackDevis.submitted(
      calculatedTotal, 
      devisState.services, 
      calculatedTotal > 3000 ? 'high' : calculatedTotal > 1500 ? 'medium' : 'low'
    )
  }

  const handleBackdropClick = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            aria-label="Fermer le modal"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div 
              ref={focusRef}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-black">Simulateur de Devis</h2>
                  <p id="modal-description" className="text-gray-700">Obtenez une estimation personnalisée en temps réel</p>
                </div>
                  <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-red-50 hover:text-red-600"
                  title="Fermer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Configuration */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Choisissez vos services</h3>
                    <div className="space-y-2">
                      {Object.entries(serviceLabels).map(([key, label]) => (
                        <motion.label
                          key={key}
                          className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          title={`${label} - Cliquez pour ${devisState.services.includes(key as ServiceType) ? 'retirer' : 'ajouter'} au devis`}
                        >
                          <input
                            type="checkbox"
                            checked={devisState.services.includes(key as ServiceType)}
                            onChange={() => {
                              toggleService(key as ServiceType)
                              trackDevis.serviceSelected(key, devisState.services.length + 1)
                            }}
                            className="sr-only"
                          />
                          <div className={`flex items-center justify-center w-5 h-5 rounded border-2 mr-3 ${
                            devisState.services.includes(key as ServiceType)
                              ? 'bg-green-sapin border-green-sapin text-white'
                              : 'border-gray-400'
                          }`}>
                            {devisState.services.includes(key as ServiceType) && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 flex items-center">
                            <div className="text-green-sapin mr-3">
                              {serviceIcons[key as ServiceType]}
                            </div>
                            <span className="font-medium text-gray-900">{label}</span>
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Complexité */}
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Complexité du projet</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(complexityLabels).map(([key, label]) => (
                        <motion.button
                          key={key}
                          onClick={() => {
                            setComplexity(key as ComplexityType)
                            trackDevis.calculated(devisState.services, key, calculatedTotal)
                          }}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            devisState.complexity === key
                              ? 'border-green-sapin bg-green-sapin text-white'
                              : 'border-gray-300 hover:border-green-sapin text-gray-900 hover:text-green-sapin'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title={`Complexité ${label.toLowerCase()} - Multiplicateur x${key === 'simple' ? '1' : key === 'moyen' ? '1.3' : '1.7'}`}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-3">Options supplémentaires</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(addonLabels).map(([key, label]) => (
                        <motion.button
                          key={key}
                          onClick={() => toggleAddon(key as keyof typeof addonLabels)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                            devisState.addons[key as keyof typeof devisState.addons]
                              ? 'border-green-sapin bg-green-sapin/5 text-green-sapin'
                              : 'border-gray-300 hover:border-green-sapin text-gray-900 hover:text-green-sapin'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title={`${label} - Cliquez pour ${devisState.addons[key as keyof typeof devisState.addons] ? 'retirer' : 'ajouter'}`}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="lg:border-l lg:pl-6">
                  <div className="sticky top-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Estimation</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Services sélectionnés:</span>
                          <span className="font-medium text-gray-900">{devisState.services.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Complexité:</span>
                          <span className="font-medium text-gray-900">{complexityLabels[devisState.complexity]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Durée estimée:</span>
                          <span className="font-medium text-gray-900">{estimatedDuration} jours</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <motion.div 
                        key={calculatedTotal}
                        initial={{ scale: 1.1, color: '#1B4332' }}
                        animate={{ scale: 1, color: '#1B4332' }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-bold text-green-sapin mb-1"
                      >
                        {formatPrice(calculatedTotal)}
                      </motion.div>
                      <div className="text-sm text-gray-600">Prix indicatif HT</div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        onClick={handleSubmitDevis}
                        className="w-full bg-green-sapin text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-sapin-light transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Demander ce devis
                      </motion.button>
                      
                      <motion.button
                        onClick={resetDevis}
                        className="w-full border-2 border-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Réinitialiser
                      </motion.button>

                      <div className="text-xs text-gray-600 text-center">
                        Prix indicatif. Devis définitif après étude de votre projet.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
