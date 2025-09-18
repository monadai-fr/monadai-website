import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Webhook GTM → Supabase pour analytics dashboard
 * GRATUIT - Remplace API GA4 complexe par solution simple
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // GTM Server-Side ou HTTP Request Tag envoie ces données
    const {
      event_name,
      page_location,
      client_id,
      event_data,
      user_agent,
      timestamp
    } = body
    
    // Validation basique
    if (!event_name) {
      return NextResponse.json({ success: false, error: 'event_name requis' }, { status: 400 })
    }
    
    // Store analytics event dans Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_name,
        page_url: page_location || '',
        client_id: client_id || 'unknown',
        event_data: event_data || {},
        user_agent: user_agent || '',
        ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        cf_country: request.headers.get('CF-IPCountry') || null,
        created_at: timestamp || new Date().toISOString()
      }])
    
    if (error) {
      console.error('❌ Erreur webhook analytics:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
    
    console.log('✅ Analytics event stored:', event_name)
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Erreur webhook GTM:', error)
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }
}

// Endpoint GET pour debug/test
export async function GET() {
  return NextResponse.json({ 
    status: 'GTM Webhook MonadAI',
    version: '1.0',
    ready: true,
    docs: 'POST event_name, page_location, client_id, event_data'
  })
}
