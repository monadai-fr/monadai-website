'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface EmailTemplate {
  id: string
  name: string
  type: 'follow_up' | 'welcome_client' | 'quote_reminder' | 'custom'
  subject: string
  html_content: string
  variables: string[]
  usage_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailTemplateFormData {
  name: string
  type: 'follow_up' | 'welcome_client' | 'quote_reminder' | 'custom'
  subject: string
  html_content: string
  variables: string[]
}

export function useCMSEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les templates
  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      
      setTemplates(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des templates')
      console.error('Erreur fetch templates:', err)
    } finally {
      setLoading(false)
    }
  }

  // Créer nouveau template
  const createTemplate = async (data: EmailTemplateFormData): Promise<boolean> => {
    setError(null)
    
    try {
      const { data: newTemplate, error: createError } = await supabase
        .from('email_templates')
        .insert([data])
        .select()
        .single()

      if (createError) throw createError
      
      setTemplates(prev => [newTemplate, ...prev])
      return true
    } catch (err) {
      setError('Erreur lors de la création')
      console.error('Erreur create template:', err)
      return false
    }
  }

  // Modifier template
  const updateTemplate = async (id: string, data: Partial<EmailTemplateFormData>): Promise<boolean> => {
    setError(null)
    
    try {
      const { data: updatedTemplate, error: updateError } = await supabase
        .from('email_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      setTemplates(prev => 
        prev.map(template => 
          template.id === id ? updatedTemplate : template
        )
      )
      return true
    } catch (err) {
      setError('Erreur lors de la modification')
      console.error('Erreur update template:', err)
      return false
    }
  }

  // Supprimer template
  const deleteTemplate = async (id: string): Promise<boolean> => {
    setError(null)
    
    try {
      const { error: deleteError } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      setTemplates(prev => prev.filter(template => template.id !== id))
      return true
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error('Erreur delete template:', err)
      return false
    }
  }

  // Incrémenter usage (analytics)
  const incrementUsage = async (id: string): Promise<void> => {
    try {
      const template = templates.find(t => t.id === id)
      if (!template) return

      await supabase
        .from('email_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', id)

      // Mise à jour locale
      setTemplates(prev => 
        prev.map(t => 
          t.id === id ? { ...t, usage_count: t.usage_count + 1 } : t
        )
      )
    } catch (err) {
      console.error('Erreur increment usage:', err)
    }
  }

  // Toggle activation
  const toggleActive = async (id: string): Promise<boolean> => {
    const template = templates.find(t => t.id === id)
    if (!template) return false
    
    return updateTemplate(id, { is_active: !template.is_active } as any)
  }

  // Processus variables dans template
  const processTemplate = (template: EmailTemplate, variables: Record<string, string>): { subject: string; html: string } => {
    let processedSubject = template.subject
    let processedHTML = template.html_content

    // Remplacer variables {{variable}}
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value)
      processedHTML = processedHTML.replace(new RegExp(placeholder, 'g'), value)
    }

    return {
      subject: processedSubject,
      html: processedHTML
    }
  }

  // Helpers
  const getTemplatesByType = (type: string) => templates.filter(t => t.type === type && t.is_active)
  const getMostUsed = () => templates.reduce((prev, current) => 
    (prev.usage_count > current.usage_count) ? prev : current
  )

  // Initialisation
  useEffect(() => {
    fetchTemplates()
  }, [])

  return {
    templates,
    loading,
    error,
    // Actions
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleActive,
    incrementUsage,
    refreshTemplates: fetchTemplates,
    // Utils
    processTemplate,
    getTemplatesByType,
    getMostUsed: templates.length > 0 ? getMostUsed() : null,
    activeTemplates: templates.filter(t => t.is_active)
  }
}
