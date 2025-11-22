'use client'; 

import React from 'react';
import Image from 'next/image';
import { Product } from '@/app/types'; 
import { useCart } from '@/app/context/CartContext'; 

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product); 
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
      
      <div className="w-full md:w-1/2 relative h-96">
        <Image
          src={product.imageUrl || '/window.svg'} 
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg shadow-md"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        
        <p className="text-gray-700">
          {product.description || "Descrição de exemplo do produto. Mais detalhes sobre o item incrível que você está prestes a comprar."}
        </p>
        
        <p className="text-4xl font-light text-gray-800">
          R$ {Number(product.price).toFixed(2)}
        </p>
        
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;