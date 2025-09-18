'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { LeadData } from '@/hooks/use-admin-data'

interface StatusDropdownProps {
  lead: LeadData
  onStatusChange?: (newStatus: string) => void
}

const STATUS_CONFIG = {
  'new': {
    label: 'Nouveau',
    color: 'bg-gray-100 text-gray-700',
    icon: '🆕'
  },
  'contacted': {
    label: 'Contacté',
    color: 'bg-blue-100 text-blue-700',
    icon: '📞'
  },
  'quoted': {
    label: 'Devisé',
    color: 'bg-amber-100 text-amber-700',
    icon: '📋'
  },
  'client': {
    label: 'Client',
    color: 'bg-green-100 text-green-700',
    icon: '✅'
  },
  'closed': {
    label: 'Fermé',
    color: 'bg-red-100 text-red-700',
    icon: '🔒'
  }
} as const

type LeadStatus = keyof typeof STATUS_CONFIG

export default function StatusDropdown({ lead, onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const currentStatus = (lead.status || 'new') as LeadStatus
  const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (newStatus === currentStatus || updating) return

    setUpdating(true)
    setIsOpen(false)

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (result.success) {
        onStatusChange?.(newStatus)
      } else {
        console.error('Erreur changement status:', result.message)
        // TODO: Afficher toast d'erreur
      }
    } catch (error) {
      console.error('Erreur API status:', error)
      // TODO: Afficher toast d'erreur
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${currentConfig.color} ${
          updating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
        }`}
        whileHover={!updating ? { scale: 1.02 } : {}}
        whileTap={!updating ? { scale: 0.98 } : {}}
      >
        <span>{currentConfig.icon}</span>
        <span>{currentConfig.label}</span>
        {updating ? (
          <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
          </svg>
        ) : (
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && !updating && (
          <>
            {/* Overlay pour fermer */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <motion.button
                  key={status}
                  onClick={() => handleStatusChange(status as LeadStatus)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                    status === currentStatus ? 'bg-gray-50' : ''
                  }`}
                  whileHover={{ x: 2 }}
                  disabled={status === currentStatus}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                  {status === currentStatus && (
                    <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
