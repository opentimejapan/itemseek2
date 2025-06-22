/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@itemseek2/ui-mobile', '@itemseek2/api-client', '@itemseek2/shared'],
  experimental: {
    optimizePackageImports: ['@itemseek2/ui-mobile', 'recharts']
  }
};

module.exports = nextConfig;