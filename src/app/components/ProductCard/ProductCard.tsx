import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-105">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">
            R$ {product.price.toFixed(2)}
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Ver Produto
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;