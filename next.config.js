/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ This tells Next.js not to fail the build on ESLint errors
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false, // set to true later if you want SEO to treat it as permanent
      },
    ];
  },
};

module.exports = nextConfig;
