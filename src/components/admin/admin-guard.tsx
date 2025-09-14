'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Protection Admin simple mais efficace
 * Auth basique en attendant système plus complexe
 */

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Check auth status
  useEffect(() => {
    const authStatus = localStorage.getItem('monadai-admin-auth')
    setIsAuthenticated(authStatus === 'authenticated')
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mot de passe simple (à changer en production)
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'monadai2025!'
    
    if (password === adminPassword) {
      localStorage.setItem('monadai-admin-auth', 'authenticated')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('monadai-admin-auth')
    setIsAuthenticated(false)
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-sapin border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-sapin rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin MonadAI</h1>
            <p className="text-gray-600">Accès sécurisé dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none transition-colors"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-green-sapin text-white py-3 rounded-lg font-medium hover:bg-green-sapin-light transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Accéder au Dashboard
            </motion.button>
          </form>

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

  // Authenticated - show admin content
  return (
    <div className="relative">
      {/* Logout button */}
      <div className="absolute top-4 right-4 z-50">
        <motion.button
          onClick={handleLogout}
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Déconnexion
        </motion.button>
      </div>
      
      {children}
    </div>
  )
}
