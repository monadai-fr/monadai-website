import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Projets MonadAI | SaaS en Développement | Innovation Web & IA',
  description: 'Projets SaaS innovants en développement : Zentra Flux (données opérationnelles), Clara Node (collaboration), Vora Pulse (automatisation).',
  keywords: [
    'projets SaaS développement', 'innovations web IA', 'Zentra Flux SaaS', 
    'Clara Node collaboration', 'Vora Pulse automatisation', 'projets en cours',
    'portfolio développeur Bordeaux', 'SaaS Next.js', 'projets IA France'
  ],
  openGraph: {
    title: 'Projets MonadAI - Innovations SaaS en Développement',
    description: 'Découvrez nos projets SaaS innovants : solutions opérationnelles, collaboration IA, automatisation.',
    type: 'website',
    url: 'https://monadai.fr/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
