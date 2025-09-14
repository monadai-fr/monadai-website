'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/contact-schema'
import { useAnalytics } from './use-analytics'

export type FormState = 'idle' | 'loading' | 'success' | 'error'

export function useContactForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const [honeypotValue, setHoneypotValue] = useState<string>('')
  const { trackContact } = useAnalytics()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: 'web',
      budget: 'not-defined',
      timeline: 'flexible',
      message: '',
      newsletter: false,
      consent: false
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setFormState('loading')
    setServerMessage('')

    // Vérification CAPTCHA côté client (bypass en développement)
    const isDev = process.env.NODE_ENV === 'development'
    const finalCaptchaToken = isDev ? 'DEV_BYPASS_TOKEN' : captchaToken
    
    if (!finalCaptchaToken) {
      setFormState('error')
      setServerMessage('Veuillez compléter la vérification sécurité.')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          captchaToken: finalCaptchaToken,
          website: honeypotValue // Honeypot field
        })
      })

      const result = await response.json()

      if (result.success) {
        setFormState('success')
        setServerMessage(result.message)
        
        // Track contact réussi avec données business
        trackContact('form', {
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          hasCompany: !!data.company,
          hasPhone: !!data.phone,
          newsletter: data.newsletter
        })
        
        form.reset() // Reset form après succès
      } else {
        setFormState('error')
        setServerMessage(result.message || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur envoi formulaire:', error)
      setFormState('error')
      setServerMessage('Impossible d\'envoyer le message. Vérifiez votre connexion.')
    }
  }

  const resetForm = () => {
    setFormState('idle')
    setServerMessage('')
    setCaptchaToken('')
    setHoneypotValue('')
    form.reset()
  }

  // Logique CAPTCHA : valide en dev, nécessite token en prod
  const isDev = process.env.NODE_ENV === 'development'
  const isCaptchaValid = isDev || !!captchaToken

  return {
    form,
    formState,
    serverMessage,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm,
    isLoading: formState === 'loading',
    isSuccess: formState === 'success',
    isError: formState === 'error',
    // Sécurité
    captchaToken,
    setCaptchaToken,
    honeypotValue,
    setHoneypotValue,
    isCaptchaValid
  }
}
