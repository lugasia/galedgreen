
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.store.link',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tokeep.co.il',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.google.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.organi-co.co.il',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'extension.umn.edu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fruit.co.il',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.veredcarmel.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'al-haderech.co.il',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.aeropage.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'seedsfromzion.co.il',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
