'use client'

import { useState, useEffect } from 'react'

/**
 * Hook Analytics Simples MonadAI
 * NETTOYÉ - Plus de GTM/Supabase complexe
 */

export interface AnalyticsData {
  visitors24h: number
  devisSimulated: number
  faqOpened: number
  lastUpdated: string
}

export function useSimpleAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitors24h: 0,
    devisSimulated: 0,
    faqOpened: 0,
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(false)

  // Reset - Plus de logique complexe
  const refreshData = () => {
    console.log('📊 Analytics simplifiées - placeholder')
    setAnalyticsData({
      visitors24h: 0,
      devisSimulated: 0,
      faqOpened: 0,
      lastUpdated: new Date().toISOString()
    })
  }

  return {
    analyticsData,
    loading,
    refreshData
  }
}
