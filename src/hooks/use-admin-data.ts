'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getGTMAnalytics } from '@/lib/gtm-analytics'

/**
 * Hook Admin Data - Business Intelligence MonadAI
 * Architecture hybride : Contacts (Supabase) + Analytics (GTM dataLayer)
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
  
  const initRef = useRef(false)
  const lastFetchRef = useRef<number>(0) // Cache simple : timestamp dernière requête

  // Calcul lead scoring automatique - MEMOIZED pour performance
  const calculateLeadScore = useCallback((lead: any): number => {
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
  }, []) // Stable function, pas de dépendances

  // Récupération données business - OPTIMIZED SELECT
  const fetchBusinessMetrics = useCallback(async () => {
    try {
      // Contacts dernières 24h avec fallback intelligent - SELECT optimisé
      const { data: contacts24h, error: error24h } = await supabase
        .from('contacts')
        .select('id, created_at, budget, timeline') // Colonnes minimales pour métriques
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      // Si pas de contacts 24h, prendre les plus récents pour avoir des métriques
      let contactsToUse = contacts24h
      if ((!contacts24h || contacts24h.length === 0) && !error24h) {
        const { data: recentContacts } = await supabase
          .from('contacts')
          .select('id, created_at, budget, timeline') // SELECT optimisé
          .order('created_at', { ascending: false })
          .limit(10)
        contactsToUse = recentContacts
      }

      if (error24h) {
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

      // Métriques hybrides : Contacts (Supabase) + Analytics (GTM)
      const contactsCount = contactsToUse?.length || 0
      const gtmData = getGTMAnalytics()
      
      setBusinessMetrics({
        visitors24h: gtmData.visitors24h,
        devisSimulated: gtmData.devisSimulated,
        contactsSubmitted: contactsCount,
        conversionRate: gtmData.visitors24h > 0 ? (contactsCount / gtmData.visitors24h) * 100 : 0,
        pipelineValue,
        avgTicket: contactsCount > 0 ? pipelineValue / contactsCount : 0
      })
    } catch (error) {
      // Fallback simple
      setBusinessMetrics({
        visitors24h: 0,
        devisSimulated: 0,
        contactsSubmitted: 0,
        conversionRate: 0,
        pipelineValue: 0,
        avgTicket: 0
      })
    }
  }, []) // Fermeture useCallback pour fetchBusinessMetrics

  // Récupération données sécurité
  const fetchSecurityMetrics = useCallback(async () => {
    try {
      const { data: securityLogs, error } = await supabase
        .from('security_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (error) {
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
      setSecurityMetrics({
        rateLimitHits: 0,
        spamBlocked: 0,
        botsDetected: 0,
        threatLevel: 'low',
        suspiciousIPs: []
      })
    }
  }, []) // Fonction stable sans dépendances

  // Récupération leads avec scoring - MEMOIZED & OPTIMIZED SELECT
  const fetchLeads = useCallback(async () => {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('id, name, email, company, phone, service, budget, timeline, message, created_at, status, notes, last_contacted') // Colonnes spécifiques pour CRM
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        setLeads([])
        return
      }

      const enrichedLeads = contacts?.map(contact => ({
        ...contact,
        score: calculateLeadScore(contact)
      })).sort((a, b) => b.score - a.score) || []

      setLeads(enrichedLeads)
    } catch (error) {
      setLeads([])
    }
  }, [calculateLeadScore]) // Dépendance sur calculateLeadScore memoized

  // Refresh données - MEMOIZED avec cache simple
  const refreshData = useCallback(async () => {
    const now = Date.now()
    
    // Cache simple : éviter refresh < 30 secondes
    if (now - lastFetchRef.current < 30000) {
      return // Skip si refresh récent
    }
    
    lastFetchRef.current = now
    setLoading(true)
    
    try {
      await Promise.all([
        fetchBusinessMetrics(),
        fetchSecurityMetrics(), 
        fetchLeads()
      ])
    } catch (error) {
      console.warn('Erreur refresh admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchBusinessMetrics, fetchSecurityMetrics, fetchLeads])

  // Init SIMPLE - Contacts et leads seulement
  useEffect(() => {
    if (!initRef.current && typeof window !== 'undefined') {
      initRef.current = true
      refreshData()
      
      // Auto-refresh pour contacts + analytics GTM
      const interval = setInterval(refreshData, 120000) // 2 minutes
      
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
