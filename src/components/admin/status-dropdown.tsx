'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { LeadData } from '@/hooks/use-admin-data'

interface StatusDropdownProps {
  lead: LeadData
  onStatusChange?: (newStatus: string) => void
}

const STATUS_CONFIG = {
  'new': {
    label: 'Nouveau',
    color: 'bg-gray-100 text-gray-700',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  'contacted': {
    label: 'Contacté',
    color: 'bg-blue-100 text-blue-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  'quoted': {
    label: 'Devisé',
    color: 'bg-amber-100 text-amber-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  'client': {
    label: 'Client',
    color: 'bg-green-100 text-green-700',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  'closed': {
    label: 'Fermé',
    color: 'bg-red-100 text-red-700',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  }
} as const

type LeadStatus = keyof typeof STATUS_CONFIG

export default function StatusDropdown({ lead, onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentStatus = (lead.status || 'new') as LeadStatus
  const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new

  // Calculer position dropdown pour portal
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 160 // 160px = largeur dropdown
      })
    }
  }, [isOpen])

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
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation() // Empêche la propagation vers le lead row
          setIsOpen(!isOpen)
        }}
        disabled={updating}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${currentConfig.color} ${
          updating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
        }`}
        whileHover={!updating ? { scale: 1.02 } : {}}
        whileTap={!updating ? { scale: 0.98 } : {}}
      >
        {currentConfig.icon}
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

      {/* Portal dropdown pour éviter container lead */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && !updating && (
            <>
              {/* Overlay pour fermer */}
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              />
              
              {/* Menu dropdown - Portal hors container lead */}
              <motion.div
                className="fixed w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left
                }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <motion.button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation() // Empêche la propagation vers le lead row
                    handleStatusChange(status as LeadStatus)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm text-gray-900 flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                    status === currentStatus ? 'bg-gray-50' : ''
                  }`}
                  whileHover={{ x: 2 }}
                  disabled={status === currentStatus}
                >
                  {config.icon}
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
