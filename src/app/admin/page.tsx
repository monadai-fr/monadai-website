'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useAdminData } from '@/hooks/use-admin-data'
import StatCard from '@/components/admin/stat-card'
import { formatPrice } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'

export default function AdminDashboard() {
  const { businessMetrics, securityMetrics, leads, loading, refreshData } = useAdminData()
  
  // Dashboard page - SANS LOGIC COMPLEXE

  // Segmentation leads par score - MEMOIZED pour performance
  const { hotLeads, warmLeads, coldLeads } = useMemo(() => {
    return {
      hotLeads: leads.filter(lead => lead.score >= 70),
      warmLeads: leads.filter(lead => lead.score >= 40 && lead.score < 70), 
      coldLeads: leads.filter(lead => lead.score < 40)
    }
  }, [leads]) // Re-calcule seulement si leads changent

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <StatCard key={i} title="" value="" icon={<></>} loading={true} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Métriques business temps réel MonadAI</p>
        </div>
        
        <motion.button
          onClick={refreshData}
          className="bg-green-sapin text-white px-4 py-2 rounded-lg hover:bg-green-sapin-light transition-colors flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </motion.button>
      </div>

      {/* KPIs Principaux - Mobile-first responsive */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            title="Visiteurs 24h"
            value={businessMetrics?.visitors24h || 0}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Devis Simulés"
            value={businessMetrics?.devisSimulated || 0}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Contacts Soumis"
            value={businessMetrics?.contactsSubmitted || 0}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Pipeline Valeur"
            value={formatPrice(businessMetrics?.pipelineValue || 0)}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
        </motion.div>
      </motion.div>

      {/* Lead Scoring Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Chauds */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Leads Chauds</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              {hotLeads.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {hotLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <span className="text-xs font-bold text-red-600">Score: {lead.score}</span>
                </div>
                <p className="text-sm text-gray-600">{lead.service} • {lead.budget}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
            
            {hotLeads.length === 0 && (
              <p className="text-sm text-gray-500 italic">Aucun lead chaud actuellement</p>
            )}
          </div>
        </motion.div>

        {/* Leads Tièdes */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Leads Tièdes</h3>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
              {warmLeads.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {warmLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <span className="text-xs font-bold text-amber-600">Score: {lead.score}</span>
                </div>
                <p className="text-sm text-gray-600">{lead.service} • {lead.budget}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Sécurité 24h</h3>
            <div className={`w-3 h-3 rounded-full ${
              securityMetrics?.threatLevel === 'low' ? 'bg-green-500' :
              securityMetrics?.threatLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rate Limits</span>
              <span className="font-medium text-gray-900">{securityMetrics?.rateLimitHits || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Spam Bloqué</span>
              <span className="font-medium text-gray-900">{securityMetrics?.spamBlocked || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bots Détectés</span>
              <span className="font-medium text-gray-900">{securityMetrics?.botsDetected || 0}</span>
            </div>
            
            {securityMetrics?.suspiciousIPs && securityMetrics.suspiciousIPs.length > 0 && (
              <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded">
                <p className="text-xs text-amber-700 font-medium">
                  {securityMetrics.suspiciousIPs.length} IP(s) suspecte(s)
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <motion.button
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Contacter Leads Chauds</p>
              <p className="text-sm text-gray-600">{hotLeads.length} leads prioritaires</p>
            </div>
          </motion.button>

          <motion.button
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Analyser Conversions</p>
              <p className="text-sm text-gray-600">Funnel optimization</p>
            </div>
          </motion.button>

          <motion.button
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Security Review</p>
              <p className="text-sm text-gray-600">Monitoring & threats</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Revenue Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Intelligence</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pipeline Total</span>
              <span className="font-bold text-green-600">
                {formatPrice(businessMetrics?.pipelineValue || 0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ticket Moyen</span>
              <span className="font-medium text-gray-900">
                {formatPrice(businessMetrics?.avgTicket || 0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux Conversion</span>
              <span className="font-medium text-gray-900">
                {businessMetrics?.conversionRate.toFixed(1) || 0}%
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projection Mensuelle</span>
                <span className="font-bold text-green-600">
                  {formatPrice((businessMetrics?.pipelineValue || 0) * (30 / 1))} {/* Basé sur pipeline daily rate */}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services Popularity */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Services Demandés</h3>
          
          <div className="space-y-4">
            {[
              { service: 'Développement Web', count: leads.filter(l => l.service === 'web').length },
              { service: 'Automatisation IA', count: leads.filter(l => l.service === 'ia').length },
              { service: 'Transformation', count: leads.filter(l => l.service === 'transformation').length }
            ].map((item) => {
              const percentage = leads.length > 0 ? Math.round((item.count / leads.length) * 100) : 0
              return (
                <div key={item.service}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{item.service}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count} leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-green-sapin h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
