'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'

// Projets SaaS - Section désactivée en attente de vraies données
// TODO: Connecter à table Supabase 'projects' quand elle existera
const projectsData: any[] = []

export default function AdminContent() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  
  // FAQ stats - En attente connexion GTM analytics réelle  
  // TODO: Remplacer par vraies données GTM quand webhook configuré
  const faqStats: any[] = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En développement': return 'bg-green-100 text-green-700'
      case 'Conception': return 'bg-blue-100 text-blue-700'
      case 'Planification': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600">Gestion projets SaaS & contenu MonadAI</p>
      </div>

      {/* Projets SaaS Dashboard */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={staggerItem} className="font-semibold text-gray-900 mb-6">
          Projets SaaS Portfolio
        </motion.h2>

        {projectsData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
            <motion.div
              key={project.id}
              variants={staggerItem}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedProject === project.id 
                  ? 'border-green-sapin bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Progression</span>
                  <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-green-sapin h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Cible:</span>
                  <span className="font-medium">{project.target}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intérêt:</span>
                  <span className="font-medium">{project.interest} clics/sem</span>
                </div>
                <div className="flex justify-between">
                  <span>MVP Target:</span>
                  <span className="font-medium">{project.mvpTarget}</span>
                </div>
              </div>

              {/* Détails expandés */}
              {selectedProject === project.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <h5 className="font-medium text-gray-900 mb-2">Stack Technique</h5>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <motion.button
                    className="mt-3 w-full bg-green-sapin text-white py-2 rounded-lg text-sm font-medium hover:bg-green-sapin-light transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Mettre à jour statut
                  </motion.button>
                </motion.div>
              )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Projets SaaS</h3>
            <p className="text-gray-600 mb-4">Les données projets seront disponibles après création de la table Supabase.</p>
            <p className="text-sm text-gray-500">En attente de connexion données réelles.</p>
          </div>
        )}
      </motion.div>

      {/* FAQ Analytics */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-900 mb-6">FAQ Performance Analytics</h3>
        
        {faqStats.length > 0 ? (
          <div className="space-y-4">
            {faqStats.map((faq, index) => (
            <div key={faq.question} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{faq.question}</p>
                <p className="text-sm text-gray-600">Section: {faq.section}</p>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-green-600">{faq.opens}</p>
                <p className="text-xs text-gray-500">ouvertures</p>
              </div>
              
              <div className="ml-4 w-20 bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-green-sapin h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((faq.opens / Math.max(...faqStats.map(f => f.opens))) * 100, 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">💡 Content Insights Auto-générés</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• FAQ la plus populaire : {faqStats.reduce((prev, current) => (prev.opens > current.opens) ? prev : current).question}</li>
              <li>• Total ouvertures FAQ : {faqStats.reduce((sum, faq) => sum + faq.opens, 0)} cette période</li>
              <li>• Engagement moyen : {Math.round(faqStats.reduce((sum, faq) => sum + faq.opens, 0) / faqStats.length)} ouv./question</li>
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">FAQ Analytics</h3>
            <p className="text-gray-600 mb-4">Les statistiques FAQ seront disponibles après connexion GTM analytics.</p>
            <p className="text-sm text-gray-500">En attente de webhook GTM configuré.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
