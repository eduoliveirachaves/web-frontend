'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { useCart } from '@/app/context/CartContext';
import CartItem from '@/app/components/CartItem/CartItem';
import CartSummary from '@/app/components/CartSummary/CartSummary';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return <div className="p-8 text-center">Carregando seu carrinho...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800">Seu carrinho está vazio</h1>
          <p className="text-gray-600">Parece que você ainda não adicionou nada.</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Voltar para a Loja
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + Number(item.unitPrice) * item.quantity;
  }, 0);

  return (
    // CORREÇÃO 1: 'flex-col' em vez de 'flex-co'
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* CORREÇÃO 2: 'container mx-auto' separado por espaço */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Carrinho</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  name: item.product.name,
                  imageUrl: item.product.imageUrl || '',
                  price: Number(item.unitPrice),
                  quantity: item.quantity,
                }}
                onUpdateQuantity={(id, qtd) => updateQuantity(id, qtd)}
                onRemove={(id) => removeItem(id)}
              />
            ))}
          </div>

          <div className="w-full lg:w-1/3 h-fit space-y-6">
            <CartSummary subtotal={subtotal} shipping={0} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}