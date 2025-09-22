'use client'

import { motion } from 'framer-motion'
import { useAdminData } from '@/hooks/use-admin-data'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { formatPrice } from '@/lib/utils'

export default function AdminAnalytics() {
  const { businessMetrics, leads, loading } = useAdminData()

  // Métriques simples et fiables (derniers 30 jours)
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const leadsLast30Days = leads.filter(lead => 
    new Date(lead.created_at) > last30Days
  ).length

  // Analyse budgets distribution  
  const budgetAnalysis = leads.reduce((acc, lead) => {
    acc[lead.budget] = (acc[lead.budget] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Analyse services distribution
  const serviceAnalysis = leads.reduce((acc, lead) => {
    acc[lead.service] = (acc[lead.service] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="space-y-6 w-full max-w-full overflow-x-hidden">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Leads</h1>
        <p className="text-gray-600">Analyse des leads basée sur données Supabase réelles</p>
      </div>

      {/* Métriques Leads - Données 100% Fiables */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={staggerItem} className="font-semibold text-gray-900 mb-6">
          Évolution des Leads
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{leadsLast30Days}</div>
            <div className="text-sm text-gray-600">Ce Mois-ci</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{businessMetrics?.leadsThisWeek || 0}</div>
            <div className="text-sm text-gray-600">Cette Semaine</div>
          </div>
        </div>
      </motion.div>

      {/* Analyse Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribution Budgets */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Distribution Budgets</h3>
          
          <div className="space-y-3">
            {Object.entries({
              'less-5k': 'Moins de 5K€',
              '5k-10k': '5K-10K€', 
              '10k-25k': '10K-25K€',
              '25k-50k': '25K-50K€',
              'more-50k': 'Plus de 50K€',
              'not-defined': 'À définir'
            }).map(([key, label]) => {
              const count = budgetAnalysis[key] || 0
              const percentage = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-3">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-green-sapin h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Distribution Services */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Services Demandés</h3>
          
          <div className="space-y-3">
            {Object.entries({
              'web': 'Développement Web',
              'ia': 'Automatisation IA',
              'transformation': 'Transformation Digitale',
              'audit': 'Audit Technique',
              'other': 'Autre'
            }).map(([key, label]) => {
              const count = serviceAnalysis[key] || 0
              const percentage = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-3">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Performance Business */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Performance Business</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              {formatPrice(businessMetrics?.pipelineValue || 0)}
            </div>
            <div className="text-sm text-gray-600">Pipeline Total</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(businessMetrics?.avgTicket || 0)}
            </div>
            <div className="text-sm text-gray-600">Ticket Moyen</div>
          </div>
          
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-xl font-bold text-amber-600">
              {businessMetrics?.avgLeadScore || 0}/100
            </div>
            <div className="text-sm text-gray-600">Score Qualité</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">
              {leads.filter(l => l.score >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Leads Chauds</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}