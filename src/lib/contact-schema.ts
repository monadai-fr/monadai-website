import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: z
    .string()
    .email('Adresse email invalide')
    .min(1, 'Email requis'),
  
  phone: z
    .string()
    .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone français invalide')
    .optional()
    .or(z.literal('')),
  
  company: z
    .string()
    .max(100, 'Nom d\'entreprise trop long')
    .optional(),
  
  service: z.enum([
    'web',
    'ia', 
    'transformation',
    'audit',
    'other'
  ], { 
    message: 'Veuillez sélectionner un service'
  }),
  
  budget: z.enum([
    'less-5k',
    '5k-10k', 
    '10k-25k',
    '25k-50k',
    'more-50k',
    'not-defined'
  ], {
    message: 'Veuillez sélectionner un budget'
  }),
  
  timeline: z.enum([
    'asap',
    '1-month',
    '1-3-months', 
    '3-6-months',
    'flexible'
  ], {
    message: 'Veuillez sélectionner un délai'
  }),
  
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
  
  newsletter: z.boolean().optional(),
  
  consent: z
    .boolean()
    .refine(val => val === true, { 
      message: 'Vous devez accepter les conditions de traitement des données' 
    })
})

export type ContactFormData = z.infer<typeof contactSchema>

export const serviceLabels = {
  web: 'Développement Web',
  ia: 'Automatisation IA',
  transformation: 'Transformation Digitale', 
  audit: 'Audit Technique',
  other: 'Autre / À discuter'
} as const

export const budgetLabels = {
  'less-5k': 'Moins de 5 000€',
  '5k-10k': '5 000€ - 10 000€',
  '10k-25k': '10 000€ - 25 000€', 
  '25k-50k': '25 000€ - 50 000€',
  'more-50k': 'Plus de 50 000€',
  'not-defined': 'À définir ensemble'
} as const

export const timelineLabels = {
  asap: 'Dès que possible',
  '1-month': 'Dans le mois',
  '1-3-months': '1 à 3 mois',
  '3-6-months': '3 à 6 mois', 
  flexible: 'Flexible'
} as const
