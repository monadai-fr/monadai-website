import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * API CMS Email Templates - CRUD pour templates
 * GET: Récupérer templates actifs
 * POST: Créer nouveau template (admin)
 */

// GET /api/cms/email-templates?type=follow_up
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query = supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error('Erreur fetch templates:', error)
      return NextResponse.json({ templates: [] })
    }

    return NextResponse.json({ 
      templates: templates || [],
      count: templates?.length || 0
    })

  } catch (error) {
    console.error('Erreur API templates:', error)
    return NextResponse.json({ templates: [] })
  }
}

// POST /api/cms/email-templates - Créer template (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.name || !body.subject || !body.html_content) {
      return NextResponse.json(
        { success: false, message: 'Nom, objet et contenu HTML requis' },
        { status: 400 }
      )
    }

    const { data: newTemplate, error } = await supabase
      .from('email_templates')
      .insert([{
        name: body.name.trim(),
        type: body.type || 'custom',
        subject: body.subject.trim(),
        html_content: body.html_content,
        variables: body.variables || []
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur create template:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la création' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Template créé avec succès',
      template: newTemplate
    })

  } catch (error) {
    console.error('Erreur API create template:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
