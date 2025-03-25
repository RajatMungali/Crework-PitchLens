/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  },
};

module.exports = nextConfig;