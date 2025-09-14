'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import Breadcrumb from '@/components/breadcrumb'

const expertise = [
  { name: 'Cybersécurité', level: 85, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { name: 'Pentest', level: 78, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'DevSecOps', level: 82, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
]

const values = [
  {
    title: 'Innovation',
    description: 'Technologies de pointe au service de solutions concrètes',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  {
    title: 'Accessibilité',
    description: 'Expertise technique rendue simple et compréhensible',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
  },
  {
    title: 'Excellence',
    description: 'Standards de qualité élevés pour chaque livrable',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Breadcrumb currentPage="À propos" />
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-8">
              À propos de MonadAI
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              L'histoire d'une passion pour la technologie transformée en expertise 
              au service des entreprises innovantes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio Raphael */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-green-sapin to-green-sapin-light rounded-3xl flex items-center justify-center shadow-2xl">
                <svg className="w-40 h-40 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl font-bold text-black mb-6">Raphael</h2>
              <h3 className="text-xl text-green-sapin font-semibold mb-6">Fondateur & Lead Developer</h3>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Étudiant en 2ème année de cybersécurité sur un cursus 5 ans jusqu'au master, 
                  Raphael se spécialise dans le pentest et DevSecOps.
                </p>
                <p>
                  À 18 ans, il fonde MonadAI avec la vision de rendre l'expertise technique 
                  accessible aux PME innovantes. Sa passion pour la sécurité informatique 
                  et le développement web se traduit par des solutions robustes et performantes.
                </p>
                <p>
                  Entre études approfondies en cybersécurité et projets clients, 
                  Raphael incarne une nouvelle génération de développeurs : 
                  technique, créatif et orienté résultats.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {expertise.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-sapin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={skill.icon} />
                        </svg>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-green-sapin to-green-sapin-light h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={staggerItem}
              className="text-4xl font-bold text-black mb-12"
            >
              Notre Vision
            </motion.h2>
            
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={staggerItem}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-green-sapin rounded-xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-green-sapin text-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Collaborons ensemble</h2>
            <p className="text-xl opacity-90 mb-8">
              Votre projet mérite une approche personnalisée et des solutions sur mesure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-white text-green-sapin px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contactez-nous
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-sapin transition-all duration-300"
                >
                  Voir nos réalisations
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
