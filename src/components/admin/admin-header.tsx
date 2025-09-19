'use client'

import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useAdminData } from '@/hooks/use-admin-data'
import Link from 'next/link'

interface AdminHeaderProps {
  onMobileMenuClick?: () => void
}

export default function AdminHeader({ onMobileMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { businessMetrics, securityMetrics, refreshData, loading } = useAdminData()
  
  const currentTime = new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Navigation breadcrumb admin
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/admin': return 'Dashboard Overview'
      case '/admin/analytics': return 'Business Analytics'
      case '/admin/contacts': return 'CRM & Lead Management'
      case '/admin/security': return 'Security Command Center'
      case '/admin/content': return 'Content Management'
      default: return 'Dashboard MonadAI'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Mobile Burger Menu + Page Title */}
        <div className="flex items-center space-x-3">
          {/* Burger Menu - Visible seulement mobile/tablet */}
          <button
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-green-sapin hover:bg-gray-100 transition-colors"
            aria-label="Ouvrir menu navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page Title & Breadcrumb */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">{getPageTitle(pathname)}</h1>
              <div className="hidden sm:flex items-center text-sm text-gray-500 mt-1">
                <Link href="/admin" className="hover:text-green-sapin transition-colors">
                  Admin
                </Link>
                {pathname !== '/admin' && (
                  <>
                    <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-900 font-medium">
                      {getPageTitle(pathname).replace('Dashboard ', '').replace('Business ', '').replace('CRM & ', '').replace('Command ', '').replace(' Management', '')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Live Metrics - Responsive breakpoints */}
          {!loading && businessMetrics && (
            <div className="hidden 2xl:flex items-center gap-3 ml-4 xl:ml-8">
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium text-blue-700">{businessMetrics.visitors24h} visiteurs</span>
              </div>
              
              <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-green-700">{businessMetrics.contactsSubmitted} contacts</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions & User Profile - Responsive spacing */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Quick Actions - Responsive gaps */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Refresh Data */}
            <motion.button
              onClick={refreshData}
              disabled={loading}
              className={`p-2 rounded-lg border transition-colors ${
                loading 
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-green-sapin'
              }`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              title="Actualiser les données"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>

            {/* Security Alert */}
            {securityMetrics?.threatLevel && securityMetrics.threatLevel !== 'low' && (
              <motion.div
                className="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <svg className="w-4 h-4 mr-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium text-amber-700">
                  Threat {securityMetrics.threatLevel}
                </span>
              </motion.div>
            )}
          </div>

          {/* User Profile Enhanced */}
          {session && (
            <div className="flex items-center gap-2 md:gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center">
                <img 
                  src={session.user?.image || '/favicon-192.webp'} 
                  alt="Profile Admin MonadAI"
                  className="w-8 h-8 rounded-full mr-3 border-2 border-green-sapin"
                  onError={(e) => {
                    e.currentTarget.src = '/favicon-192.webp'
                  }}
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">Admin • En ligne</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Site Link */}
                <motion.a
                  href="/"
                  target="_blank"
                  className="p-1.5 text-gray-500 hover:text-green-sapin rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  title="Voir le site"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>

                {/* Logout */}
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-1.5 text-red-600 hover:text-red-700 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Déconnexion sécurisée"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last Update Timer */}
      <div className="flex items-center justify-center pt-2 border-t border-gray-100 mt-4">
        <div className="text-xs text-gray-500">
          Dernière mise à jour : {currentTime}
        </div>
      </div>
    </header>
  )
}
