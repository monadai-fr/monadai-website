/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://monadai.fr',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*'],
  
  // Pages prioritaires pour SEO MonadAI
  additionalPaths: async (config) => [
    {
      loc: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/services',
      changefreq: 'weekly', 
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/portfolio',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/contact',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }
  ],
  
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/temp/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1
      }
    ],
    additionalSitemaps: []
  },
  
  transform: async (config, path) => {
    // SEO custom pour pages MonadAI
    const customConfig = {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
    
    // Pages importantes = priority plus haute
    if (['/services', '/portfolio'].includes(path)) {
      customConfig.priority = 0.9
      customConfig.changefreq = 'weekly'
    }
    
    // Pages légales = priority plus basse
    if (['/mentions-legales', '/cgv', '/confidentialite'].includes(path)) {
      customConfig.priority = 0.3
      customConfig.changefreq = 'monthly'
    }
    
    return customConfig
  }
}
