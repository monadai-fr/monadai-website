/**
 * Breadcrumb simple et professionnel
 * Navigation et SEO pour pages internes
 */

import Link from 'next/link'

interface BreadcrumbProps {
  currentPage: string
}

export default function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="hover:text-green-sapin transition-colors"
      >
        Accueil
      </Link>
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-gray-900 font-medium">{currentPage}</span>
    </nav>
  )
}
