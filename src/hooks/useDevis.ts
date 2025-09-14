'use client'

import { useState, useMemo } from 'react'

export type ServiceType = 'web' | 'ia' | 'transformation'
export type ComplexityType = 'simple' | 'moyen' | 'complexe'

export interface DevisAddons {
  seo: boolean
  animations: boolean
  formation: boolean
  maintenance: boolean
}

export interface DevisState {
  services: ServiceType[]
  complexity: ComplexityType
  addons: DevisAddons
}

// Tarifs ajustés étudiant - marché français 2025
const SERVICE_PRICES = {
  web: 1500,      // Sites vitrines/e-commerce base
  ia: 2000,       // Chatbots/automatisation base  
  transformation: 1000  // Audit/stratégie digitale base
} as const

const COMPLEXITY_MULTIPLIERS = {
  simple: 1,
  moyen: 1.3,
  complexe: 1.7
} as const

const ADDON_MULTIPLIERS = {
  seo: 1.15,        // +15%
  animations: 1.10,  // +10%
  formation: 1.20,   // +20%
  maintenance: 1.25  // +25%
} as const

export function useDevis() {
  const [devisState, setDevisState] = useState<DevisState>({
    services: [],
    complexity: 'simple',
    addons: {
      seo: false,
      animations: false,
      formation: false,
      maintenance: false
    }
  })

  // Calcul total en temps réel
  const calculatedTotal = useMemo(() => {
    // Prix de base des services sélectionnés
    const basePrice = devisState.services.reduce((total, service) => {
      return total + SERVICE_PRICES[service]
    }, 0)

    if (basePrice === 0) return 0

    // Application multiplicateur complexité
    const complexityPrice = basePrice * COMPLEXITY_MULTIPLIERS[devisState.complexity]

    // Application multiplicateurs addons
    const finalPrice = Object.entries(devisState.addons).reduce((price, [addon, enabled]) => {
      if (enabled) {
        return price * ADDON_MULTIPLIERS[addon as keyof DevisAddons]
      }
      return price
    }, complexityPrice)

    return Math.round(finalPrice)
  }, [devisState])

  // Actions pour modifier le devis
  const toggleService = (service: ServiceType) => {
    setDevisState(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const setComplexity = (complexity: ComplexityType) => {
    setDevisState(prev => ({ ...prev, complexity }))
  }

  const toggleAddon = (addon: keyof DevisAddons) => {
    setDevisState(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addon]: !prev.addons[addon]
      }
    }))
  }

  const resetDevis = () => {
    setDevisState({
      services: [],
      complexity: 'simple',
      addons: {
        seo: false,
        animations: false,
        formation: false,
        maintenance: false
      }
    })
  }

  // Estimation durée projet (pour info)
  const estimatedDuration = useMemo(() => {
    const baseDays = devisState.services.reduce((total, service) => {
      const serviceDays = {
        web: 15,           // 3 semaines
        ia: 12,            // 2.5 semaines  
        transformation: 8   // 1.5 semaine
      }
      return total + serviceDays[service]
    }, 0)

    return Math.round(baseDays * COMPLEXITY_MULTIPLIERS[devisState.complexity])
  }, [devisState])

  return {
    devisState,
    calculatedTotal,
    estimatedDuration,
    toggleService,
    setComplexity,
    toggleAddon,
    resetDevis,
    serviceLabels: {
      web: 'Développement Web',
      ia: 'Automatisation IA', 
      transformation: 'Transformation Digitale'
    },
    complexityLabels: {
      simple: 'Simple',
      moyen: 'Moyen',
      complexe: 'Complexe'
    },
    addonLabels: {
      seo: 'SEO Avancé',
      animations: 'Animations Premium',
      formation: 'Formation Équipe',
      maintenance: 'Maintenance 6 mois'
    }
  }
}
