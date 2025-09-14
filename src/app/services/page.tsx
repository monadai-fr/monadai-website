'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { slideUp, staggerContainer, staggerItem, fadeIn } from '@/lib/motion-variants'
import { DevisModalLazy } from '@/lib/performance-utils'
import Breadcrumb from '@/components/breadcrumb'
import FAQ from '@/components/faq'
import { faqData } from '@/lib/faq-data'

const services = [
  {
    id: 'web',
    title: 'Développement Web',
    subtitle: 'Sites vitrines et e-commerce performants',
    description: 'Création de sites web modernes, responsives et optimisés pour la conversion. De la vitrine corporate à la boutique e-commerce complète, nous développons des solutions web qui génèrent des résultats.',
    features: [
      'Design responsive mobile-first',
      'Optimisation SEO intégrée',
      'Performance web optimale (Core Web Vitals)',
      'Système de gestion de contenu',
      'Intégrations e-commerce (Stripe, PayPal)',
      'Analytics et suivi de conversion'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Vercel'],
    pricing: 'À partir de 2 500€',
    icon: (
      <svg className="w-16 h-16 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    examples: ['Site vitrine corporate', 'Boutique e-commerce', 'Landing page conversion', 'Portail client/admin']
  },
  {
    id: 'ia',
    title: 'Automatisation IA',
    subtitle: 'Chatbots intelligents et scripts d\'automatisation',
    description: 'Implémentation de solutions d\'intelligence artificielle pour automatiser vos processus métier. Chatbots conversationnels, scripts d\'automatisation et intégrations API pour optimiser votre productivité.',
    features: [
      'Chatbots conversationnels avancés',
      'Automatisation de tâches répétitives',
      'Intégrations API multi-plateformes',
      'Traitement de données automatisé',
      'Workflows intelligents personnalisés',
      'Formation et maintenance incluses'
    ],
    technologies: ['OpenAI GPT', 'Python', 'Node.js', 'Zapier', 'APIs REST'],
    pricing: 'À partir de 3 000€',
    icon: (
      <svg className="w-16 h-16 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    examples: ['Chatbot support client', 'Automatisation marketing', 'Scripts de données', 'Assistant virtuel interne']
  },
  {
    id: 'transformation',
    title: 'Transformation Digitale',
    subtitle: 'Audit technique et stratégie digitale',
    description: 'Accompagnement complet dans votre transformation digitale. Audit de l\'existant, définition de la stratégie digitale et mise en place d\'outils modernes pour accélérer votre croissance.',
    features: [
      'Audit technique complet',
      'Stratégie digitale personnalisée',
      'Optimisation des processus existants',
      'Formation des équipes',
      'Mise en place d\'outils collaboratifs',
      'Suivi et accompagnement long terme'
    ],
    technologies: ['Analysis Tools', 'Project Management', 'Cloud Solutions', 'Security Audit'],
    pricing: 'À partir de 2 000€',
    icon: (
      <svg className="w-16 h-16 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    examples: ['Audit sécurité IT', 'Migration cloud', 'Optimisation workflow', 'Formation équipe tech']
  }
]

export default function ServicesPage() {
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Breadcrumb currentPage="Services" />
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nos Services
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Solutions digitales sur mesure pour accompagner la croissance de votre entreprise. 
                De l'idée à la mise en production, nous transformons vos projets en succès.
              </p>
              <motion.button
                onClick={() => setIsDevisModalOpen(true)}
                className="inline-flex items-center bg-green-sapin text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-sapin-light transition-all duration-300 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Simuler un devis
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Services détaillés */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-24"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={staggerItem}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Contenu */}
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="mb-6">{service.icon}</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h2>
                    <h3 className="text-xl text-green-sapin font-semibold mb-4">{service.subtitle}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Fonctionnalités incluses :</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="w-5 h-5 text-green-sapin mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="text-2xl font-bold text-green-sapin">{service.pricing}</div>
                      <motion.button
                        onClick={() => setIsDevisModalOpen(true)}
                        className="bg-green-sapin text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-sapin-light transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Obtenir un devis
                      </motion.button>
                    </div>
                  </div>

                  {/* Détails techniques */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="bg-gray-50 rounded-xl p-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Technologies utilisées :</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-3">Exemples de projets :</h4>
                      <ul className="space-y-2">
                        {service.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-green-sapin rounded-full mr-3 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section FAQ */}
        <section id="faq" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <FAQ items={faqData} section="services" />
          </div>
        </section>

        {/* Section CTA */}
        <section className="py-24 bg-green-sapin text-white">
          <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Un projet en tête ?
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Discutons de votre projet et définissons ensemble la meilleure solution pour votre entreprise. 
                Devis gratuit et personnalisé sous 24h.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => setIsDevisModalOpen(true)}
                  className="inline-flex items-center bg-white text-green-sapin px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Simuler mon devis
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-sapin transition-all duration-300"
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Nous contacter
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modal de devis */}
      <DevisModalLazy 
        isOpen={isDevisModalOpen} 
        onClose={() => setIsDevisModalOpen(false)} 
      />
    </>
  )
}

