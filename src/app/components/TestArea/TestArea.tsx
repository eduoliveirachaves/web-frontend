'use client';

import React from 'react';
import { Product, Category, CartItem as CartItemType } from '@/app/types';

import ProductDetails from '../ProductDetails/ProductDetails';
import CategorySidebar from '../CategorySidebar/CategorySidebar';
import CartSummary from '../CartSummary/CartSummary';
import CartItem from '../CartItem/CartItem';

interface TestAreaProps {
  products: Product[];
}

const TestArea: React.FC<TestAreaProps> = ({ products }) => {
  const mockCategories: Category[] = [
    { id: '1', name: 'Smartphones', slug: 'smartphones' },
    { id: '2', name: 'Notebooks', slug: 'notebooks' },
    { id: '3', name: 'Fones de Ouvido', slug: 'fones-de-ouvido' },
  ];

  if (products.length === 0) {
    return <p>Carregando produtos para teste...</p>;
  }

  const mockCartItem: CartItemType = {
    ...products[0],
    quantity: 2,
  };

  return (
    <div className="flex flex-col gap-12">
      {/* --- ÁREA DE TESTE DOS NOVOS COMPONENTES --- */}

      <hr className="my-8 border-t-2" />
      <h2 className="text-2xl font-bold text-center">Teste ProductDetails</h2>
      <ProductDetails product={products[0]} />

      <hr className="my-8 border-t-2" />
      <h2 className="text-2xl font-bold text-center">Teste CartItem</h2>

      <hr className="my-8 border-t-2" />
      <h2 className="text-2xl font-bold text-center">Teste Sidebar + Resumo</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <CategorySidebar categories={mockCategories} />
        <div className="flex-grow">
          <CartSummary subtotal={mockCartItem.price * mockCartItem.quantity} shipping={15.0} />
        </div>
      </div>
      {/* --- FIM DA ÁREA DE TESTE --- */}
    </div>
  );
};

export default TestArea;
