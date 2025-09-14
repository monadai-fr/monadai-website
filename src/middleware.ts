import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware sécurité MonadAI - Rate limiting et protection
 * Niveau Professional conforme expertise cybersécurité
 */

// Map pour tracker requêtes par IP
const requestCounts = new Map<string, { count: number; resetTime: number }>()

// Configuration rate limiting
const RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,  // 10 minutes
  maxRequests: 5,            // 5 requêtes max
  contactPath: '/api/contact'
}

function getClientIP(request: NextRequest): string {
  // Récupérer vraie IP (Vercel forwarding)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  return 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  // Première requête ou fenêtre expirée
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    })
    return false
  }
  
  // Incrémenter compteur
  record.count++
  
  // Vérifier limite
  return record.count > RATE_LIMIT.maxRequests
}

export function middleware(request: NextRequest) {
  // SEULEMENT rate limiting API contact - HEADERS DÉSACTIVÉS POUR TEST
  if (request.nextUrl.pathname === RATE_LIMIT.contactPath) {
    const clientIP = getClientIP(request)
    
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trop de tentatives. Veuillez patienter 10 minutes.',
          rateLimitHit: true
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '600', // 10 minutes
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }
  }

  // Return response sans headers pour test
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/contact'
    // COMPLÈTEMENT DÉSACTIVÉ POUR TEST
    // '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)'
  ]
}
