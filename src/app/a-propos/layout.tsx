import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Raphael LOTTE - Fondateur MonadAI | Expert Cybersécurité & Dev',
  description: 'Rencontrez Raphael LOTTE, 18 ans, fondateur MonadAI. Étudiant cybersécurité spécialisé pentest/DevSecOps. Solutions web et IA pour tous.',
  keywords: [
    'Raphael LOTTE', 'fondateur MonadAI', 'développeur cybersécurité Bordeaux',
    'étudiant pentest', 'expert DevSecOps', 'jeune entrepreneur tech',
    'spécialiste sécurité web', 'transformation digitale expert'
  ],
  openGraph: {
    title: 'Raphael LOTTE - Fondateur MonadAI | Expert Cybersécurité',
    description: 'Étudiant cybersécurité de 18 ans, fondateur MonadAI. Expertise pentest, DevSecOps et développement web.',
    type: 'profile',
    url: 'https://monadai.fr/a-propos',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
