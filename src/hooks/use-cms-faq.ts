'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface FAQItem {
  id: string
  section: 'homepage' | 'services' | 'general'
  question: string
  answer: string
  sort_order: number
  is_visible: boolean
  click_count: number
  created_at: string
  updated_at: string
}

export interface FAQFormData {
  section: 'homepage' | 'services' | 'general'
  question: string
  answer: string
}

export function useCMSFAQ() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer FAQ par section ou toutes
  const fetchFAQ = async (section?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('faq_items')
        .select('*')
        .order('sort_order', { ascending: true })

      if (section) {
        query = query.eq('section', section)
      }

      const { data, error: fetchError } = await query
      
      if (fetchError) throw fetchError
      
      setFaqItems(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des FAQ')
      console.error('Erreur fetch FAQ:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ajouter nouvelle FAQ via API
  const createFAQ = async (data: FAQFormData): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch('/api/cms/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sort_order: faqItems.filter(f => f.section === data.section).length + 1
        })
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la création')
        return false
      }
      
      // Rafraîchir pour obtenir données à jour
      await fetchFAQ()
      return true
    } catch (err) {
      setError('Erreur lors de la création')
      console.error('Erreur create FAQ:', err)
      return false
    }
  }

  // Modifier FAQ existante via API
  const updateFAQ = async (id: string, data: Partial<FAQFormData>): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch(`/api/cms/faq/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la modification')
        return false
      }

      // Rafraîchir pour obtenir données à jour
      await fetchFAQ()
      return true
    } catch (err) {
      setError('Erreur lors de la modification')
      console.error('Erreur update FAQ:', err)
      return false
    }
  }

  // Supprimer FAQ via API
  const deleteFAQ = async (id: string): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch(`/api/cms/faq/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la suppression')
        return false
      }
      
      setFaqItems(prev => prev.filter(faq => faq.id !== id))
      return true
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error('Erreur delete FAQ:', err)
      return false
    }
  }

  // Incrémenter compteur clics (analytics simple)
  const incrementClickCount = async (id: string): Promise<void> => {
    try {
      const faq = faqItems.find(f => f.id === id)
      const newCount = faq ? faq.click_count + 1 : 1
      
      await supabase
        .from('faq_items')
        .update({ click_count: newCount })
        .eq('id', id)
      
      // Mise à jour locale
      setFaqItems(prev => 
        prev.map(faq => 
          faq.id === id ? { ...faq, click_count: faq.click_count + 1 } : faq
        )
      )
    } catch (err) {
      console.error('Erreur increment click:', err)
      // Non bloquant
    }
  }

  // Toggle visibilité
  const toggleVisibility = async (id: string): Promise<boolean> => {
    const faq = faqItems.find(f => f.id === id)
    if (!faq) return false
    
    return updateFAQ(id, { is_visible: !faq.is_visible } as any)
  }

  // Helpers pour statistiques
  const getFAQStats = () => {
    const bySection = faqItems.reduce((acc, faq) => {
      acc[faq.section] = (acc[faq.section] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalClicks = faqItems.reduce((sum, faq) => sum + faq.click_count, 0)
    const mostPopular = faqItems.reduce((prev, current) => 
      (prev.click_count > current.click_count) ? prev : current
    )

    return {
      total: faqItems.length,
      bySection,
      totalClicks,
      mostPopular: faqItems.length > 0 ? mostPopular : null,
      avgClicks: faqItems.length > 0 ? Math.round(totalClicks / faqItems.length) : 0
    }
  }

  // Initialisation
  useEffect(() => {
    fetchFAQ()
  }, [])

  return {
    faqItems,
    loading,
    error,
    // Actions
    createFAQ,
    updateFAQ,
    deleteFAQ,
    toggleVisibility,
    incrementClickCount,
    refreshFAQ: fetchFAQ,
    // Helpers
    getFAQStats,
    // Filtres
    getBySection: (section: string) => faqItems.filter(f => f.section === section && f.is_visible),
    visibleItems: faqItems.filter(f => f.is_visible)
  }
}
