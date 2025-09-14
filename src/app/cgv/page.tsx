'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Conditions Générales de Vente
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Objet</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes conditions générales de vente régissent les relations contractuelles entre MonadAI 
                et ses clients dans le cadre de la prestation de services de développement web, automatisation IA 
                et transformation digitale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Services proposés</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-sapin mb-2">Développement Web</h3>
                  <p className="text-gray-700">Création de sites internet, applications web, boutiques en ligne.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-sapin mb-2">Automatisation IA</h3>
                  <p className="text-gray-700">Développement de chatbots, scripts d'automatisation, intégrations API.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-sapin mb-2">Transformation Digitale</h3>
                  <p className="text-gray-700">Audit technique, stratégie digitale, formation des équipes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. Devis et commandes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tout devis est valable 30 jours à compter de sa date d'émission. 
                La commande est considérée comme acceptée dès signature du devis et versement de l'acompte.
              </p>
              <div className="bg-green-sapin/5 border-l-4 border-green-sapin p-4 rounded">
                <p className="text-gray-700">
                  <strong>Acompte :</strong> 40% à la signature du devis
                  <br />
                  <strong>Solde :</strong> 60% à la livraison du projet
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. Délais de réalisation</h2>
              <div className="space-y-3">
                <p className="text-gray-700"><strong>Délais standards :</strong></p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Site vitrine simple : 2-3 semaines</li>
                  <li>Site e-commerce : 4-6 semaines</li>
                  <li>Application web : 6-12 semaines</li>
                  <li>Chatbot/IA : 3-5 semaines</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                  <p className="text-amber-800">
                    <strong>Prestations urgentes :</strong> Supplément de 30% pour délai réduit de 50%.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">5. Modalités de paiement</h2>
              <div className="space-y-4">
                <p className="text-gray-700 font-medium">Moyens de paiement acceptés :</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Virement bancaire</strong> - RIB fourni avec facture</li>
                  <li><strong>Lien de paiement sécurisé Qonto</strong> - Envoyé par email</li>
                </ul>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-700">
                    <strong>Retard de paiement :</strong> Pénalités de 3% par mois de retard + 40€ de frais de recouvrement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">6. Garanties</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <p className="text-gray-700"><strong>Garantie de conformité :</strong> 30 jours</p>
                <p className="text-gray-700"><strong>Correction des bugs :</strong> 60 jours gratuits</p>
                <p className="text-gray-700"><strong>Support technique :</strong> 3 mois d'accompagnement</p>
                <p className="text-sm text-gray-600 italic">
                  Hors modifications du cahier des charges initial ou demandes de nouvelles fonctionnalités.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">7. Propriété intellectuelle</h2>
              <p className="text-gray-700 leading-relaxed">
                Le client acquiert la pleine propriété du code source développé spécifiquement pour son projet. 
                MonadAI conserve la propriété des outils, méthodologies et composants génériques utilisés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">8. Résiliation</h2>
              <p className="text-gray-700 leading-relaxed">
                En cas de résiliation anticipée par le client, les sommes versées restent acquises à MonadAI 
                en contrepartie du travail déjà réalisé. Un décompte sera établi selon l'avancement du projet.
              </p>
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
