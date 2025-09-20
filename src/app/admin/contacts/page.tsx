'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdminData } from '@/hooks/use-admin-data'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import ContactModal from '@/components/admin/contact-modal'
import NotesModal from '@/components/admin/notes-modal'
import StatusDropdown from '@/components/admin/status-dropdown'
import DevisModal from '@/components/admin/devis-modal'

export default function AdminContacts() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  
  // États modales
  const [contactModal, setContactModal] = useState<{ isOpen: boolean; lead: any }>({ isOpen: false, lead: null })
  const [notesModal, setNotesModal] = useState<{ isOpen: boolean; lead: any }>({ isOpen: false, lead: null })
  const [devisModal, setDevisModal] = useState<{ isOpen: boolean; lead: any }>({ isOpen: false, lead: null })
  
  // Détecter si une modale est ouverte pour bloquer auto-refresh
  const hasOpenModal = contactModal.isOpen || notesModal.isOpen || devisModal.isOpen
  const { leads, loading, refreshData } = useAdminData(hasOpenModal)

  // Handlers modales
  const openContactModal = (lead: any) => {
    setContactModal({ isOpen: true, lead })
  }

  const openNotesModal = (lead: any) => {
    setNotesModal({ isOpen: true, lead })
  }

  const openDevisModal = (lead: any) => {
    setDevisModal({ isOpen: true, lead })
  }

  const closeModals = () => {
    setContactModal({ isOpen: false, lead: null })
    setNotesModal({ isOpen: false, lead: null })
    setDevisModal({ isOpen: false, lead: null })
  }

  const handleContactSuccess = () => {
    refreshData() // Refresh pour voir le changement de status
  }

  // Supprimer lead avec confirmation
  const handleDeleteLead = async (lead: any) => {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer définitivement le lead "${lead.name}" ?\n\nCette action est irréversible et supprimera :\n• Toutes les données du contact\n• L'historique des notes\n• Les interactions enregistrées`
    
    if (!window.confirm(confirmMessage)) return

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/delete`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        refreshData() // Refresh pour voir la suppression
        setSelectedLead(null) // Fermer les détails si c'était le lead sélectionné
      } else {
        alert(`Erreur: ${result.message}`)
      }
    } catch (error) {
      alert('Impossible de supprimer le lead')
    }
  }

  // Filtrage leads par score
  const filteredLeads = leads.filter(lead => {
    if (filter === 'hot') return lead.score >= 70
    if (filter === 'warm') return lead.score >= 40 && lead.score < 70
    if (filter === 'cold') return lead.score < 40
    return true
  })

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100'
    if (score >= 40) return 'text-amber-600 bg-amber-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'CHAUD'
    if (score >= 40) return 'TIÈDE'  
    return 'FROID'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">CRM & Lead Management</h1>
          <p className="text-gray-600">Gestion intelligente des prospects MonadAI</p>
        </div>

        {/* Filtres */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Tous', count: leads.length },
            { key: 'hot', label: 'Chauds', count: leads.filter(l => l.score >= 70).length },
            { key: 'warm', label: 'Tièdes', count: leads.filter(l => l.score >= 40 && l.score < 70).length },
            { key: 'cold', label: 'Froids', count: leads.filter(l => l.score < 40).length }
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-green-sapin text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filterOption.label} ({filterOption.count})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Liste Leads */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Leads {filter !== 'all' ? filter : ''} ({filteredLeads.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              variants={staggerItem}
              className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedLead === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
              whileHover={{ scale: 1.005 }}
            >
              {/* Layout responsive mobile/desktop */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0"> {/* min-w-0 pour éviter débordement */}
                  {/* Header avec nom et badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h4 className="font-medium text-gray-900 truncate">{lead.name}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${getScoreColor(lead.score)}`}>
                      {getScoreLabel(lead.score)} ({lead.score})
                    </span>
                    {lead.company && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                        {lead.company}
                      </span>
                    )}
                  </div>
                  
                  {/* Infos détaillées - Stack mobile, inline desktop */}
                  <div className="space-y-1 md:space-y-0">
                    <div className="text-sm text-gray-600 truncate">{lead.email}</div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{lead.service}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{lead.budget}</span>  
                      <span className="hidden md:inline">•</span>
                      <span>{new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions CRM - Box moderne unifiée */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">Status:</span>
                      <StatusDropdown 
                        lead={lead}
                        onStatusChange={() => refreshData()}
                      />
                    </div>
                    
                    {/* Séparateur */}
                    <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
                    
                    {/* Actions Principales - Grid responsive */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          openContactModal(lead)
                        }}
                        className="bg-green-sapin text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-sapin-light transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Email</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          openDevisModal(lead)
                        }}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">Devis</span>
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          openNotesModal(lead)
                        }}
                        className="bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="Gérer les notes"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Notes</span>
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteLead(lead)
                        }}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="Supprimer définitivement ce lead"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Supprimer</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails expanded */}
              {selectedLead === lead.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Message Client</h5>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                        {lead.message}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Lead Scoring Détails</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium text-green-600">
                            {lead.budget === 'more-50k' ? '+30pts' :
                             lead.budget === '25k-50k' ? '+25pts' :
                             lead.budget === '10k-25k' ? '+15pts' : '+5pts'}
                          </span>
                        </div>
                        {lead.company && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Entreprise:</span>
                            <span className="font-medium text-green-600">+10pts</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Score Total:</span>
                          <span className="font-bold text-green-600">{lead.score}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions CRM dans les détails */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-600">Status:</span>
                          <StatusDropdown 
                            lead={lead}
                            onStatusChange={() => refreshData()}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                          <motion.button
                            onClick={() => openContactModal(lead)}
                            className="bg-green-sapin text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-sapin-light transition-colors flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Envoyer email</span>
                          </motion.button>

                          <motion.button
                            onClick={() => openDevisModal(lead)}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Créer devis</span>
                          </motion.button>

                          <motion.button
                            onClick={() => openNotesModal(lead)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Gérer notes</span>
                          </motion.button>
                        </div>

                        {/* Bouton Supprimer séparé avec marge */}
                        <motion.button
                          onClick={() => handleDeleteLead(lead)}
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title="Supprimer définitivement ce lead"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Supprimer</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
          
          {filteredLeads.length === 0 && (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600">Aucun lead dans cette catégorie</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modales CRM */}
      {contactModal.isOpen && (
        <ContactModal
          isOpen={contactModal.isOpen}
          onClose={closeModals}
          lead={contactModal.lead}
          onSuccess={handleContactSuccess}
        />
      )}

      {notesModal.isOpen && (
        <NotesModal
          isOpen={notesModal.isOpen}
          onClose={closeModals}
          leadId={notesModal.lead.id}
          leadName={notesModal.lead.name}
        />
      )}

      {devisModal.isOpen && (
        <DevisModal
          isOpen={devisModal.isOpen}
          onClose={closeModals}
          lead={devisModal.lead}
          onSuccess={handleContactSuccess}
        />
      )}
    </div>
  )
}
