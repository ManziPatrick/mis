import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add metadataBase to prevent "Invalid URL" errors during build when resolving metadata
  // In production, Vercel provides the VERCEL_URL environment variable
  // We use a fallback to ensure it's always a valid URL string during build
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
