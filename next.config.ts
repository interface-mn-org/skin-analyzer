import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
}

export default nextConfig
