import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // 반드시 필요

  /* config options here */
  reactStrictMode: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: '*' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ]
  }
}

export default nextConfig
