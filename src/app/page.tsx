'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeIn, slideUp, staggerContainer, staggerItem, scaleIn } from '@/lib/motion-variants'
import { useContactForm } from '@/hooks/useContactForm'
import { serviceLabels } from '@/lib/contact-schema'
import FAQ from '@/components/faq'
import { useDynamicFAQ } from '@/hooks/use-dynamic-faq'
import { usePublicProjects } from '@/hooks/use-public-projects'
import TurnstileCaptcha from '@/components/turnstile-captcha'
import Honeypot from '@/components/honeypot'

const services = [
  {
    title: 'Développement Web',
    description: 'Sites vitrines et e-commerce performants, conçus pour convertir vos visiteurs en clients.',
    icon: (
      <svg className="w-12 h-12 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    features: ['Responsive Design', 'SEO Optimisé', 'Performance A+']
  },
  {
    title: 'Automatisation IA',
    description: 'Chatbots intelligents et scripts d\'automatisation pour optimiser vos processus métier.',
    icon: (
      <svg className="w-12 h-12 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    features: ['Chatbots Personnalisés', 'Scripts Automation', 'API Intégrations']
  },
  {
    title: 'Transformation Digitale',
    description: 'Audit technique complet et implémentation de solutions digitales sur mesure.',
    icon: (
      <svg className="w-12 h-12 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: ['Audit Technique', 'Stratégie Digitale', 'Formation Équipe']
  }
]

export default function Home() {
  const { 
    form, onSubmit, isLoading, isSuccess, isError, serverMessage, resetForm,
    captchaToken, setCaptchaToken, honeypotValue, setHoneypotValue, isCaptchaValid
  } = useContactForm()

  // FAQ dynamique depuis Supabase
  const { faqItems: dynamicFAQ, loading: faqLoading } = useDynamicFAQ('homepage')
  
  // Projets dynamiques depuis Supabase pour section Portfolio
  const { projects: dynamicProjects, loading: projectsLoading } = usePublicProjects()

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
        <Image
            src="/images/background.webp"
            alt="Paysage montagneux avec lac - MonadAI"
            fill
            className="object-cover object-center"
            priority
            quality={90}
            sizes="100vw"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.h1 
              variants={staggerItem}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >
              <span className="block">MonadAI</span>
              <span className="block text-green-sapin">Développement Web</span>
              <span className="block text-2xl md:text-4xl lg:text-5xl font-medium text-gray-700">
                & IA pour tous vos projets
              </span>
            </motion.h1>

            <motion.p 
              variants={staggerItem}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Solutions digitales sur mesure pour propulser vos projets vers l'avenir. 
              Développement web et IA adaptés à vos besoins, créés en France avec expertise et passion.
            </motion.p>

            <motion.div 
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="#contact"
                  className="inline-flex items-center px-8 py-4 bg-green-sapin text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-sapin-light transition-all duration-300 hover:shadow-xl"
                >
                  Démarrer un projet
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="#services"
                  className="inline-flex items-center px-8 py-4 border-2 border-green-sapin text-green-sapin text-lg font-semibold rounded-lg hover:bg-green-sapin hover:text-white transition-all duration-300"
                >
                  Découvrir nos services
                </a>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-2">Explorez nos expertises</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-6 h-6 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Teaser Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            {...slideUp}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Expertises
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions technologiques sur mesure pour entreprises et particuliers
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={staggerItem}
                className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-sapin/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-sapin mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            {...scaleIn}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center px-6 py-3 bg-green-sapin text-white font-semibold rounded-lg hover:bg-green-sapin-light transition-colors duration-300"
              >
                Voir tous nos services
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services#faq"
                className="inline-flex items-center px-6 py-3 border-2 border-green-sapin text-green-sapin font-semibold rounded-lg hover:bg-green-sapin hover:text-white transition-colors duration-300"
              >
                Questions fréquentes
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Projets en développement
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Innovations SaaS en cours de création pour révolutionner votre quotidien professionnel
            </p>
          </motion.div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {dynamicProjects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className={`h-48 bg-gradient-to-br from-${project.gradient_from} to-${project.gradient_to} rounded-lg mb-6 flex items-center justify-center`}>
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">{project.title}</h3>
                  <p className="text-green-sapin font-medium mb-3">{project.category}</p>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="text-sm text-gray-500">{project.tech_stack.join(' • ')}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 bg-green-sapin text-white font-semibold rounded-lg hover:bg-green-sapin-light transition-colors duration-300"
            >
              Découvrir nos projets
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square bg-gradient-to-br from-green-sapin to-green-sapin-light rounded-2xl flex items-center justify-center">
                <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                À propos de MonadAI
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Fondée en 2025 par <span className="font-semibold text-green-sapin">Raphael</span>, 
                  étudiant en cybersécurité passionné par l'innovation digitale.
                </p>
                <p>
                  MonadAI naît de la conviction qu'expertise technique et accessibilité peuvent coexister. 
                  Spécialisé en pentest, DevSecOps et développement web, nous accompagnons entreprises et particuliers 
                  dans leur transformation digitale avec des solutions sur mesure.
                </p>
                <p>
                  Notre mission : démocratiser l'accès aux technologies avancées pour tous types de projets, 
                  qu'ils soient professionnels ou personnels.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-sapin mb-1">2025</div>
                  <div className="text-sm text-gray-600">Fondation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-sapin mb-1">100%</div>
                  <div className="text-sm text-gray-600">Made in France</div>
                </div>
              </div>

              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/a-propos"
                  className="inline-flex items-center px-6 py-3 border-2 border-green-sapin text-green-sapin font-semibold rounded-lg hover:bg-green-sapin hover:text-white transition-all duration-300"
                >
                  En savoir plus
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section Homepage */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!faqLoading && (
            <FAQ 
              items={dynamicFAQ} 
              title="Pourquoi MonadAI ?" 
              className="max-w-5xl mx-auto"
              section="homepage"
            />
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Contactez-nous
            </h2>
            <p className="text-xl text-gray-700">
              Parlons de votre projet. Réponse garantie sous 24h.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-sapin rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Message envoyé !</h3>
                <p className="text-gray-700 mb-6">{serverMessage}</p>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-green-sapin text-green-sapin rounded-lg hover:bg-green-sapin hover:text-white transition-all duration-300"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    Nom complet
                  </label>
                  <input
                    {...form.register('name')}
                    type="text"
                    id="name"
                    className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                    placeholder="Votre nom"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    {...form.register('email')}
                    type="email"
                    id="email"
                    className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                    placeholder="votre.email@entreprise.fr"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-black mb-2">
                  Service souhaité
                </label>
                <select
                  {...form.register('service')}
                  id="service"
                  className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                >
                  <option value="">Sélectionnez un service</option>
                  {Object.entries(serviceLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {form.formState.errors.service && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.service.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message
                </label>
                <textarea
                  {...form.register('message')}
                  id="message"
                  rows={4}
                  className="block w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200 resize-none"
                  placeholder="Décrivez votre projet..."
                />
                {form.formState.errors.message && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-start mb-4">
                  <input
                    {...form.register('consent')}
                    type="checkbox"
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    J'accepte le traitement de mes données selon la{' '}
                    <Link href="/confidentialite" className="text-green-sapin hover:underline">
                      politique de confidentialité
                    </Link>{' '}*
                  </span>
                </label>
                {form.formState.errors.consent && (
                  <p className="text-red-600 text-sm">{form.formState.errors.consent.message}</p>
                )}
              </div>

              {/* Honeypot - Protection anti-bot */}
              <Honeypot 
                value={honeypotValue}
                onChange={setHoneypotValue}
              />

              {/* CAPTCHA Turnstile */}
              <div>
                <TurnstileCaptcha 
                  onVerify={setCaptchaToken}
                  onError={() => setCaptchaToken('')}
                  theme="light"
                />
              </div>

              {isError && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-50 border-2 border-red-300 rounded-lg"
                >
                  <p className="text-red-600 font-medium text-sm">{serverMessage}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !isCaptchaValid}
                className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  (isLoading || !isCaptchaValid)
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-green-sapin text-white hover:bg-green-sapin-light shadow-lg hover:shadow-xl'
                }`}
                whileHover={(!isLoading && isCaptchaValid) ? { scale: 1.02 } : {}}
                whileTap={(!isLoading && isCaptchaValid) ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Envoi en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Envoyer le message
                    <svg className="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                )}
              </motion.button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-green-sapin font-semibold">Email</div>
                <div className="text-gray-600">raph@monadai.fr</div>
              </div>
              <div>
                <div className="text-green-sapin font-semibold">Téléphone</div>
                <div className="text-gray-600">+33 (0)6 47 24 48 09</div>
              </div>
              <div>
                <div className="text-green-sapin font-semibold">Localisation</div>
                <div className="text-gray-600">France</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="text-green-sapin hover:text-green-sapin-light transition-colors"
            >
              Besoin de plus d'options ? Voir la page contact complète →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-green-sapin text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-sapin-dark to-green-sapin opacity-90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 lg:px-8">
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Obtenez un devis gratuit et personnalisé sous 24h. 
              Parlons de votre projet et définissons ensemble la meilleure stratégie digitale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-green-sapin text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Demander un devis
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="tel:+330647244809"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-green-sapin transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler maintenant
                </Link>
              </motion.div>
            </div>
          </motion.div>
    </div>
      </section>
    </>
  )
}
