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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 mesh-gradient"></div>
        
        <motion.div
          className="relative bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20 w-full max-w-md"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Header avec logo MonadAI */}
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-green-sapin to-green-sapin-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {/* Logo MonadAI - M stylisé */}
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M4 4L12 2L20 4V12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12V4Z" 
                  stroke="currentColor" 
                  strokeWidth={2} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="currentColor"
                  fillOpacity={0.2}
                />
                <path 
                  d="M8 10L10 12L16 8" 
                  stroke="currentColor" 
                  strokeWidth={2.5} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Administration
              </h1>
              <p className="text-gray-600 font-medium">
                MonadAI Dashboard
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-sapin to-green-sapin-light mx-auto mt-4 rounded-full"></div>
            </motion.div>
          </div>

          {/* Bouton Google OAuth */}
          <motion.button
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-300 hover:border-green-sapin hover:shadow-md hover:bg-gray-50/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Google Icon */}
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="group-hover:text-green-sapin transition-colors">
              Connexion avec Google
            </span>
          </motion.button>

          {/* Informations sécurité */}
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 p-4 bg-green-sapin/5 rounded-xl border border-green-sapin/10">
              <svg className="w-5 h-5 text-green-sapin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-700">
                Accès restreint au propriétaire uniquement
              </p>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-700">
                Session sécurisée de 60 minutes
              </p>
            </div>
          </motion.div>

          {/* Retour site */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <a 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-sapin transition-colors font-medium group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au site MonadAI
            </a>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Authentifié mais PAS autorisé (sécurité double)
  if (session?.user?.email !== 'raph@monadai.fr') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 mesh-gradient"></div>
        
        <motion.div
          className="relative bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-red-200/20 text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Icône d'accès refusé */}
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-gray-700 font-medium">Compte connecté</p>
              <p className="font-mono text-sm text-red-600 mt-1 break-all">
                {session?.user?.email}
              </p>
            </div>
            
            <p className="text-gray-600">
              Seul le propriétaire MonadAI peut accéder à cette zone d'administration.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
            >
              Se déconnecter
            </button>
            
            <a 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors font-medium group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au site MonadAI
            </a>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // ✅ Authentifié ET autorisé - afficher dashboard
  return (
    <>
      {children}
    </>
  )
}
