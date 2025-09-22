import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS FAQ - CRUD pour questions fréquentes
 * GET: Récupérer FAQ par section
 * POST: Créer nouvelle FAQ (admin)
 */

// GET /api/cms/faq?section=homepage|services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    if (section) {
      query = query.eq('section', section)
    }

    const { data: faqItems, error } = await query

    if (error) {
      console.error('Erreur fetch FAQ:', error)
      return NextResponse.json({ faqItems: [] })
    }

    return NextResponse.json({ 
      faqItems: faqItems || [],
      count: faqItems?.length || 0
    })

  } catch (error) {
    console.error('Erreur API FAQ:', error)
    return NextResponse.json({ faqItems: [] })
  }
}

// POST /api/cms/faq - Créer FAQ (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.question || !body.answer || !body.section) {
      return NextResponse.json(
        { success: false, message: 'Question, réponse et section requis' },
        { status: 400 }
      )
    }

    const { data: newFAQ, error } = await supabase
      .from('faq_items')
      .insert([{
        section: body.section,
        question: body.question.trim(),
        answer: body.answer.trim(),
        sort_order: body.sort_order || 999
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur create FAQ:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la création' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ créée avec succès',
      faq: newFAQ
    })

  } catch (error) {
    console.error('Erreur API create FAQ:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
