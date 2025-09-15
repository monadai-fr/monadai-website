'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import StatCard from '@/components/admin/stat-card'

interface SecurityLog {
  id: string
  event_type: string
  ip_address: string
  user_agent: string
  details: any
  created_at: string
}

export default function AdminSecurity() {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)

  // Récupération logs sécurité
  const fetchSecurityLogs = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.warn('Table security_logs pas encore créée, affichage vide')
        setSecurityLogs([])
        setLoading(false)
        return
      }

      setSecurityLogs(logs || [])
    } catch (error) {
      console.error('Erreur fetch security logs:', error)
      setSecurityLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSecurityLogs()
    
    // Refresh auto toutes les 10 secondes pour security
    const interval = setInterval(fetchSecurityLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  // Analyse des logs pour métriques
  const last24h = securityLogs.filter(log => 
    new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  )

  const rateLimitHits = last24h.filter(log => log.event_type === 'rate_limit').length
  const spamBlocked = last24h.filter(log => log.event_type === 'spam_detected').length  
  const botsDetected = last24h.filter(log => log.event_type === 'form_blocked').length

  // Top IPs malveillantes
  const ipCounts = last24h.reduce((acc: any, log) => {
    acc[log.ip_address] = (acc[log.ip_address] || 0) + 1
    return acc
  }, {})
  
  const topMaliciousIPs = Object.entries(ipCounts)
    .filter(([ip, count]) => (count as number) > 2)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)

  const threatLevel = topMaliciousIPs.length > 3 ? 'high' : 
                    topMaliciousIPs.length > 1 ? 'medium' : 'low'

  if (loading) {
    return (
      <div className="space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Command Center</h1>
          <p className="text-gray-600">Monitoring & protection temps réel</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`flex items-center px-3 py-2 rounded-lg border ${
            threatLevel === 'low' ? 'bg-green-50 border-green-200 text-green-700' :
            threatLevel === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              threatLevel === 'low' ? 'bg-green-500' :
              threatLevel === 'medium' ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              Threat Level: {threatLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem}>
          <StatCard
            title="Rate Limit Hits"
            value={rateLimitHits}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Spam Bloqué"
            value={spamBlocked}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636" />
              </svg>
            }
          />
        </motion.div>

        <motion.div variants={staggerItem}>
          <StatCard
            title="Bots Détectés"
            value={botsDetected}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>
      </motion.div>

      {/* Security Logs Live */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IPs Malveillantes */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">IPs Suspectes (24h)</h3>
          
          {topMaliciousIPs.length > 0 ? (
            <div className="space-y-3">
              {topMaliciousIPs.map(([ip, count]) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{ip}</p>
                    <p className="text-sm text-gray-600">{count as number} tentatives</p>
                  </div>
                  <motion.button
                    className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Bloquer
                  </motion.button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">Aucune IP suspecte détectée</p>
              <p className="text-sm text-gray-500">Système sécurisé</p>
            </div>
          )}
        </motion.div>

        {/* Événements Récents */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-900 mb-4">Événements Récents</h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {securityLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    log.event_type === 'rate_limit' ? 'bg-amber-100 text-amber-700' :
                    log.event_type === 'spam_detected' ? 'bg-red-100 text-red-700' :
                    log.event_type === 'form_blocked' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {log.event_type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleTimeString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{log.ip_address}</p>
                {log.details?.reason && (
                  <p className="text-xs text-gray-500 mt-1">{log.details.reason}</p>
                )}
              </div>
            ))}
            
            {securityLogs.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucun événement sécurité</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
