import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ContactNote } from '@/lib/supabase'

/**
 * API Notes CRM - Gestion des notes pour leads
 * GET: Récupérer notes d'un lead
 * POST: Ajouter nouvelle note
 * PATCH: Modifier note existante
 * DELETE: Supprimer note
 */

// GET /api/admin/leads/[id]/notes - Récupérer toutes les notes
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const { data: contact, error } = await supabase
      .from('contacts')
      .select('notes')
      .eq('id', params.id)
      .single()

    if (error || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Notes triées par date décroissante (plus récent en haut)
    const notes = (contact.notes || []).sort((a: ContactNote, b: ContactNote) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json({ 
      success: true, 
      notes 
    })

  } catch (error) {
    console.error('❌ Erreur GET notes:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/admin/leads/[id]/notes - Ajouter nouvelle note
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { type, content } = body

    // Validation
    if (!type || !content || !['call', 'email', 'meeting', 'note'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Type et contenu requis (type: call|email|meeting|note)' },
        { status: 400 }
      )
    }

    // Créer nouvelle note
    const newNote: ContactNote = {
      id: `note_${Date.now()}`,
      date: new Date().toISOString(),
      type,
      content: content.trim(),
      author: 'Raphael'
    }

    // Récupérer notes existantes
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('notes, last_contacted')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Ajouter nouvelle note aux existantes
    const updatedNotes = [...(contact.notes || []), newNote]
    
    // Mettre à jour last_contacted si c'est un contact direct
    const shouldUpdateLastContacted = ['call', 'email', 'meeting'].includes(type)
    const updateData: any = { notes: updatedNotes }
    
    if (shouldUpdateLastContacted) {
      updateData.last_contacted = newNote.date
    }

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', params.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Note ajoutée avec succès',
      note: newNote
    })

  } catch (error) {
    console.error('❌ Erreur POST note:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'ajout de la note' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/leads/[id]/notes - Modifier note existante
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const body = await request.json()
    const { noteId, content } = body

    if (!noteId || !content) {
      return NextResponse.json(
        { success: false, message: 'ID note et contenu requis' },
        { status: 400 }
      )
    }

    // Récupérer notes actuelles
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('notes')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Modifier la note
    const notes = contact.notes || []
    const noteIndex = notes.findIndex((note: ContactNote) => note.id === noteId)
    
    if (noteIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      content: content.trim(),
      // On garde la date originale, mais on peut ajouter updatedAt si besoin
    }

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ notes })
      .eq('id', params.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Note modifiée avec succès',
      note: notes[noteIndex]
    })

  } catch (error) {
    console.error('❌ Erreur PATCH note:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la modification' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/leads/[id]/notes?noteId=xxx - Supprimer note
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get('noteId')

    if (!noteId) {
      return NextResponse.json(
        { success: false, message: 'ID note requis' },
        { status: 400 }
      )
    }

    // Récupérer notes actuelles
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('notes')
      .eq('id', params.id)
      .single()

    if (fetchError || !contact) {
      return NextResponse.json(
        { success: false, message: 'Lead non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer la note
    const notes = (contact.notes || []).filter((note: ContactNote) => note.id !== noteId)

    // Sauvegarder
    const { error: updateError } = await supabase
      .from('contacts')
      .update({ notes })
      .eq('id', params.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Note supprimée avec succès'
    })

  } catch (error) {
    console.error('❌ Erreur DELETE note:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
