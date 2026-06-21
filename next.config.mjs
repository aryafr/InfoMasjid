/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow Dev Origin HMR for LAN IP access
  allowedDevOrigins: ['192.168.33.66', 'localhost', '127.0.0.1']
};

export default nextConfig;
