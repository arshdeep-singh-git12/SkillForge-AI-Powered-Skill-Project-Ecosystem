/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure allowed image domains (add as needed)
  images: {
    domains: [
      'avatars.githubusercontent.com', // GitHub avatars
    ],
  },

  eslint: {
    // Don't clutter production build logs with non-fatal lint warnings
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
