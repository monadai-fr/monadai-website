'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRealAnalytics } from './use-real-analytics'

/**
 * Hook Admin Data - Business Intelligence MonadAI
 * Centralise toutes les métriques admin (principe DRY)
 */

export interface BusinessMetrics {
  visitors24h: number
  devisSimulated: number
  contactsSubmitted: number
  conversionRate: number
  pipelineValue: number
  avgTicket: number
}

export interface SecurityMetrics {
  rateLimitHits: number
  spamBlocked: number
  botsDetected: number
  threatLevel: 'low' | 'medium' | 'high'
  suspiciousIPs: string[]
}

export interface LeadData {
  id: string
  name: string
  email: string
  company?: string
  service: string
  budget: string
  message: string
  score: number
  status: string
  created_at: string
}

export function useAdminData() {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [leads, setLeads] = useState<LeadData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Hook analytics réelles (GA4 + GTM)
  const { analyticsData: realAnalytics } = useRealAnalytics()

  // Calcul lead scoring automatique
  const calculateLeadScore = (lead: any): number => {
    let score = 0
    
    // Budget élevé = +30 points
    if (lead.budget === 'more-50k') score += 30
    else if (lead.budget === '25k-50k') score += 25
    else if (lead.budget === '10k-25k') score += 15
    
    // Timeline urgent = +20 points
    if (lead.timeline === 'asap') score += 20
    else if (lead.timeline === '1-month') score += 15
    
    // Entreprise = +10 points
    if (lead.company) score += 10
    
    // Message détaillé = +15 points
    if (lead.message && lead.message.length > 100) score += 15
    
    // Téléphone fourni = +10 points
    if (lead.phone) score += 10
    
    return Math.min(score, 100)
  }

  // Récupération données business
  const fetchBusinessMetrics = async () => {
    try {
      // Contacts dernières 24h avec fallback intelligent
      const { data: contacts24h, error: error24h } = await supabase
        .from('contacts')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // Si pas de contacts 24h, prendre les plus récents pour avoir des métriques
      let contactsToUse = contacts24h
      if ((!contacts24h || contacts24h.length === 0) && !error24h) {
        console.log('📊 Pas de contacts 24h, utilisation contacts récents pour métriques')
        const { data: recentContacts } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        contactsToUse = recentContacts
      }

      if (error24h) {
        console.warn('Table contacts pas encore créée')
        setBusinessMetrics({
          visitors24h: 0,
          devisSimulated: 0, 
          contactsSubmitted: 0,
          conversionRate: 0,
          pipelineValue: 0,
          avgTicket: 0
        })
        return
      }

      // Pipeline value calculation
      const budgetValues = {
        'less-5k': 2500,
        '5k-10k': 7500, 
        '10k-25k': 17500,
        '25k-50k': 37500,
        'more-50k': 75000,
        'not-defined': 5000
      }

      const pipelineValue = contactsToUse?.reduce((total, contact) => {
        return total + (budgetValues[contact.budget as keyof typeof budgetValues] || 0)
      }, 0) || 0

      // Intégration données GA4 + GTM réelles
      const visitorsCount = realAnalytics?.visitors24h || 0
      const devisCount = realAnalytics?.devisSimulated || 0
      const contactsCount = contactsToUse?.length || 0
      
      setBusinessMetrics({
        visitors24h: visitorsCount,
        devisSimulated: devisCount,
        contactsSubmitted: contactsCount,
        conversionRate: visitorsCount > 0 ? (contactsCount / visitorsCount) * 100 : 0,
        pipelineValue,
        avgTicket: contactsCount > 0 ? pipelineValue / contactsCount : 0
      })
    } catch (error) {
      console.error('Erreur fetch business metrics:', error)
      // Fallback avec données analytics si disponibles
      setBusinessMetrics({
        visitors24h: realAnalytics?.visitors24h || 0,
        devisSimulated: realAnalytics?.devisSimulated || 0,
        contactsSubmitted: 0,
        conversionRate: 0,
        pipelineValue: 0,
        avgTicket: 0
      })
    }
  }

  // Récupération données sécurité
  const fetchSecurityMetrics = async () => {
    try {
      const { data: securityLogs, error } = await supabase
        .from('security_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (error) {
        console.warn('Table security_logs pas encore créée, utilisation données mock')
        setSecurityMetrics({
          rateLimitHits: 0,
          spamBlocked: 0,
          botsDetected: 0,
          threatLevel: 'low',
          suspiciousIPs: []
        })
        return
      }

      const rateLimitHits = securityLogs?.filter(log => log.event_type === 'rate_limit').length || 0
      const spamBlocked = securityLogs?.filter(log => log.event_type === 'spam_detected').length || 0
      const botsDetected = securityLogs?.filter(log => log.event_type === 'form_blocked').length || 0
      
      // IPs suspicieuses (plus de 3 tentatives)
      const ipCounts = securityLogs?.reduce((acc: any, log) => {
        acc[log.ip_address] = (acc[log.ip_address] || 0) + 1
        return acc
      }, {}) || {}
      
      const suspiciousIPs = Object.entries(ipCounts)
        .filter(([ip, count]) => (count as number) > 3)
        .map(([ip]) => ip)

      setSecurityMetrics({
        rateLimitHits,
        spamBlocked,
        botsDetected,
        threatLevel: suspiciousIPs.length > 0 ? 'medium' : 'low',
        suspiciousIPs
      })
    } catch (error) {
      console.error('Erreur fetch security metrics:', error)
      setSecurityMetrics({
        rateLimitHits: 0,
        spamBlocked: 0,
        botsDetected: 0,
        threatLevel: 'low',
        suspiciousIPs: []
      })
    }
  }

  // Récupération leads avec scoring
  const fetchLeads = async () => {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.warn('Table contacts pas encore créée pour leads, utilisation données mock')
        setLeads([])
        return
      }

      const enrichedLeads = contacts?.map(contact => ({
        ...contact,
        score: calculateLeadScore(contact)
      })).sort((a, b) => b.score - a.score) || []

      setLeads(enrichedLeads)
    } catch (error) {
      console.error('Erreur fetch leads:', error)
      setLeads([])
    }
  }

  // Refresh données
  const refreshData = async () => {
    setLoading(true)
    await Promise.all([
      fetchBusinessMetrics(),
      fetchSecurityMetrics(), 
      fetchLeads()
    ])
    setLoading(false)
  }

  // Init + refresh auto (côté client seulement)
  useEffect(() => {
    refreshData()
    
    // Refresh auto toutes les 30 secondes (côté client)
    if (typeof window !== 'undefined') {
      const interval = setInterval(refreshData, 30000)
      return () => clearInterval(interval)
    }
  }, [])

  return {
    businessMetrics,
    securityMetrics,
    leads,
    loading,
    refreshData
  }
}
