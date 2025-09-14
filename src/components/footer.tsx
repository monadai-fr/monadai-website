'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { slideUp, staggerContainer, staggerItem } from '@/lib/motion-variants'

const navigation = {
  main: [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'CGV', href: '/cgv' },
  ]
}

const services = [
  'Développement web',
  'Automatisation IA',
  'Transformation digitale',
  'Audit technique',
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* MonadAI Info */}
          <motion.div variants={staggerItem}>
            <h3 className="text-2xl font-bold text-green-sapin mb-4">MonadAI</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Solutions digitales sur mesure pour entreprises et particuliers. 
              Développement web et automatisation IA depuis la France.
            </p>
          </motion.div>

          {/* Services */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Nos Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-600 hover:text-green-sapin transition-colors cursor-default">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-gray-600 hover:text-green-sapin transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>raph@monadai.fr</p>
              <p>+33 (0)6 47 24 48 09</p>
              <p className="pt-2 flex items-center">
                France 
                <svg className="inline w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="0" y="0" width="8" height="24" fill="#003d82"/>
                  <rect x="8" y="0" width="8" height="24" fill="#ffffff"/>
                  <rect x="16" y="0" width="8" height="24" fill="#dc143c"/>
                </svg>
              </p>
            </div>
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-green-sapin text-white text-sm font-medium rounded-md hover:bg-green-sapin-light transition-colors"
              >
                Démarrer un projet
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <motion.div 
          className="border-t border-gray-200 py-6"
          {...slideUp}
          transition={{ delay: 0.4 }}
        >
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-green-sapin transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 md:order-1 md:mt-0">
              <p className="text-sm text-gray-500">
                &copy; {currentYear} MonadAI. Tous droits réservés. 
                Développé avec 
                <svg className="inline w-4 h-4 mx-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                en France.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
