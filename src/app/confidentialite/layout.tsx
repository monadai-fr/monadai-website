import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - MonadAI',
  description: 'Politique de protection des données personnelles MonadAI. Conforme RGPD.',
  robots: { index: false, follow: true },
};

export default function ConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
