'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import Breadcrumb from '@/components/breadcrumb'

const projects = [
  {
    id: 'zentra-flux',
    title: 'Zentra Flux',
    category: 'SaaS Opérationnel',
    description: 'Plateforme SaaS qui centralise les données opérationnelles en temps réel avec alertes IA sur les goulots d\'étranglement',
    metrics: { status: 'En développement', tech: 'Next.js', focus: 'IA Analytics' },
    stack: ['Next.js', 'Supabase', 'IA Analytics'],
    gradient: 'from-green-600 to-green-400'
  },
  {
    id: 'clara-node',
    title: 'Clara Node',
    category: 'SaaS Collaboratif',
    description: 'SaaS qui agrège les retours d\'équipe en dashboard interactif avec IA pour prioriser les tâches et détecter les frictions',
    metrics: { status: 'En développement', target: 'Startups', focus: 'Collaboration IA' },
    stack: ['Next.js', 'Supabase', 'Algorithmes IA'],
    gradient: 'from-gray-700 to-gray-500'
  },
  {
    id: 'vora-pulse',
    title: 'Vora Pulse',
    category: 'Automatisation IA',
    description: 'Solution d\'automatisation IA pour workflows clients : emails, suivis automatiques et rapports avec sécurité renforcée',
    metrics: { status: 'En développement', focus: 'Cybersécurité', target: 'Agences' },
    stack: ['Next.js', 'Supabase', 'APIs IA'],
    gradient: 'from-green-700 to-green-500'
  }
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Breadcrumb currentPage="Projets en développement" />
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Projets en développement
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Innovations SaaS en cours de création. 
              Chaque projet vise à résoudre des défis concrets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-24"
          >
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                variants={staggerItem}
                className="group"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-5 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  
                  {/* Visuel */}
                  <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:col-start-3' : ''}`}>
                    <motion.div
                      className="relative group-hover:scale-[1.02] transition-transform duration-700"
                    >
                      <div className="aspect-[16/10] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className={`h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                          <div className="text-center text-white p-8">
                            <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                            <p className="text-lg opacity-90">{project.category}</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <svg className="w-8 h-8 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Contenu */}
                  <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="space-y-6">
                      <div>
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent text-sm font-medium border border-gray-200 rounded-full mb-4`}>
                          {project.category}
                        </span>
                        <h2 className="text-3xl font-bold text-black mb-3">{project.title}</h2>
                        <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <span key={key} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            <span className="text-xs text-gray-500 mr-1 capitalize">{key}:</span>
                            <span className="font-medium text-green-sapin">{value}</span>
                          </span>
                        ))}
                      </div>

                      <div>
                        <div className="text-sm text-gray-500 mb-2">Stack technique :</div>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
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
            <h2 className="text-3xl font-bold mb-6">Votre projet, notre expertise</h2>
            <p className="text-xl opacity-90 mb-8">Créons ensemble votre prochaine réussite digitale</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-green-sapin px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Démarrer un projet
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
