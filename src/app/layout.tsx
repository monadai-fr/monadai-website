import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SchemaOrg from "@/components/schema-org";
import PerformanceInit from "@/components/performance-init";
import GTM, { GTMNoscript } from "@/components/gtm";
import GA4Script from "@/components/ga4-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MonadAI - Développement Web & IA sur mesure | Bordeaux France",
    template: "%s | MonadAI"
  },
  description: "Développement web et IA à Bordeaux. Sites, automatisation, transformation digitale. Entreprises et particuliers. Devis gratuit 24h.",
  keywords: [
    // Keywords primaires MonadAI
    "agence web Bordeaux", "développement web IA", "MonadAI",
    // Services spécifiques  
    "automatisation IA entreprises", "chatbot intelligent", "transformation digitale",
    "site internet Bordeaux", "e-commerce sur mesure", "audit technique",
    // Cibles business
    "solutions digitales entreprises", "développeur web freelance", "pentest DevSecOps",
    // Géolocalisation
    "web agency France", "développement Nouvelle-Aquitaine"
  ],
  authors: [{ name: "Raphael LOTTE", url: "https://monadai.fr" }],
  creator: "MonadAI - Raphael LOTTE",
  publisher: "MonadAI",
  alternates: {
    canonical: "https://monadai.fr",
    languages: {
      'fr-FR': 'https://monadai.fr',
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://monadai.fr",
    title: "MonadAI - Développement Web & IA sur mesure | Bordeaux",
    description: "Développement web et IA à Bordeaux. Sites internet, automatisation, transformation digitale pour entreprises et particuliers.",
    siteName: "MonadAI",
    images: [
      {
        url: "https://monadai.fr/images/monadai-social-card.jpg",
        width: 1200,
        height: 630,
        alt: "MonadAI - Développement Web & IA Bordeaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MonadAI - Développement Web & IA sur mesure",
    description: "Solutions digitales sur mesure depuis Bordeaux. Sites web, IA, automatisation pour entreprises et particuliers.",
    creator: "@MonadAI_FR",
    images: ["https://monadai.fr/images/monadai-social-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    },
  },
  verification: {
    google: 'google-site-verification-placeholder',
    yandex: 'yandex-verification-placeholder',
    other: {
      'msvalidate.01': 'msvalidate-placeholder'
    }
  },
  category: 'technology',
  classification: 'Développement web et IA',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <SchemaOrg />
        <GTM gtmId="GTM-KQ7X36DP" />
        <GA4Script measurementId="G-9697XDEM67" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GTMNoscript gtmId="GTM-KQ7X36DP" />
        <PerformanceInit />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
