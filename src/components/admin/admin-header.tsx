'use client'

import { motion } from 'framer-motion'

export default function AdminHeader() {
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
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
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
        </div>
      </div>
    </header>
  )
}
