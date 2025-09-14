import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Services Web & IA - MonadAI Bordeaux | Devis Gratuit 24h',
  description: 'Services web et IA : sites internet, chatbots, transformation digitale. Entreprises et particuliers. Devis gratuit 24h.',
  keywords: [
    'services web Bordeaux', 'développement site internet', 'chatbot sur mesure',
    'automatisation IA entreprises', 'solutions digitales particuliers', 'devis web gratuit',
    'agence web IA France', 'développement Next.js', 'e-commerce Bordeaux'
  ],
  openGraph: {
    title: 'Services Web & IA - MonadAI Bordeaux',
    description: 'Solutions web et IA pour entreprises et particuliers. Devis gratuit en 24h.',
    type: 'website',
    url: 'https://monadai.fr/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
