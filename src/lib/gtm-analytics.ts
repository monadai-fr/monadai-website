/**
 * GTM Analytics Utils - MonadAI
 * Lecture directe dataLayer pour dashboard admin
 * Solution simple et performante (Cursor Rules DRY)
 */

export interface GTMAnalyticsData {
  visitors24h: number
  devisSimulated: number
  faqOpened: number
  pageViews: number
}

/**
 * Lecture analytics depuis GTM dataLayer (temps réel)
 * @returns Métriques business depuis interactions GTM
 */
export function getGTMAnalytics(): GTMAnalyticsData {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return {
      visitors24h: 0,
      devisSimulated: 0,
      faqOpened: 0,
      pageViews: 0
    }
  }

  try {
    const dataLayer = window.dataLayer || []
    
    // Filtrer dernières 24h seulement
    const now = Date.now()
    const oneDayAgo = now - (24 * 60 * 60 * 1000)
    
    const recentEvents = dataLayer.filter((event: any) => {
      if (!event.timestamp) return true // Garder events sans timestamp
      return new Date(event.timestamp).getTime() > oneDayAgo
    })

    // Calculs analytics
    const devisEvents = recentEvents.filter((event: any) => 
      event.event === 'devis_opened' || event.eventName === 'devis_opened'
    )
    
    const faqEvents = recentEvents.filter((event: any) => 
      event.event === 'faq_opened' || event.eventName === 'faq_opened'
    )
    
    const pageViewEvents = recentEvents.filter((event: any) => 
      event.event === 'page_view' || event.eventName === 'page_view'
    )

    // Visiteurs uniques basé client_id ou session
    const uniqueVisitors = new Set(
      recentEvents
        .filter((event: any) => event.client_id || event.gtm_session)
        .map((event: any) => event.client_id || event.gtm_session)
    ).size

    return {
      visitors24h: uniqueVisitors || Math.max(1, Math.floor(pageViewEvents.length / 3)), // Estimation si pas client_id
      devisSimulated: devisEvents.length,
      faqOpened: faqEvents.length,
      pageViews: pageViewEvents.length
    }

  } catch (error) {
    // Fallback silencieux
    return {
      visitors24h: 0,
      devisSimulated: 0,
      faqOpened: 0,
      pageViews: 0
    }
  }
}
