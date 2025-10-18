/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ This tells Next.js not to fail the build on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
