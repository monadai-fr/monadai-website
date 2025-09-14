'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Identification de l'entreprise</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-2">
                <p className="text-gray-700"><strong className="text-black">Dénomination sociale :</strong> MonadAI</p>
                <p className="text-gray-700"><strong className="text-black">Forme juridique :</strong> Micro-entreprise</p>
                <p className="text-gray-700"><strong className="text-black">Numéro SIREN :</strong> 991054958</p>
                <p className="text-gray-700"><strong className="text-black">Code APE :</strong> 62.01Z - Programmation informatique</p>
                <p className="text-gray-700"><strong className="text-black">Dirigeant :</strong> Raphael LOTTE</p>
                <p className="text-gray-700"><strong className="text-black">Siège social :</strong> Bordeaux, France</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Contact</h2>
              <div className="space-y-2">
                <p className="text-gray-700"><strong className="text-black">Email :</strong> <a href="mailto:raph@monadai.fr" className="text-green-sapin hover:underline">raph@monadai.fr</a></p>
                <p className="text-gray-700"><strong className="text-black">Téléphone :</strong> <a href="tel:+330647244809" className="text-green-sapin hover:underline">+33 (0)6 47 24 48 09</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Hébergement</h2>
              <p className="text-gray-700">Ce site est hébergé par :</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><strong className="text-black">Vercel Inc.</strong></p>
                <p className="text-gray-700">340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p className="text-gray-700">Site web : <a href="https://vercel.com" target="_blank" rel="noopener" className="text-green-sapin hover:underline">vercel.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Propriété intellectuelle</h2>
              <p className="text-gray-700 leading-relaxed">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Limitation de responsabilité</h2>
              <p className="text-gray-700 leading-relaxed">
                MonadAI s'efforce de fournir des informations aussi précises que possible. 
                Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, 
                qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Droit applicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Le présent site et les conditions générales qui suivent sont régis par le droit français. 
                Tout litige sera de la compétence exclusive des tribunaux français.
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
