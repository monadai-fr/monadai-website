'use client'

import { motion } from 'framer-motion'
import { useAdminData } from '@/hooks/use-admin-data'

/**
 * Footer Admin Dashboard MonadAI - Spécifique dashboard
 * System status, version, liens utiles admin (PAS comme site vitrine)
 */

export default function AdminFooter() {
  const { securityMetrics, loading } = useAdminData()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* System Status & Version */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              loading 
                ? 'bg-amber-500 animate-pulse' 
                : securityMetrics?.threatLevel === 'low' 
                  ? 'bg-green-500' 
                  : securityMetrics?.threatLevel === 'medium'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {loading ? 'Checking...' : 
               securityMetrics?.threatLevel === 'low' ? 'System Secure' :
               securityMetrics?.threatLevel === 'medium' ? 'Security Alert' : 'High Risk'}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            MonadAI Admin v{process.env.npm_package_version || '1.0'}
          </div>
        </div>

        {/* Quick Actions & Links */}
        <div className="flex items-center space-x-4">
          
          {/* Performance Indicator */}
          <motion.div 
            className="hidden lg:flex items-center text-xs text-gray-500"
            whileHover={{ scale: 1.02 }}
          >
            <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Performance A+</span>
          </motion.div>

          {/* Server Time */}
          <div className="hidden md:block text-xs text-gray-500">
            Server: {new Date().toLocaleTimeString('fr-FR')}
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-3 text-xs">
            <a 
              href="https://app.supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-sapin transition-colors"
            >
              Supabase
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://vercel.com" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-green-sapin transition-colors"
            >
              Vercel
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://tagmanager.google.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-sapin transition-colors"
            >
              GTM
            </a>
          </div>
        </div>

        {/* Copyright Admin */}
        <div className="text-xs text-gray-400">
          © {currentYear} MonadAI Admin
        </div>
      </div>
    </footer>
  )
}
