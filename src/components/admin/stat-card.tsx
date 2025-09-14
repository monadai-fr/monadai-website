'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
  }
  icon: ReactNode
  color?: 'green' | 'blue' | 'amber' | 'red'
  loading?: boolean
}

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200', 
    icon: 'text-green-600',
    text: 'text-green-600'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600', 
    text: 'text-blue-600'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    text: 'text-amber-600'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-600'
  }
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'green',
  loading = false 
}: StatCardProps) {
  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change && (
            <div className="flex items-center">
              <svg 
                className={`w-4 h-4 mr-1 ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={change.value >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                />
              </svg>
              <span className={`text-sm font-medium ${change.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change.value >= 0 ? '+' : ''}{change.value}% {change.period}
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
          <div className={colors.icon}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
