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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
