/**
 * Google Analytics 4 - Script direct MonadAI
 * Complète GTM pour analytics avancées
 */

interface GA4Props {
  measurementId: string
}

export default function GA4Script({ measurementId }: GA4Props) {
  return (
    <>
      {/* GA4 gtag.js */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              cookie_flags: 'SameSite=None;Secure'
            });
          `
        }}
      />
    </>
  )
}
