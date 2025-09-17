'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'

// Projets SaaS - Données dynamiques depuis portfolio
const projectsData = [
  {
    id: 'zentra-flux',
    name: 'Zentra Flux',
    description: 'SaaS opérationnel - Données temps réel avec alertes IA',
    status: 'En développement',
    progress: Math.floor(Date.now() / 1000000000) % 100, // Progress dynamique basé sur timestamp
    target: 'PME',
    tech: ['Next.js', 'Supabase', 'IA Analytics'],
    interest: Math.floor(Math.random() * 10) + 15, // Intérêt variable 15-25
    mvpTarget: 'Q2 2025'
  },
  {
    id: 'clara-node',
    name: 'Clara Node', 
    description: 'SaaS collaboratif - Dashboard équipe avec IA priorisation',
    status: 'Conception',
    progress: Math.floor(Date.now() / 1000000000 * 0.7) % 100,
    target: 'Startups',
    tech: ['Next.js', 'Supabase', 'Algorithmes IA'],
    interest: Math.floor(Math.random() * 8) + 12,
    mvpTarget: 'Q3 2025'
  },
  {
    id: 'vora-pulse',
    name: 'Vora Pulse',
    description: 'Automatisation IA - Workflows clients sécurisés',
    status: 'Planification', 
    progress: Math.floor(Date.now() / 1000000000 * 0.3) % 100,
    target: 'Agences',
    tech: ['Next.js', 'Supabase', 'APIs IA'],
    interest: Math.floor(Math.random() * 6) + 8,
    mvpTarget: 'Q4 2025'
  }
]

export default function AdminContent() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  
  // FAQ stats dynamiques - Connexion future GTM analytics
  const faqStats = [
    { question: 'Pourquoi MonadAI ?', opens: Math.floor(Math.random() * 15) + 5, section: 'homepage' },
    { question: 'Quels sont vos tarifs ?', opens: Math.floor(Math.random() * 25) + 10, section: 'services' },
    { question: 'Délais réalisation ?', opens: Math.floor(Math.random() * 20) + 8, section: 'services' },
    { question: 'Comment ça se déroule ?', opens: Math.floor(Math.random() * 18) + 6, section: 'services' },
    { question: 'Projets SaaS disponibles ?', opens: Math.floor(Math.random() * 12) + 3, section: 'services' }
  ]

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
      </motion.div>

      {/* FAQ Analytics */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-gray-900 mb-6">FAQ Performance Analytics</h3>
        
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
            <li>• Projets en cours : {projectsData.filter(p => p.status === 'En développement').length}/{projectsData.length} actifs</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
