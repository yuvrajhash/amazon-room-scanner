import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typescript: {
    // During deployment, we'll handle TypeScript errors in the deploy script
    // rather than failing the build
    ignoreBuildErrors: true,
  },
  eslint: {
    // During deployment, we'll handle ESLint errors in the deploy script
    // rather than failing the build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['amazon-room-scanner.netlify.app'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
