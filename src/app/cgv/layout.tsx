import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - MonadAI',
  description: 'Conditions générales de vente MonadAI. Tarifs, délais, garanties pour projets web et IA.',
  robots: { index: false, follow: true },
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
