import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Webhook GTM → Supabase pour analytics dashboard
 * GRATUIT - Remplace API GA4 complexe par solution simple
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // GTM envoie ces données
    const {
      event_name,
      page_location,
      client_id,
      event_data,
      user_agent,
      timestamp
    } = body
    
    // Validation event_name (éviter undefined)
    const cleanEventName = event_name && event_name !== 'undefined' ? event_name : 'page_view'
    
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const uniqueClientId = client_id || `session_${clientIP}_${Date.now()}`
    
    // 🛡️ DÉDUPLICATION : Éviter double-clicks sur events critiques
    if (['devis_opened', 'contact_submitted', 'faq_opened'].includes(cleanEventName)) {
      const recentEvent = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_name', cleanEventName)
        .eq('client_id', uniqueClientId)
        .gte('created_at', new Date(Date.now() - 5000).toISOString()) // 5 secondes
        .limit(1)
        .single()
        
      if (recentEvent.data) {
        console.log(`⚠️ Event ${cleanEventName} déjà enregistré pour ${uniqueClientId} dans les 5 dernières secondes`)
        return NextResponse.json({ success: true, message: 'Event deduplicated' })
      }
    }
    let country = request.headers.get('CF-IPCountry') || null
    
    // Fallback IPinfo.io si pas Cloudflare
    if (!country && clientIP !== 'unknown' && process.env.IPINFO_TOKEN) {
      try {
        const ipResponse = await fetch(`https://ipinfo.io/${clientIP}/json?token=${process.env.IPINFO_TOKEN}`)
        const ipData = await ipResponse.json()
        country = ipData.country || null
      } catch (error) {
        console.warn('IPinfo.io error:', error)
      }
    }
    
    // Store analytics event dans Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_name: cleanEventName,
        page_url: page_location || '',
        client_id: uniqueClientId,
        event_data: event_data || {},
        user_agent: user_agent || '',
        ip_address: clientIP,
        cf_country: country,
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
