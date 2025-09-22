'use client'

import { useState, useEffect } from 'react'

/**
 * Hook pour récupérer projets SaaS côté public
 * Version optimisée pour homepage et portfolio
 */

interface PublicProject {
  id: string
  slug: string
  title: string
  category: string
  description: string
  status: string
  gradient_from: string
  gradient_to: string
  tech_stack: string[]
  target_audience?: string
  focus_area?: string
}

export function usePublicProjects() {
  const [projects, setProjects] = useState<PublicProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/cms/projects')
        const result = await response.json()
        
        setProjects(result.projects || [])
      } catch (error) {
        console.error('Erreur fetch public projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    hasProjects: projects.length > 0
  }
}
