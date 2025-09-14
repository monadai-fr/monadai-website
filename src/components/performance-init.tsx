'use client'

import { useEffect } from 'react'
import { preloadCriticalResources } from '@/lib/performance-utils'

/**
 * Composant pour initialiser optimisations performance
 * Appelé une seule fois au mount de l'app
 */
export default function PerformanceInit() {
  useEffect(() => {
    preloadCriticalResources()
  }, [])

  return null // Pas de rendu, juste logique
}
