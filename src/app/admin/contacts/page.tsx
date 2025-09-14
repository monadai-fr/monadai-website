'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdminData } from '@/hooks/use-admin-data'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'

export default function AdminContacts() {
  const { leads, loading } = useAdminData()
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM & Lead Management</h1>
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
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-gray-900 mr-3">{lead.name}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getScoreColor(lead.score)}`}>
                      {getScoreLabel(lead.score)} ({lead.score})
                    </span>
                    {lead.company && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {lead.company}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{lead.email}</span>
                    <span>•</span>
                    <span>{lead.service}</span>
                    <span>•</span>
                    <span>{lead.budget}</span>
                    <span>•</span>
                    <span>{new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contacter
                  </motion.button>
                  
                  <motion.button
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Devis
                  </motion.button>
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
                          <span className="font-medium">
                            {lead.budget === 'more-50k' ? '+30pts' :
                             lead.budget === '25k-50k' ? '+25pts' :
                             lead.budget === '10k-25k' ? '+15pts' : '+5pts'}
                          </span>
                        </div>
                        {lead.company && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Entreprise:</span>
                            <span className="font-medium">+10pts</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Score Total:</span>
                          <span className="font-bold text-green-600">{lead.score}/100</span>
                        </div>
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
    </div>
  )
}
