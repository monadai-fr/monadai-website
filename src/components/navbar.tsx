'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeIn, slideInLeft } from '@/lib/motion-variants'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '#services', detailPage: '/services' },
  { name: 'Portfolio', href: '#portfolio', detailPage: '/portfolio' },
  { name: 'À propos', href: '#about', detailPage: '/a-propos' },
  { name: 'Contact', href: '#contact', detailPage: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header 
      className="bg-white/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex lg:flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/monadai-logo.webp"
                alt="MonadAI - Développement Web & IA"
                width={140}
                height={45}
                className="h-10 w-auto drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
                priority
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 0 1px rgba(255, 255, 255, 0.8))' }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a
                  href={item.href}
                  className="text-sm font-medium leading-6 text-gray-900 hover:text-green-sapin transition-colors duration-200"
                >
                  {item.name}
                </a>
              </motion.div>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center rounded-md bg-green-sapin px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-sapin-light transition-colors duration-200 hover:scale-105 transform"
              >
                Devis gratuit
              </a>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div 
            className="lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 pb-3 pt-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-green-sapin transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <a
                  href="#contact"
                  className="block rounded-md bg-green-sapin px-3 py-2 text-base font-medium text-white hover:bg-green-sapin-light transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Devis gratuit
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}
