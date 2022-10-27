/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['pages', 'components', 'layouts', 'services', 'utils'],
  },
  images: {
    domains: [
      'http://localhost:3000',
      'firebasestorage.googleapis.com'
    ],
  },
};

module.exports = nextConfig;
