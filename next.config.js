/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wsubvpdyakzpnapgsrnm.supabase.co' },
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.inaturalist.org' },
    ],
  },
  experimental: {
    // Server actions falls später benötigt
  },
};

module.exports = nextConfig;
