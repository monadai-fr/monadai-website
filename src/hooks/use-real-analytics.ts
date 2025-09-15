'use client'

import { useState, useEffect } from 'react'

/**
 * Hook Analytics Réelles MonadAI
 * Intégration GA4 + GTM dataLayer pour dashboard 100% fonctionnel
 */

export interface RealAnalyticsData {
  visitors24h: number
  sessionsToday: number
  pageViews: number
  bounceRate: number
  devisSimulated: number
  faqOpened: number
  lastUpdated: string
}

export function useRealAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<RealAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupération données GA4 via API
  const fetchGA4Data = async () => {
    try {
      const response = await fetch('/api/analytics/ga4')
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        console.warn('GA4 non configuré, utilisation données locales')
        return {
          visitors24h: 0,
          sessionsToday: 0,
          pageViews: 0,
          bounceRate: 0
        }
      }
    } catch (error) {
      console.error('Erreur fetch GA4:', error)
      return {
        visitors24h: 0,
        sessionsToday: 0,
        pageViews: 0,
        bounceRate: 0
      }
    }
  }

  // Lecture GTM dataLayer pour events MonadAI
  const getGTMEvents = () => {
    if (typeof window === 'undefined' || !window.dataLayer) {
      return { devisSimulated: 0, faqOpened: 0 }
    }

    const events = window.dataLayer.filter((event: any) => 
      event.eventName === 'devis_opened' || 
      event.eventName === 'faq_opened'
    )

    return {
      devisSimulated: events.filter((e: any) => e.eventName === 'devis_opened').length,
      faqOpened: events.filter((e: any) => e.eventName === 'faq_opened').length
    }
  }

  // Récupération données complètes
  const fetchRealAnalytics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const ga4Data = await fetchGA4Data()
      const gtmEvents = getGTMEvents()
      
      const completeData: RealAnalyticsData = {
        ...ga4Data,
        ...gtmEvents,
        lastUpdated: new Date().toISOString()
      }
      
      setAnalyticsData(completeData)
    } catch (error) {
      console.error('Erreur analytics:', error)
      setError('Impossible de récupérer les données analytics')
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh toutes les 2 minutes
  useEffect(() => {
    fetchRealAnalytics()
    
    const interval = setInterval(fetchRealAnalytics, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    analyticsData,
    loading,
    error,
    refreshData: fetchRealAnalytics
  }
}
