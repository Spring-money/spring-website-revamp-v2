import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 🔧 other config options …
  images: {
    // allow both Wix-hosted and Unsplash images
    domains: ['static.wixstatic.com', 'images.unsplash.com', 'img.youtube.com'],

    /* -----------------------------------------------------------
       Prefer stricter control?  Replace the `domains` array above
       with `remotePatterns` like this:

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        pathname: '/**',          // keep full access
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',          // or narrow to `/photo-*` etc.
      },
    ],
    ----------------------------------------------------------- */
  },
}

export default nextConfig
