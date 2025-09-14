import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [50, 75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // SEO optimizations
  trailingSlash: false,
  
  // Headers déplacés dans middleware.ts pour éviter conflit
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default withBundleAnalyzer(nextConfig);
