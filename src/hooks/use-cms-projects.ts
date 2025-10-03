'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  description: string
  status: string
  progress: number
  image_url?: string
  tech_stack: string[]
  target_audience?: string
  focus_area?: string
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface ProjectFormData {
  title: string
  category: string
  description: string
  status: string
  progress: number
  tech_stack: string[]
  target_audience: string
  focus_area: string
}

export function useCMSProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les projets
  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError
      
      setProjects(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des projets')
      console.error('Erreur fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ajouter nouveau projet via API
  const createProject = async (data: ProjectFormData): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch('/api/cms/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sort_order: projects.length + 1
        })
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la création du projet')
        return false
      }
      
      // Rafraîchir pour obtenir données à jour
      await fetchProjects()
      return true
    } catch (err) {
      setError('Erreur lors de la création du projet')
      console.error('Erreur create project:', err)
      return false
    }
  }

  // Modifier projet existant via API
  const updateProject = async (id: string, data: Partial<ProjectFormData>): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch(`/api/cms/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la mise à jour')
        return false
      }

      // Rafraîchir pour obtenir données à jour
      await fetchProjects()
      return true
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error('Erreur update project:', err)
      return false
    }
  }

  // Supprimer projet via API
  const deleteProject = async (id: string): Promise<boolean> => {
    setError(null)
    
    try {
      const response = await fetch(`/api/cms/projects/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.message || 'Erreur lors de la suppression')
        return false
      }
      
      setProjects(prev => prev.filter(project => project.id !== id))
      return true
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error('Erreur delete project:', err)
      return false
    }
  }

  // Toggle visibilité
  const toggleVisibility = async (id: string): Promise<boolean> => {
    const project = projects.find(p => p.id === id)
    if (!project) return false
    
    return updateProject(id, { is_visible: !project.is_visible } as any)
  }

  // Réorganiser ordre
  const reorderProjects = async (projectIds: string[]): Promise<boolean> => {
    setError(null)
    
    try {
      const updates = projectIds.map((id, index) => ({
        id,
        sort_order: index + 1
      }))

      for (const update of updates) {
        await supabase
          .from('projects')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }
      
      await fetchProjects() // Recharger pour ordre correct
      return true
    } catch (err) {
      setError('Erreur lors de la réorganisation')
      console.error('Erreur reorder projects:', err)
      return false
    }
  }

  // Initialisation
  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    // Actions
    createProject,
    updateProject,
    deleteProject,
    toggleVisibility,
    reorderProjects,
    refreshProjects: fetchProjects,
    // Helpers
    visibleProjects: projects.filter(p => p.is_visible),
    totalProjects: projects.length
  }
}
