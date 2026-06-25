/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["firebase-admin"],
  output: "standalone",
  // Allow Dev Origin HMR for LAN IP access
  allowedDevOrigins: ['192.168.33.66', 'localhost', '127.0.0.1'],
  
  // Mengurangi penggunaan memori ekstrim saat proses 'next build' di VPS kecil
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,

  // Lapisan Keamanan Tambahan (Security Headers)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
