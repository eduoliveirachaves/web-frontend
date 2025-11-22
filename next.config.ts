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
      {
        protocol: 'https',
        hostname: 'cdn.mos.cms.futurecdn.net',
        port: '',
        pathname: '/**', // Novo domínio adicionado para corrigir o erro
      },
    ],
  },
  /* config options here */
};

export default nextConfig;