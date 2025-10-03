'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useCMSProjects, type ProjectFormData } from '@/hooks/use-cms-projects'
import { useCMSFAQ, type FAQFormData } from '@/hooks/use-cms-faq'
import { useCMSEmailTemplates, type EmailTemplateFormData } from '@/hooks/use-cms-email-templates'
import ImageUpload from '@/components/admin/image-upload'
import CreateProjectModal from '@/components/admin/create-project-modal'
import CreateFAQModal from '@/components/admin/create-faq-modal'
import CreateTemplateModal from '@/components/admin/create-template-modal'
import EditFAQModal from '@/components/admin/edit-faq-modal'
import EditTemplateModal from '@/components/admin/edit-template-modal'
import Image from 'next/image'

type TabType = 'projects' | 'faq' | 'templates'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<TabType>('projects')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [editingProjectData, setEditingProjectData] = useState<ProjectFormData | null>(null)
  
  // États modales création
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isCreatingFAQ, setIsCreatingFAQ] = useState(false)
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  
  // États modales édition
  const [editingFAQ, setEditingFAQ] = useState<{ isOpen: boolean; faq: any }>({ isOpen: false, faq: null })
  const [editingTemplate, setEditingTemplate] = useState<{ isOpen: boolean; template: any }>({ isOpen: false, template: null })

  // Hooks CMS
  const { 
    projects, 
    loading: projectsLoading, 
    createProject, 
    updateProject, 
    deleteProject, 
    toggleVisibility 
  } = useCMSProjects()
  
  const { 
    faqItems, 
    loading: faqLoading, 
    getFAQStats,
    createFAQ,
    updateFAQ,
    deleteFAQ 
  } = useCMSFAQ()
  
  const { 
    templates, 
    loading: templatesLoading,
    activeTemplates,
    createTemplate,
    deleteTemplate
  } = useCMSEmailTemplates()

  const tabs = [
    { 
      id: 'projects' as TabType, 
      name: 'Projets SaaS', 
      count: projects.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      id: 'faq' as TabType, 
      name: 'FAQ Manager', 
      count: faqItems.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'templates' as TabType, 
      name: 'Email Templates', 
      count: activeTemplates.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En développement': return 'bg-green-100 text-green-700'
      case 'Conception': return 'bg-blue-100 text-blue-700'
      case 'Planification': return 'bg-gray-100 text-gray-700'
      case 'Lancé': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // ================================
  // HANDLERS PROJETS - TOUS FONCTIONNELS
  // ================================

  const handleQuickEdit = (project: any) => {
    setEditingProjectData({
      title: project.title,
      category: project.category,
      description: project.description,
      status: project.status,
      progress: project.progress,
      tech_stack: project.tech_stack,
      target_audience: project.target_audience || '',
      focus_area: project.focus_area || ''
    })
    setSelectedProject(project.id)
    setIsEditingProject(true)
  }

  const handleImageUploaded = async (imageUrl: string) => {
    if (!selectedProject) return
    
    const success = await updateProject(selectedProject, { image_url: imageUrl } as any)
    if (success) {
      // Le projet sera mis à jour automatiquement via le hook
    }
  }

  const handleImageRemoved = async () => {
    if (!selectedProject) return
    
    const success = await updateProject(selectedProject, { image_url: null } as any)
    if (success) {
      // Le projet sera mis à jour automatiquement via le hook
    }
  }

  const handleSaveProject = async () => {
    if (!selectedProject || !editingProjectData) return
    
    const success = await updateProject(selectedProject, editingProjectData)
    if (success) {
      setIsEditingProject(false)
      setSelectedProject(null)
      setEditingProjectData(null)
    }
  }

  // ================================
  // HANDLERS FAQ - COMPLETS
  // ================================

  const handleEditFAQ = (faq: any) => {
    setEditingFAQ({ isOpen: true, faq })
  }

  const handleDeleteFAQ = async (faqId: string, faqQuestion: string) => {
    if (window.confirm(`Supprimer la FAQ "${faqQuestion}" ?`)) {
      const success = await deleteFAQ(faqId)
      if (!success) {
        alert('Erreur lors de la suppression de la FAQ')
      }
    }
  }

  // ================================
  // HANDLERS TEMPLATES - COMPLETS
  // ================================

  const handleEditTemplate = (template: any) => {
    setEditingTemplate({ isOpen: true, template })
  }

  const handleDeleteTemplate = async (templateId: string, templateName: string) => {
    if (window.confirm(`Supprimer le template "${templateName}" ?`)) {
      const success = await deleteTemplate(templateId)
      if (!success) {
        alert('Erreur lors de la suppression du template')
      }
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600">Gestion dynamique du contenu MonadAI</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-sapin text-green-sapin'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activeTab === tab.id 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Projets SaaS Dashboard */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.h2 variants={staggerItem} className="font-semibold text-gray-900">
                  Projets SaaS Portfolio
                </motion.h2>
                <motion.button
                  variants={staggerItem}
                  onClick={() => setIsCreatingProject(true)}
                  className="bg-green-sapin text-white px-4 py-2 rounded-lg font-medium hover:bg-green-sapin-light transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  + Nouveau Projet
                </motion.button>
              </div>

              {projectsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
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
                      {/* Image du projet */}
                      {project.image_url ? (
                        <div className="h-32 rounded-lg mb-4 overflow-hidden relative">
                          <Image 
                            src={project.image_url} 
                            alt={`${project.title} - ${project.category}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs">Aucune image</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{project.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          {!project.is_visible && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Masqué
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

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

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tech_stack.map((tech) => (
                          <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Quick Actions - TOUS FONCTIONNELS */}
                      {selectedProject === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200 space-y-2"
                        >
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickEdit(project)
                              }}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </motion.button>
                            
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleVisibility(project.id)
                              }}
                              className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center ${
                                project.is_visible 
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                  : 'bg-green-sapin text-white hover:bg-green-sapin-light'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {project.is_visible ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                )}
                              </svg>
                              {project.is_visible ? 'Masquer' : 'Afficher'}
                            </motion.button>

                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm(`Supprimer "${project.title}" ?`)) {
                                  deleteProject(project.id)
                                }
                              }}
                              className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </motion.button>
                          </div>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
                  <p className="text-gray-600 mb-4">Ajoutez vos premiers projets SaaS pour commencer.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* FAQ Analytics */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">FAQ Analytics & Management</h3>
                <button 
                  onClick={() => setIsCreatingFAQ(true)}
                  className="bg-green-sapin text-white px-4 py-2 rounded-lg font-medium hover:bg-green-sapin-light transition-colors"
                >
                  + Nouvelle FAQ
                </button>
              </div>
              
              {!faqLoading && faqItems.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {(() => {
                      const stats = getFAQStats()
                      return [
                        { label: 'Total FAQ', value: stats.total, color: 'bg-gray-50' },
                        { label: 'Homepage', value: stats.bySection.homepage || 0, color: 'bg-blue-50' },
                        { label: 'Services', value: stats.bySection.services || 0, color: 'bg-green-50' },
                        { label: 'Clics Total', value: stats.totalClicks, color: 'bg-purple-50' }
                      ]
                    })().map((stat, index) => (
                      <div key={stat.label} className={`text-center p-4 ${stat.color} rounded-lg`}>
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {faqItems.slice(0, 8).map((faq) => (
                      <div key={faq.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 line-clamp-1">{faq.question}</p>
                          <p className="text-sm text-gray-600">Section: {faq.section} • Clics: {faq.click_count}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            faq.section === 'homepage' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {faq.section}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditFAQ(faq)
                            }}
                            className="text-gray-600 hover:text-green-sapin p-1"
                            title="Modifier FAQ"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFAQ(faq.id, faq.question)
                            }}
                            className="text-gray-600 hover:text-red-600 p-1"
                            title="Supprimer FAQ"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">FAQ Management</h3>
                  <p className="text-gray-600 mb-4">Gérez vos questions fréquentes dynamiquement.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Email Templates */}
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Templates Email</h3>
                <button 
                  onClick={() => setIsCreatingTemplate(true)}
                  className="bg-green-sapin text-white px-4 py-2 rounded-lg font-medium hover:bg-green-sapin-light transition-colors"
                >
                  + Nouveau Template
                </button>
              </div>
              
              {!templatesLoading && templates.length > 0 ? (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.type === 'follow_up' ? 'bg-blue-100 text-blue-700' :
                            template.type === 'quote_reminder' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {template.type}
                          </span>
                          {!template.is_active && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Inactif
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {template.usage_count} utilisations
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTemplate(template)
                            }}
                            className="text-gray-600 hover:text-green-sapin p-1"
                            title="Modifier template"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTemplate(template.id, template.name)
                            }}
                            className="text-gray-600 hover:text-red-600 p-1"
                            title="Supprimer template"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Objet:</strong> {template.subject}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <span key={variable} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Email Templates</h3>
                  <p className="text-gray-600 mb-4">Créez des templates email réutilisables.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Quick Edit Project - ENTIÈREMENT FONCTIONNEL */}
      <AnimatePresence>
        {isEditingProject && editingProjectData && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProject(false)}
            />
            
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Modifier Projet</h3>
                    <button
                      onClick={() => setIsEditingProject(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Upload Image - FONCTIONNEL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Image du projet</label>
                    <ImageUpload 
                      currentImageUrl={projects.find(p => p.id === selectedProject)?.image_url}
                      projectSlug={projects.find(p => p.id === selectedProject)?.slug || 'projet'}
                      onImageUploaded={handleImageUploaded}
                      onImageRemoved={handleImageRemoved}
                    />
                  </div>

                  {/* Form de modification - ENTIÈREMENT FONCTIONNEL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                      <input
                        type="text"
                        value={editingProjectData.title}
                        onChange={(e) => setEditingProjectData(prev => prev ? {...prev, title: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <select
                        value={editingProjectData.status}
                        onChange={(e) => setEditingProjectData(prev => prev ? {...prev, status: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                      >
                        <option value="En développement">En développement</option>
                        <option value="Conception">Conception</option>
                        <option value="Planification">Planification</option>
                        <option value="Lancé">Lancé</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progression ({editingProjectData.progress}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingProjectData.progress}
                      onChange={(e) => setEditingProjectData(prev => prev ? {...prev, progress: parseInt(e.target.value)} : null)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingProjectData.description}
                      onChange={(e) => setEditingProjectData(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cible</label>
                      <input
                        type="text"
                        value={editingProjectData.target_audience}
                        onChange={(e) => setEditingProjectData(prev => prev ? {...prev, target_audience: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                        placeholder="Entreprises, Startups, Agences..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                      <input
                        type="text"
                        value={editingProjectData.focus_area}
                        onChange={(e) => setEditingProjectData(prev => prev ? {...prev, focus_area: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-sapin focus:outline-none"
                        placeholder="IA Analytics, Cybersécurité..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditingProject(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <motion.button
                      onClick={handleSaveProject}
                      className="px-4 py-2 bg-green-sapin text-white rounded-lg hover:bg-green-sapin-light transition-colors flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Sauvegarder
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modales Création */}
      <CreateProjectModal 
        isOpen={isCreatingProject}
        onClose={() => setIsCreatingProject(false)}
        onSubmit={createProject}
      />

      <CreateFAQModal 
        isOpen={isCreatingFAQ}
        onClose={() => setIsCreatingFAQ(false)}
        onSubmit={createFAQ}
      />

      <CreateTemplateModal 
        isOpen={isCreatingTemplate}
        onClose={() => setIsCreatingTemplate(false)}
        onSubmit={createTemplate}
      />

      {/* Modales Édition */}
      {editingFAQ.isOpen && editingFAQ.faq && (
        <EditFAQModal
          isOpen={editingFAQ.isOpen}
          onClose={() => setEditingFAQ({ isOpen: false, faq: null })}
          faq={editingFAQ.faq}
          onSuccess={() => {
            setEditingFAQ({ isOpen: false, faq: null })
            // Le hook se rafraîchit automatiquement
          }}
        />
      )}

      {editingTemplate.isOpen && editingTemplate.template && (
        <EditTemplateModal
          isOpen={editingTemplate.isOpen}
          onClose={() => setEditingTemplate({ isOpen: false, template: null })}
          template={editingTemplate.template}
          onSuccess={() => {
            setEditingTemplate({ isOpen: false, template: null })
            // Le hook se rafraîchit automatiquement
          }}
        />
      )}
    </div>
  )
}