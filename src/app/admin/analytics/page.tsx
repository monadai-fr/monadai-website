'use client'

import { motion } from 'framer-motion'
import { useAdminData } from '@/hooks/use-admin-data'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { formatPrice } from '@/lib/utils'

export default function AdminAnalytics() {
  const { businessMetrics, leads, loading } = useAdminData()

  // Analyse conversion funnel (basé sur données réelles)
  const totalVisitors = businessMetrics?.visitors24h || 0
  const totalContacts = businessMetrics?.contactsSubmitted || 0
  const totalDevis = businessMetrics?.devisSimulated || 0
  
  // Calcul engagement basé sur vraies métriques (plus de hardcode 0.65)
  const estimatedEngagement = Math.max(totalDevis, totalContacts) // Engagement = max(devis, contacts)
  
  const funnelData = [
    { step: 'Visiteurs Homepage', count: totalVisitors, percentage: totalVisitors > 0 ? 100 : 0 },
    { step: 'Engagement Pages', count: estimatedEngagement, percentage: totalVisitors > 0 ? Math.round((estimatedEngagement / totalVisitors) * 100) : 0 },
    { step: 'Devis Simulés', count: totalDevis, percentage: totalVisitors > 0 ? Math.round((totalDevis / totalVisitors) * 100) : 0 },
    { step: 'Contacts Soumis', count: totalContacts, percentage: totalVisitors > 0 ? Math.round((totalContacts / totalVisitors) * 100) : 0 }
  ]

  // Analyse budgets distribution  
  const budgetAnalysis = leads.reduce((acc, lead) => {
    acc[lead.budget] = (acc[lead.budget] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
        <p className="text-gray-600">Analyse approfondie performance MonadAI</p>
      </div>

      {/* Conversion Funnel */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={staggerItem} className="font-semibold text-gray-900 mb-6">
          Funnel de Conversion
        </motion.h2>
        
        <div className="space-y-4">
          {funnelData.map((step, index) => (
            <motion.div 
              key={step.step}
              variants={staggerItem}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                  index === 0 ? 'bg-blue-500 text-white' :
                  index === 1 ? 'bg-green-500 text-white' :
                  index === 2 ? 'bg-amber-500 text-white' :
                  index === 3 ? 'bg-orange-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.step}</p>
                  <p className="text-sm text-gray-600">{step.count} utilisateurs</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-900">{step.percentage}%</p>
                {index > 0 && (
                  <p className="text-xs text-gray-500">
                    vs étape précédente
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insights automatiques */}
        {totalVisitors > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Insights Automatiques</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Visiteurs analysés : {totalVisitors} sur 24h</li>
              <li>• Taux devis : {totalDevis > 0 ? `${Math.round((totalDevis / totalVisitors) * 100)}%` : '0%'} des visiteurs</li>
              <li>• Conversion finale : {totalContacts > 0 ? `${Math.round((totalContacts / totalVisitors) * 100)}%` : '0%'}</li>
              {totalContacts === 0 && <li>• Aucune conversion aujourd'hui - optimiser le funnel</li>}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Revenue & Budget Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              const percentage = leads.length ? (count / leads.length) * 100 : 0
              
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

        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Performance Business</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">Objectif Mensuel</p>
                  <p className="text-sm text-green-700">{Math.max(5, (businessMetrics?.contactsSubmitted || 0) * 2)} contacts qualifiés</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(((businessMetrics?.contactsSubmitted || 0) / Math.max(5, (businessMetrics?.contactsSubmitted || 0) * 2)) * 100)}%
                  </p>
                  <p className="text-xs text-green-600">réalisé</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">CA Pipeline Actuel</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(businessMetrics?.pipelineValue || 0)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Projection 30j</span>
                <span className="font-bold text-green-600">
                  {formatPrice((businessMetrics?.pipelineValue || 0) * Math.max(1, (businessMetrics?.contactsSubmitted || 0)))}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Leads Qualifiés</span>
                <span className="font-bold text-blue-600">{leads.filter(l => l.score >= 70).length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
