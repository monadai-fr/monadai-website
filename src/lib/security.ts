/**
 * Utilitaires sécurité MonadAI - Niveau Professional
 * Validation, sanitisation, détection spam
 */

import { supabase } from './supabase'

// Keywords spam détection (français + anglais)
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'crypto', 'bitcoin', 'loan', 'debt', 'click here',
  'gratuit', 'urgent', 'argent facile', 'investissement', 'paris sportif',
  'bitcoin', 'trading', 'forex', 'casino', 'poker'
]

// Domaines email suspects
const SUSPICIOUS_DOMAINS = [
  'temp-mail.org', '10minutemail.com', 'guerrillamail.com', 
  'mailinator.com', 'tempmail.net'
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

export function validateContactForm(data: any): SecurityValidation {
  const blockedReasons: string[] = []
  let risk: 'low' | 'medium' | 'high' = 'low'
  
  // Validation email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    blockedReasons.push(...emailValidation.blockedReasons)
    risk = emailValidation.risk
  }
  
  // Détection spam dans message
  if (detectSpam(data.message)) {
    blockedReasons.push('Contenu suspect détecté')
    risk = 'high'
  }
  
  // Message trop court ou trop long 
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
