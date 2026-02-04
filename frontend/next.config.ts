import type { NextConfig } from 'next'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com',
        pathname: '/ip3/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/:path*`,
      },
    ]
  },
}

module.exports = withPWA(nextConfig)
