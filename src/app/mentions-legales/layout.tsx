import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mentions Légales - MonadAI',
  description: 'Mentions légales de MonadAI - SIREN 991054958 - Micro-entreprise spécialisée en développement web et IA.',
  robots: { index: false, follow: true },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
