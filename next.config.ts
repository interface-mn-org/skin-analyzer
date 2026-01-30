import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's3.qpay.mn',
      },
      {
        protocol: 'https',
        hostname: 'qpay.mn',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
