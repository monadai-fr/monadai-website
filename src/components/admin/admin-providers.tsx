'use client'

import { SessionProvider } from 'next-auth/react'

/**
 * Providers pour Admin - Client Component
 * Wrapper NextAuth.js pour fonctionner avec App Router
 */

interface AdminProvidersProps {
  children: React.ReactNode
}

export default function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
