import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS Project - UPDATE et DELETE
 * Protection middleware admin
 */

// PATCH /api/cms/projects/[id] - Modifier projet
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    
    // Validation minimale - au moins un champ à modifier
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      )
    }

    // Préparer données update (seulement champs fournis)
    const updateData: any = {}
    if (body.title) updateData.title = body.title.trim()
    if (body.category) updateData.category = body.category
    if (body.description) updateData.description = body.description.trim()
    if (body.status) updateData.status = body.status
    if (body.progress !== undefined) updateData.progress = body.progress
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.tech_stack) updateData.tech_stack = body.tech_stack
    if (body.target_audience !== undefined) updateData.target_audience = body.target_audience
    if (body.focus_area !== undefined) updateData.focus_area = body.focus_area
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order
    if (body.is_visible !== undefined) updateData.is_visible = body.is_visible

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur update project:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la modification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Projet modifié avec succès',
      project: updatedProject
    })

  } catch (error) {
    console.error('Erreur API update project:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/cms/projects/[id] - Supprimer projet
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    // Vérifier que le projet existe
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, image_url')
      .eq('id', params.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { success: false, message: 'Projet non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'image du storage si elle existe
    if (project.image_url) {
      try {
        const imagePath = project.image_url.split('/').slice(-2).join('/')
        await supabase.storage
          .from('project-images')
          .remove([imagePath])
      } catch (storageError) {
        console.warn('Erreur suppression image (non bloquant):', storageError)
      }
    }

    // Supprimer le projet
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Erreur delete project:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Projet "${project.title}" supprimé avec succès`
    })

  } catch (error) {
    console.error('Erreur API delete project:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

