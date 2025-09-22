import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS Projects - CRUD pour projets SaaS
 * GET: Récupérer projets publics
 * POST: Créer nouveau projet (admin)
 */

// GET /api/cms/projects - Pour pages publiques (homepage, portfolio)
export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Erreur fetch projects:', error)
      return NextResponse.json({ projects: [] })
    }

    return NextResponse.json({ 
      projects: projects || [],
      count: projects?.length || 0
    })

  } catch (error) {
    console.error('Erreur API projects:', error)
    return NextResponse.json({ projects: [] })
  }
}

// POST /api/cms/projects - Créer projet (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation minimale
    if (!body.title || !body.category || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Titre, catégorie et description requis' },
        { status: 400 }
      )
    }

    // Générer slug unique
    const slug = body.title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const { data: newProject, error } = await supabase
      .from('projects')
      .insert([{
        slug,
        title: body.title,
        category: body.category,
        description: body.description,
        status: body.status || 'Planification',
        progress: body.progress || 0,
        gradient_from: body.gradient_from || 'gray-600',
        gradient_to: body.gradient_to || 'gray-400',
        tech_stack: body.tech_stack || ['Next.js'],
        target_audience: body.target_audience || '',
        focus_area: body.focus_area || '',
        sort_order: body.sort_order || 999
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur create project:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la création' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Projet créé avec succès',
      project: newProject
    })

  } catch (error) {
    console.error('Erreur API create project:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
