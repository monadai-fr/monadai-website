import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

/**
 * API Route GA4 - Données visiteurs réelles MonadAI
 * Connexion Google Analytics 4 pour dashboard admin
 */

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '121487971133'

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
    // Vérification variables d'environnement
    if (!process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Credentials GA4 non configurés',
        data: {
          visitors24h: 0,
          sessionsToday: 0,
          pageViews: 0,
          bounceRate: 0
        }
      })
    }

    const analyticsdata = getGA4Client()

    // Requête GA4 : Visiteurs dernières 24h
    const response = await analyticsdata.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [
          {
            startDate: '1daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          { name: 'activeUsers' },        // Visiteurs uniques 24h
          { name: 'sessions' },           // Sessions 24h  
          { name: 'screenPageViews' },    // Pages vues
          { name: 'bounceRate' },         // Taux rebond
        ],
        dimensions: [
          { name: 'date' }
        ],
      },
    })

    const rows = response.data.rows || []
    
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
