'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useContactForm } from '@/hooks/useContactForm'
import { serviceLabels, budgetLabels, timelineLabels } from '@/lib/contact-schema'
import Breadcrumb from '@/components/breadcrumb'
import TurnstileCaptcha from '@/components/turnstile-captcha'
import Honeypot from '@/components/honeypot'

const contactInfo = [
  {
    title: 'Email',
    value: 'raph@monadai.fr',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    link: 'mailto:raph@monadai.fr'
  },
  {
    title: 'Téléphone',
    value: '+33 (0)6 47 24 48 09',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    link: 'tel:+330647244809'
  },
  {
    title: 'Localisation',
    value: 'France',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    link: null
  }
]

export default function ContactPage() {
  const { 
    form, formState, serverMessage, onSubmit, resetForm, isLoading, isSuccess, isError,
    captchaToken, setCaptchaToken, honeypotValue, setHoneypotValue, isCaptchaValid
  } = useContactForm()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Breadcrumb currentPage="Contact" />
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Parlons de votre projet. Devis personnalisé et réponse garantie sous 24h.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Formulaire */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-black mb-6">Démarrons votre projet</h2>
                
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-green-sapin rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-4">Message envoyé !</h3>
                      <p className="text-gray-700 mb-8">{serverMessage}</p>
                      <button
                        onClick={resetForm}
                        className="px-6 py-3 border-2 border-green-sapin text-green-sapin rounded-lg hover:bg-green-sapin hover:text-white transition-all duration-300"
                      >
                        Envoyer un autre message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={onSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Nom complet *
                          </label>
                          <input
                            {...form.register('name')}
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                            placeholder="Votre nom"
                          />
                          {form.formState.errors.name && (
                            <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Email *
                          </label>
                          <input
                            {...form.register('email')}
                            type="email"
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                            placeholder="votre.email@entreprise.fr"
                          />
                          {form.formState.errors.email && (
                            <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Téléphone
                          </label>
                          <input
                            {...form.register('phone')}
                            type="tel"
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                            placeholder="06 47 24 48 09"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-red-600 text-sm mt-1">{form.formState.errors.phone.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Entreprise
                          </label>
                          <input
                            {...form.register('company')}
                            type="text"
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                            placeholder="Nom de votre entreprise"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Service souhaité *
                          </label>
                          <select
                            {...form.register('service')}
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                          >
                            {Object.entries(serviceLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Budget indicatif *
                          </label>
                          <select
                            {...form.register('budget')}
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                          >
                            {Object.entries(budgetLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Délai souhaité *
                          </label>
                          <select
                            {...form.register('timeline')}
                            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200"
                          >
                            {Object.entries(timelineLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Décrivez votre projet *
                        </label>
                        <textarea
                          {...form.register('message')}
                          rows={5}
                          className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-green-sapin focus:outline-none transition-all duration-200 resize-none"
                          placeholder="Décrivez votre projet, vos objectifs, vos contraintes..."
                        />
                        {form.formState.errors.message && (
                          <p className="text-red-600 text-sm mt-1">{form.formState.errors.message.message}</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-start">
                          <input
                            {...form.register('newsletter')}
                            type="checkbox"
                            className="mt-1 mr-3"
                          />
                          <span className="text-sm text-gray-700">
                            J'accepte de recevoir des actualités et conseils sur la transformation digitale
                          </span>
                        </label>

                        <label className="flex items-start">
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
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Informations de contact */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-black mb-8">Informations</h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start">
                      <div className="w-12 h-12 bg-green-sapin rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={info.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">{info.title}</h3>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-gray-700 hover:text-green-sapin transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <span className="text-gray-700">{info.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-black mb-3">Temps de réponse</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Nous nous engageons à répondre à toutes les demandes sous 24h (jours ouvrés).
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Devis simple :</span>
                      <span className="font-medium text-green-sapin">2-6h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analyse détaillée :</span>
                      <span className="font-medium text-green-sapin">24-48h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projet complexe :</span>
                      <span className="font-medium text-green-sapin">48-72h</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/services"
                    className="inline-flex items-center text-green-sapin hover:text-green-sapin-light transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Simuler un devis en ligne
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
