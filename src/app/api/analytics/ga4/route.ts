import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

/**
 * API Route GA4 - Données visiteurs réelles MonadAI
 * Connexion Google Analytics 4 pour dashboard admin
 */

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '12148797133'

// Configuration auth Google Analytics
const getGA4Client = () => {
  const credentials = {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  return google.analyticsdata({ version: 'v1beta', auth })
}

export async function GET(request: NextRequest) {
  try {
    // Mode API Key (plus simple que Service Account)
    const GA4_API_KEY = process.env.GA4_API_KEY
    
    if (!GA4_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'GA4_API_KEY non configurée',
        data: {
          visitors24h: 0,
          sessionsToday: 0,
          pageViews: 0,
          bounceRate: 0
        }
      })
    }

    // Requête directe GA4 avec API Key
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport?key=${GA4_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: '1daysAgo',
              endDate: 'today',
            },
          ],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
          ],
          dimensions: [
            { name: 'date' }
          ],
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`GA4 API Error: ${response.status}`)
    }

    const result = await response.json()
    const rows = result.rows || []
    
    // Extraction données pour dashboard
    const metrics = rows.length > 0 ? {
      visitors24h: parseInt(rows[0].metricValues?.[0]?.value || '0'),
      sessionsToday: parseInt(rows[0].metricValues?.[1]?.value || '0'),
      pageViews: parseInt(rows[0].metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(rows[0].metricValues?.[3]?.value || '0')
    } : {
      visitors24h: 0,
      sessionsToday: 0, 
      pageViews: 0,
      bounceRate: 0
    }

    return NextResponse.json({
      success: true,
      data: metrics,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Erreur GA4 API:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erreur récupération données GA4',
      data: {
        visitors24h: 0,
        sessionsToday: 0,
        pageViews: 0,
        bounceRate: 0
      }
    }, { status: 500 })
  }
}
