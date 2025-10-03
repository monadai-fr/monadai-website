import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ADMIN_EMAIL } from '@/lib/auth'

/**
 * Middleware sécurité MonadAI - Rate limiting et protection admin
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Protection routes admin/CMS - Vérification authentification
  if (pathname.startsWith('/api/admin') || 
      (pathname.startsWith('/api/cms') && request.method !== 'GET')) {
    
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      // Vérifier token et email admin
      if (!token || token.email !== ADMIN_EMAIL) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Non autorisé. Authentification admin requise.' 
          },
          { status: 401 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Erreur authentification' },
        { status: 401 }
      )
    }
  }

  // 2. Rate limiting API contact
  if (pathname === RATE_LIMIT.contactPath) {
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
            'Retry-After': '600',
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/contact',
    '/api/admin/:path*',
    '/api/cms/:path*'
  ]
}
