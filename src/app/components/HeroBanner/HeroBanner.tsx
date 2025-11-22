import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <div className="w-full bg-blue-600 text-white py-16 px-4 text-center rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-2">As Melhores Ofertas</h2>
      <p className="text-lg mb-4">Encontre tudo o que você precisa em um só lugar.</p>
      <a
        href="#products"
        className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition"
      >
        Ver Produtos
      </a>
    </div>
  );
};

export default HeroBanner;
