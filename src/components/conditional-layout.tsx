'use client'

import { usePathname } from 'next/navigation'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

/**
 * Layout conditionnel - Admin vs Public
 * Admin: Interface pure sans navigation publique
 * Public: Navbar + Footer standard
 */
export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) {
    // Layout admin épuré - sans navbar/footer publiques
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }

  // Layout public standard avec navigation
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
