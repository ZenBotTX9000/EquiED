import createNextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = createNextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enforce ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enforce TypeScript errors during builds
  },
  images: {
    unoptimized: false, // Enable Next.js image optimization
  },
};

export default withBundleAnalyzer(nextConfig);
