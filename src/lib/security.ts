/**
 * Utilitaires sécurité MonadAI - Niveau Professional
 * Validation, sanitisation, détection spam
 */

import { supabase } from './supabase'

// Keywords spam détection (français + anglais)
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'crypto', 'bitcoin', 'loan', 'debt', 'click here',
  'gratuit', 'urgent', 'argent facile', 'investissement', 'paris sportif',
  'bitcoin', 'trading', 'forex', 'casino', 'poker', 'miracle', 'guaranteed',
  'make money', 'work from home', 'no experience', 'act now', 'limited time'
]

// IPs géographiques bloquées (Russie/Chine)
const BLOCKED_COUNTRIES = ['RU', 'CN']

// Ranges IP approximatifs pour blocage géographique (corrigés - 92.x = Europe/France souvent)
const BLOCKED_IP_RANGES = [
  // Russie (ranges plus précis)
  '5.', '31.', '37.', '46.', '62.', '77.', '78.', '79.', '80.', '81.', '82.', '83.', '84.', '85.',
  '86.', '87.', '88.', '89.', '90.', '91.', '93.', '94.', '95.', // ← 92. RETIRÉ !
  // Chine (ranges principaux) 
  '1.', '14.', '27.', '36.', '39.', '42.', '49.', '58.', '59.', '60.', '61.', '101.', 
  '103.', '106.', '110.', '111.', '112.', '113.', '114.', '115.', '116.', '117.', '118.', '119.',
  '120.', '121.', '122.', '123.', '124.', '125.'
]

// Domaines email suspects étendus (2025)
const SUSPICIOUS_DOMAINS = [
  // Domaines temporaires populaires
  'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.net',
  'yopmail.com', 'maildrop.cc', 'throwaway.email', 'getnada.com', 'tempail.com',
  'dispostable.com', 'trashmail.com', 'mohmal.com', 'sharklasers.com', 'grr.la',
  
  // Domaines malveillants connus
  'spambox.us', 'anonbox.net', 'anonymbox.com', 'deadaddress.com', 'fakemail.net',
  'fakeinbox.com', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu', 'jetable.org',
  
  // Nouveaux domaines 2024-2025
  'tempmailo.com', 'luxusmail.org', 'royalmail.org', 'eelmail.com', 'emailondeck.com',
  '33mail.com', 'guerrillamailblock.com', 'temporary-mail.net', 'tmpeml.com'
]

export interface SecurityValidation {
  isValid: boolean
  risk: 'low' | 'medium' | 'high'
  blockedReasons: string[]
}

export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '')  // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '')   // Remove event handlers
    .replace(/[<>]/g, '')         // Remove HTML brackets
    .substring(0, 1000)           // Limit length
}

export function detectSpam(text: string): boolean {
  const lowerText = text.toLowerCase()
  return SPAM_KEYWORDS.some(keyword => lowerText.includes(keyword))
}

// Nouvelle fonction : Validation liens dans message
export function validateLinks(text: string): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  // Regex pour détecter liens (http, www, .com, etc.)
  const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(com|org|net|fr|de|uk|io|ai|xyz)[^\s]*)/gi
  const links = text.match(linkRegex) || []
  
  if (links.length > 2) {
    blockedReasons.push('Trop de liens détectés dans le message')
    risk = 'high'
  } else if (links.length > 0) {
    risk = 'medium' // Suspect mais pas bloquant
  }
  
  return {
    isValid: blockedReasons.length === 0,
    risk,
    blockedReasons
  }
}

// Nouvelle fonction : Validation pattern nom suspect
export function validateSuspiciousName(name: string, email: string): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '')
  const emailPart = email.split('@')[0].toLowerCase().replace(/[^a-z]/g, '')
  
  // Pattern suspect : même base + suffixe (ex: rodia / rodiapm)
  if (cleanName.length >= 4 && emailPart.length >= 4) {
    const nameBase = cleanName.substring(0, 4)
    const emailBase = emailPart.substring(0, 4)
    
    if (nameBase === emailBase && cleanName !== emailPart) {
      // Même base mais différent = pattern suspect
      blockedReasons.push('Pattern nom/email suspect détecté')
      risk = 'high'
    }
  }
  
  // Noms génériques spam
  const spamNames = ['test', 'admin', 'user', 'guest', 'demo', 'sample', 'fake']
  if (spamNames.includes(cleanName)) {
    blockedReasons.push('Nom générique suspect')
    risk = 'high'
  }
  
  return {
    isValid: blockedReasons.length === 0,
    risk,
    blockedReasons
  }
}

// Nouvelle fonction : Validation géographique IP
export function validateIPGeolocation(ip: string): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  if (ip === 'unknown') {
    return { isValid: true, risk: 'low', blockedReasons: [] }
  }
  
  // Vérification ranges IP Russie/Chine (approximatif)
  const ipPrefix = ip.split('.')[0]
  
  if (BLOCKED_IP_RANGES.includes(ipPrefix + '.')) {
    blockedReasons.push('IP géolocalisation bloquée (RU/CN)')
    risk = 'high'
  }
  
  return {
    isValid: blockedReasons.length === 0,
    risk,
    blockedReasons
  }
}

// Nouvelle fonction : Validation liens hors message
export function validateLinksInOtherFields(data: any): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.(com|org|net|fr|de|uk|io|ai|xyz)[^\s]*)/gi
  
  // Vérifier liens dans nom, email domain, company
  const fieldsToCheck = [
    { field: 'name', value: data.name || '' },
    { field: 'company', value: data.company || '' }
  ]
  
  for (const { field, value } of fieldsToCheck) {
    if (linkRegex.test(value)) {
      blockedReasons.push(`Lien détecté dans le champ ${field}`)
      risk = 'high'
    }
  }
  
  return {
    isValid: blockedReasons.length === 0,
    risk,
    blockedReasons
  }
}

export function validateEmail(email: string): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  // Domain suspicious
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && SUSPICIOUS_DOMAINS.includes(domain)) {
    blockedReasons.push('Domaine email temporaire détecté')
    risk = 'high'
  }
  
  // Pattern suspects
  if (email.includes('+')) {
    risk = 'medium' // Pas bloquant mais suspect
  }
  
  return {
    isValid: blockedReasons.length === 0,
    risk,
    blockedReasons
  }
}

export function validateContactForm(data: any, clientIP?: string): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  // 1. Validation géographique IP (si fournie)
  if (clientIP) {
    const ipValidation = validateIPGeolocation(clientIP)
    if (!ipValidation.isValid) {
      blockedReasons.push(...ipValidation.blockedReasons)
      risk = 'high'
    }
  }
  
  // 2. Validation email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    blockedReasons.push(...emailValidation.blockedReasons)
    risk = emailValidation.risk
  }
  
  // 3. Validation pattern nom/email suspect
  const nameValidation = validateSuspiciousName(data.name, data.email)
  if (!nameValidation.isValid) {
    blockedReasons.push(...nameValidation.blockedReasons)
    risk = 'high'
  }
  
  // 4. Validation liens hors message
  const linksValidation = validateLinksInOtherFields(data)
  if (!linksValidation.isValid) {
    blockedReasons.push(...linksValidation.blockedReasons)
    risk = 'high'
  }
  
  // 5. Validation liens dans message (max 2)
  const messageLinksValidation = validateLinks(data.message)
  if (!messageLinksValidation.isValid) {
    blockedReasons.push(...messageLinksValidation.blockedReasons)
    risk = 'high'
  } else if (messageLinksValidation.risk === 'medium') {
    risk = 'medium'
  }
  
  // 6. Détection spam dans message
  if (detectSpam(data.message)) {
    blockedReasons.push('Contenu suspect détecté')
    risk = 'high'
  }
  
  // 7. Message trop court ou trop long 
  if (data.message.length < 10) {
    blockedReasons.push('Message trop court')
    risk = 'medium'
  }
  
  if (data.message.length > 2000) {
    blockedReasons.push('Message trop long')
    risk = 'medium'
  }
  
  return {
    isValid: risk !== 'high',
    risk,
    blockedReasons
  }
}

export async function logSecurityEvent(
  event: 'rate_limit' | 'spam_detected' | 'suspicious_email' | 'form_blocked',
  details: Record<string, any>
) {
  try {
    await supabase
      .from('security_logs')
      .insert([{
        event_type: event,
        ip_address: details.ip,
        user_agent: details.userAgent,
        details: details,
        created_at: new Date().toISOString()
      }])
  } catch (error) {
    console.error('❌ Erreur log sécurité:', error)
    // Ne pas faire planter l'app si logging échoue
  }
}
