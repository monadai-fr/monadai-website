/**
 * Types Admin Dashboard MonadAI
 * Interfaces centralisées pour éviter duplication (DRY)
 */

export interface AdminBusinessMetrics {
  visitors24h: number
  devisSimulated: number
  contactsSubmitted: number
  conversionRate: number
  pipelineValue: number
  avgTicket: number
  monthlyProjection: number
}

export interface AdminSecurityMetrics {
  rateLimitHits: number
  spamBlocked: number
  botsDetected: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  suspiciousIPs: string[]
  lastIncident: Date | null
}

export interface AdminLead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service: 'web' | 'ia' | 'transformation' | 'audit' | 'other'
  budget: string
  timeline: string
  message: string
  newsletter: boolean
  score: number
  status: 'new' | 'contacted' | 'quoted' | 'client' | 'closed'
  created_at: string
  updated_at: string
}

export interface AdminProject {
  id: string
  name: string
  description: string
  status: 'planning' | 'development' | 'testing' | 'production'
  progress: number
  target: string
  tech: string[]
  interest: number
  mvpTarget: string
}

export interface AdminSecurityLog {
  id: string
  event_type: 'rate_limit' | 'spam_detected' | 'form_blocked' | 'suspicious_activity'
  ip_address: string
  user_agent: string
  details: Record<string, any>
  created_at: string
}

export interface AdminAlert {
  id: string
  type: 'security' | 'business' | 'technical'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  actionRequired: boolean
  created_at: string
  resolved: boolean
}
