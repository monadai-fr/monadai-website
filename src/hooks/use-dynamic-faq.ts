'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DynamicFAQItem {
  id: string
  question: string
  answer: string
  click_count: number
}

/**
 * Hook pour FAQ dynamique côté public (homepage, services)
 * Version simplifiée pour performance front-end
 */
export function useDynamicFAQ(section: 'homepage' | 'services') {
  const [faqItems, setFaqItems] = useState<DynamicFAQItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_items')
          .select('id, question, answer, click_count')
          .eq('section', section)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })

        if (error) {
          console.error('Erreur FAQ:', error)
          setFaqItems([])
          return
        }

        setFaqItems(data || [])
      } catch (err) {
        console.error('Erreur fetch FAQ:', err)
        setFaqItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchFAQ()
  }, [section])

  // Incrémenter compteur (analytics simple)
  const trackFAQClick = async (id: string) => {
    try {
      const faq = faqItems.find(f => f.id === id)
      const newCount = faq ? faq.click_count + 1 : 1
      
      // Mise à jour base
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
      console.error('Erreur track FAQ click:', err)
    }
  }

  return {
    faqItems,
    loading,
    trackFAQClick
  }
}
