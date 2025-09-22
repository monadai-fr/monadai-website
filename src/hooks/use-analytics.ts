'use client'

import { track } from '@vercel/analytics'

/**
 * Hook Analytics MonadAI - Tracking events business
 * Solution DRY pour tracking utilisateur (Vercel + GTM)
 */

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

// Events business MonadAI
export const ANALYTICS_EVENTS = {
  // Conversion funnel
  DEVIS_OPENED: 'devis_opened',
  DEVIS_SERVICE_SELECTED: 'devis_service_selected',
  DEVIS_CALCULATED: 'devis_calculated', 
  DEVIS_SUBMITTED: 'devis_submitted',
  CONTACT_SUBMITTED: 'contact_submitted',
  
  // Engagement
  FAQ_OPENED: 'faq_opened',
  PROJECT_CLICKED: 'project_interest',
  SERVICE_VIEWED: 'service_viewed',
  
  // Navigation
  CTA_CLICKED: 'cta_clicked',
  SOCIAL_CLICKED: 'social_clicked'
} as const

export function useAnalytics() {
  
  // Tracking simple Vercel Analytics uniquement
  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // Vercel Analytics - simple et fiable
    track(eventName, eventData as any)
  }

  // Méthodes business spécifiques MonadAI
  const trackDevis = {
    opened: (page: string) => trackEvent(ANALYTICS_EVENTS.DEVIS_OPENED, { page }),
    
    serviceSelected: (service: string, totalServices: number) => 
      trackEvent(ANALYTICS_EVENTS.DEVIS_SERVICE_SELECTED, { service, totalServices }),
    
    calculated: (services: string[], complexity: string, price: number) => 
      trackEvent(ANALYTICS_EVENTS.DEVIS_CALCULATED, { services, complexity, price }),
    
    submitted: (price: number, services: string[], leadQuality: 'high' | 'medium' | 'low') => 
      trackEvent(ANALYTICS_EVENTS.DEVIS_SUBMITTED, { price, services, leadQuality })
  }

  const trackFAQ = (questionId: string, section: 'homepage' | 'services') => {
    trackEvent(ANALYTICS_EVENTS.FAQ_OPENED, { questionId, section })
  }

  const trackContact = (source: 'form' | 'phone' | 'email', formData?: Record<string, any>) => {
    trackEvent(ANALYTICS_EVENTS.CONTACT_SUBMITTED, { source, ...formData })
  }

  const trackProject = (projectId: string, projectName: string) => {
    trackEvent(ANALYTICS_EVENTS.PROJECT_CLICKED, { projectId, projectName })
  }

  return {
    trackEvent,
    trackDevis,
    trackFAQ, 
    trackContact,
    trackProject
  }
}
