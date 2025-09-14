/**
 * Schema.org LocalBusiness pour MonadAI
 * Optimise le référencement local et la présence Google Business
 */

interface SchemaOrgProps {
  page?: 'home' | 'services' | 'contact'
}

export default function SchemaOrg({ page = 'home' }: SchemaOrgProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "additionalType": "WebDesignCompany",
    "name": "MonadAI",
    "legalName": "MonadAI",
    "url": "https://monadai.fr",
    "logo": "https://monadai.fr/images/monadai-logo.webp",
    "description": "Développement web et automatisation IA pour entreprises et particuliers. Transformation digitale sur mesure depuis Bordeaux, France.",
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "Raphael LOTTE",
      "jobTitle": "Fondateur & Lead Developer",
      "description": "Étudiant en cybersécurité spécialisé en pentest et DevSecOps"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bordeaux",
      "addressCountry": "FR",
      "addressRegion": "Nouvelle-Aquitaine"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "raph@monadai.fr",
      "telephone": "+33647244809",
      "availableLanguage": "French",
      "areaServed": "FR"
    },
    "sameAs": [
      "https://github.com/monadai-fr",
      "https://www.linkedin.com/in/raphael-lotte-17a685331/"
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "France"
    },
    "priceRange": "€€€",
    "paymentAccepted": "Virement bancaire, Qonto",
    "currenciesAccepted": "EUR",
    "openingHours": "Mo-Fr 09:00-18:00",
    "identifier": {
      "@type": "PropertyValue", 
      "propertyID": "SIREN",
      "value": "991054958"
    },
    "knowsAbout": [
      "Développement web",
      "Next.js",
      "React",
      "Intelligence artificielle", 
      "Automatisation",
      "Transformation digitale",
      "Cybersécurité",
      "Pentest",
      "DevSecOps"
    ],
    "serviceType": "Développement web et IA"
  }

  // Schema spécifique par page
  const pageSchemas = {
    services: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Services MonadAI",
      "provider": {
        "@type": "Organization",
        "name": "MonadAI"
      },
      "serviceType": [
        "Développement web",
        "Automatisation IA", 
        "Transformation digitale"
      ],
      "areaServed": "France",
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Entreprises et particuliers"
      }
    },
    contact: {
      "@context": "https://schema.org", 
      "@type": "ContactPage",
      "name": "Contact MonadAI",
      "description": "Contactez MonadAI pour votre projet web ou IA. Devis gratuit sous 24h.",
      "mainEntity": {
        "@type": "Organization",
        "name": "MonadAI"
      }
    }
  }

  const schemas = [baseSchema]
  if (page !== 'home' && pageSchemas[page]) {
    schemas.push(pageSchemas[page] as any)
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
      }}
    />
  )
}
