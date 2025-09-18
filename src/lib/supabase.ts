import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Configuration validée et opérationnelle ✅
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la table contacts
export interface ContactRecord {
  id?: string
  created_at?: string
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget: string
  timeline: string
  message: string
  newsletter: boolean
  consent: boolean
  status?: 'new' | 'contacted' | 'quoted' | 'client' | 'closed'
  notes?: ContactNote[]
  last_contacted?: string
}

// Type pour les notes structurées
export interface ContactNote {
  id: string
  date: string // ISO string
  type: 'call' | 'email' | 'meeting' | 'note'
  content: string
  author: string // "Raphael"
}
