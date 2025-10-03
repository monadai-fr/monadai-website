import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS Email Template - UPDATE et DELETE
 * Protection middleware admin
 */

// PATCH /api/cms/email-templates/[id] - Modifier template
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name && !body.subject && !body.html_content && body.is_active === undefined) {
      return NextResponse.json(
        { success: false, message: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      )
    }

    // Préparer données update
    const updateData: any = {}
    if (body.name) updateData.name = body.name.trim()
    if (body.type) updateData.type = body.type
    if (body.subject) updateData.subject = body.subject.trim()
    if (body.html_content) updateData.html_content = body.html_content
    if (body.variables) updateData.variables = body.variables
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const { data: updatedTemplate, error } = await supabase
      .from('email_templates')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur update template:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la modification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Template modifié avec succès',
      template: updatedTemplate
    })

  } catch (error) {
    console.error('Erreur API update template:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/cms/email-templates/[id] - Supprimer template
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    // Vérifier que le template existe
    const { data: template, error: fetchError } = await supabase
      .from('email_templates')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (fetchError || !template) {
      return NextResponse.json(
        { success: false, message: 'Template non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer
    const { error: deleteError } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Erreur delete template:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Template "${template.name}" supprimé avec succès`
    })

  } catch (error) {
    console.error('Erreur API delete template:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

