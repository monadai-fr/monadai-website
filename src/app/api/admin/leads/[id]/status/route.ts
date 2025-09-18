import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API Status CRM - Changer status d'un lead
 * PATCH: Mettre à jour le status du lead avec workflow
 */

const VALID_STATUSES = ['new', 'contacted', 'quoted', 'client', 'closed'] as const
type LeadStatus = typeof VALID_STATUSES[number]

const STATUS_LABELS = {
  'new': 'Nouveau',
  'contacted': 'Contacté', 
  'quoted': 'Devisé',
  'client': 'Client',
  'closed': 'Fermé'
} as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    // Validation status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Status invalide. Valeurs autorisées: ${VALID_STATUSES.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Récupérer lead actuel
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('id, name, email, status, notes')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Si même status, pas de changement
    if (contact.status === status) {
      return NextResponse.json({
        success: true,
        message: `Status déjà défini sur "${STATUS_LABELS[status as LeadStatus]}"`
      })
    }

    // Créer note automatique pour changement status
    const now = new Date().toISOString()
    const existingNotes = contact.notes || []
    
    const statusChangeNote = {
      id: `note_${Date.now()}`,
      date: now,
      type: 'note' as const,
      content: `Status changé: "${STATUS_LABELS[contact.status as LeadStatus] || contact.status}" → "${STATUS_LABELS[status as LeadStatus]}"`,
      author: 'Raphael'
    }

    // Mettre à jour status + ajouter note
    const updateData: any = {
      status,
      notes: [...existingNotes, statusChangeNote]
    }

    // Si passage à "contacted", mettre à jour last_contacted
    if (status === 'contacted' && contact.status === 'new') {
      updateData.last_contacted = now
    }

    const { error: updateError } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', params.id)

    if (updateError) {
      console.error('❌ Erreur mise à jour status:', updateError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Status changé avec succès: "${STATUS_LABELS[status as LeadStatus]}"`,
      statusData: {
        leadId: contact.id,
        leadName: contact.name,
        previousStatus: contact.status,
        newStatus: status,
        statusLabel: STATUS_LABELS[status as LeadStatus]
      }
    })

  } catch (error) {
    console.error('❌ Erreur API status:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
