'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

/**
 * Admin Guard NextAuth.js - Sécurité production
 * OAuth Google + restriction email + session 1h
 */

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuardNextAuth({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()

  // Loading state - vérification auth en cours
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-sapin border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
          <p className="text-sm text-gray-500 mt-2">Connexion Google OAuth</p>
        </div>
      </div>
    )
  }

  // Non authentifié - Page login Google
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-sapin rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin MonadAI</h1>
            <p className="text-gray-600">Accès sécurisé par Google OAuth</p>
          </div>

          <motion.button
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se connecter avec Google
          </motion.button>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              🔒 Accès restreint au propriétaire uniquement
            </p>
            <p className="text-xs text-blue-600 text-center">
              ⏱️ Session automatique : 1 heure
            </p>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-sm text-gray-500 hover:text-green-sapin transition-colors"
            >
              ← Retour au site principal
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  // Authentifié mais PAS autorisé (sécurité double)
  if (session?.user?.email !== 'raph@monadai.fr') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg border border-red-200 text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-2">
            Compte : <span className="font-mono text-sm">{session?.user?.email}</span>
          </p>
          <p className="text-gray-600 mb-6">Seul le propriétaire peut accéder à cette zone.</p>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </motion.div>
      </div>
    )
  }

  // ✅ Authentifié ET autorisé - afficher dashboard
  return (
    <div className="relative">
      {/* Header admin avec profile + logout */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
          <div className="flex items-center text-sm text-gray-600">
            <img 
              src={session.user?.image || ''} 
              alt="Profile Admin"
              className="w-6 h-6 rounded-full mr-2 border border-gray-200"
            />
            <span className="hidden sm:block">{session.user?.name}</span>
          </div>
          <motion.button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Déconnexion sécurisée"
          >
            Logout
          </motion.button>
        </div>
      </div>
      
      {children}
    </div>
  )
}
