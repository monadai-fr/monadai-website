/**
 * Utilitaires performance MonadAI - Version allégée
 * Seulement les optimisations vraiment utiles
 */

import dynamic from 'next/dynamic'

// Dynamic import modal devis - component lourd (300+ lignes)
export const DevisModalLazy = dynamic(() => import('@/components/devis-modal'), {
  ssr: false,
  loading: () => null
})

// Preload ressources critiques pour LCP
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload hero background (LCP critique)
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = '/images/background.webp'
    document.head.appendChild(link)
    
    // Preload logo navbar
    const logoLink = document.createElement('link')
    logoLink.rel = 'preload' 
    logoLink.as = 'image'
    logoLink.href = '/images/monadai-logo.webp'
    document.head.appendChild(logoLink)
  }
}
