/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // Port của Laravel backend
        pathname: '/**', // Cho phép mọi đường dẫn ảnh
      },
    ],
  },
};

export default nextConfig;