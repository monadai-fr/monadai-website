import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS FAQ Item - UPDATE et DELETE
 * Protection middleware admin
 */

// PATCH /api/cms/faq/[id] - Modifier FAQ
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    
    // Validation
    if (!body.question && !body.answer && body.section === undefined && body.is_visible === undefined) {
      return NextResponse.json(
        { success: false, message: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      )
    }

    // Préparer données update
    const updateData: any = {}
    if (body.question) updateData.question = body.question.trim()
    if (body.answer) updateData.answer = body.answer.trim()
    if (body.section) updateData.section = body.section
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order
    if (body.is_visible !== undefined) updateData.is_visible = body.is_visible

    const { data: updatedFAQ, error } = await supabase
      .from('faq_items')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur update FAQ:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la modification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ modifiée avec succès',
      faq: updatedFAQ
    })

  } catch (error) {
    console.error('Erreur API update FAQ:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/cms/faq/[id] - Supprimer FAQ
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    // Vérifier que la FAQ existe
    const { data: faq, error: fetchError } = await supabase
      .from('faq_items')
      .select('id, question')
      .eq('id', params.id)
      .single()

    if (fetchError || !faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer
    const { error: deleteError } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Erreur delete FAQ:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `FAQ "${faq.question}" supprimée avec succès`
    })

  } catch (error) {
    console.error('Erreur API delete FAQ:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

