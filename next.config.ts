import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho de imagem nesse domínio
      },
    ],
  },
  /* config options here */
};

export default nextConfig;