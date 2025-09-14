'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

/**
 * Composant Turnstile CAPTCHA - Protection invisible
 * Design intégré MonadAI, erreurs gérées proprement
 */

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
  theme?: 'light' | 'dark'
  className?: string
}

export default function TurnstileCaptcha({ 
  onVerify, 
  onError,
  theme = 'light',
  className = '' 
}: TurnstileCaptchaProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) {
    return null
  }

  const handleSuccess = (token: string) => {
    setIsLoading(false)
    setError(null)
    onVerify(token)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Vérification échouée. Veuillez réessayer.')
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(true)
    setError(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Turnstile
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onLoad={handleLoad}
        options={{
          theme: theme,
          size: 'invisible',
          appearance: 'execute'
        }}
      />
      
      {/* État loading */}
      {isLoading && (
        <div className="flex items-center text-sm text-gray-600">
          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Vérification sécurité...
        </div>
      )}
      
      {/* Erreur */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  )
}
