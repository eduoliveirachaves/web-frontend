import React from 'react';
import { Product } from '@/app/types';
import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  products: Product[];
  title?: string;
  hideTitle?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  title = 'Produtos em Destaque',
  hideTitle = false,
}) => {
  return (
    <section id="products" className="w-full">
      {!hideTitle && <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
