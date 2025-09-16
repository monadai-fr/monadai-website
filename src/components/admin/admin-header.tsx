'use client'

import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

export default function AdminHeader() {
  const { data: session } = useSession()
  const currentTime = new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard MonadAI</h1>
          <p className="text-sm text-gray-600">{currentTime}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Health Score */}
          <motion.div 
            className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-700">System Healthy</span>
          </motion.div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Live</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Optimisé</span>
            </div>
          </div>

          {/* User Profile & Logout */}
          {session && (
            <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center text-sm text-gray-600">
                <img 
                  src={session.user?.image || ''} 
                  alt="Profile Admin"
                  className="w-6 h-6 rounded-full mr-2 border border-gray-200"
                />
                <span className="hidden sm:block">{session.user?.name?.split(' ')[0]}</span>
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
          )}
        </div>
      </div>
    </header>
  )
}
