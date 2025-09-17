import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MonadAI - Développement Web & IA',
    short_name: 'MonadAI',
    description: 'Solutions web et IA sur mesure à Bordeaux. Pour entreprises et particuliers.',
    start_url: '/',
    display: 'minimal-ui',
    theme_color: '#1B4332',
    background_color: '#FFFFFF',
    orientation: 'portrait',
    scope: '/',
    lang: 'fr-FR',
    categories: ['business', 'productivity', 'technology'],
    icons: [
      {
        src: '/favicon-192.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: '/favicon-512.webp', 
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  }
}
