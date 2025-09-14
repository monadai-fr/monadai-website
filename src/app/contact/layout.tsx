import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact MonadAI Bordeaux | Devis Web & IA Gratuit 24h',
  description: 'Contact MonadAI : devis web et IA gratuit 24h. Formulaire sécurisé. Tel: 06.47.24.48.09 - raph@monadai.fr',
  keywords: [
    'contact MonadAI', 'devis web gratuit', 'contact agence IA Bordeaux',
    'demande devis transformation digitale', 'contact développeur web',
    'raph@monadai.fr', 'agence web contact France'
  ],
  openGraph: {
    title: 'Contact MonadAI - Devis Gratuit 24h',
    description: 'Contactez notre agence web IA à Bordeaux. Devis gratuit et réponse personnalisée sous 24h.',
    type: 'website',
    url: 'https://monadai.fr/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
