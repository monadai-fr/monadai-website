import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API Delete Lead CRM - Suppression définitive d'un lead
 * DELETE: Supprimer lead de la base de données
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que le lead existe
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('id, name, email')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le lead
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('❌ Erreur suppression lead:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Lead "${contact.name}" supprimé avec succès`,
      deletedLead: {
        id: contact.id,
        name: contact.name,
        email: contact.email
      }
    })

  } catch (error) {
    console.error('❌ Erreur API delete lead:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
