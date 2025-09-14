'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Responsable du traitement</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>Responsable :</strong> Raphael LOTTE, MonadAI<br/>
                  <strong>Contact :</strong> raph@monadai.fr<br/>
                  <strong>SIREN :</strong> 991054958
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Données personnelles collectées</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-sapin">Formulaires de contact</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Identité : nom, prénom</li>
                  <li>Contact : email, téléphone</li>
                  <li>Entreprise : nom, secteur d'activité</li>
                  <li>Projet : description, budget, délai</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-green-sapin">Données de navigation</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Adresse IP anonymisée</li>
                  <li>Type de navigateur</li>
                  <li>Pages consultées</li>
                  <li>Durée de visite</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. Finalités et bases légales</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Traitement des demandes</h4>
                  <p className="text-gray-700 text-sm"><strong>Base :</strong> Intérêt légitime</p>
                  <p className="text-gray-700 text-sm"><strong>Finalité :</strong> Répondre aux demandes de devis</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Newsletter</h4>
                  <p className="text-gray-700 text-sm"><strong>Base :</strong> Consentement explicite</p>
                  <p className="text-gray-700 text-sm"><strong>Finalité :</strong> Envoi d'actualités tech</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                  <p className="text-gray-700 text-sm"><strong>Base :</strong> Intérêt légitime</p>
                  <p className="text-gray-700 text-sm"><strong>Finalité :</strong> Amélioration du site</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. Durée de conservation</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <div className="space-y-2 text-gray-700">
                  <p><strong>Prospects non convertis :</strong> 2 ans</p>
                  <p><strong>Clients :</strong> 5 ans après fin de prestation</p>
                  <p><strong>Données de navigation :</strong> 13 mois</p>
                  <p><strong>Factures et comptabilité :</strong> 10 ans (obligation légale)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">5. Sécurité des données</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                MonadAI met en œuvre toutes les mesures techniques et organisationnelles appropriées 
                pour assurer la sécurité de vos données personnelles :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Chiffrement des données en transit (HTTPS)</li>
                <li>Accès restreint aux données (authentification)</li>
                <li>Sauvegardes sécurisées</li>
                <li>Surveillance des accès</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">6. Vos droits RGPD</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vous pouvez exercer les droits suivants en nous contactant à : 
                <a href="mailto:raph@monadai.fr" className="text-green-sapin hover:underline">raph@monadai.fr</a>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Accès</p>
                      <p className="text-sm text-gray-700">Obtenir une copie de vos données</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Rectification</p>
                      <p className="text-sm text-gray-700">Corriger des données inexactes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Effacement</p>
                      <p className="text-sm text-gray-700">Supprimer vos données</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Portabilité</p>
                      <p className="text-sm text-gray-700">Récupérer vos données</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Opposition</p>
                      <p className="text-sm text-gray-700">Refuser certains traitements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-sapin rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Limitation</p>
                      <p className="text-sm text-gray-700">Limiter l'usage de vos données</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">7. Contact et réclamations</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Pour toute question relative au traitement de vos données personnelles :
                </p>
                <p className="text-gray-700">
                  <strong>Email :</strong> <a href="mailto:raph@monadai.fr" className="text-green-sapin hover:underline">raph@monadai.fr</a><br/>
                  <strong>Délai de réponse :</strong> 30 jours maximum
                </p>
                <p className="text-gray-700 mt-4 text-sm">
                  En cas de réponse insatisfaisante, vous pouvez saisir la CNIL : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-green-sapin hover:underline">cnil.fr</a>
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Dernière mise à jour :</strong> Septembre 2025
              </p>
              <div className="mt-6">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-green-sapin hover:text-green-sapin-light transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 0h11a2 2 0 012 2v4.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.293.707" />
                  </svg>
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}