'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { useCart } from '@/app/context/CartContext';
import CartItem from '@/app/components/CartItem/CartItem';
import CartSummary from '@/app/components/CartSummary/CartSummary';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
            <p className="text-gray-500 mb-8">
              Parece que você ainda não adicionou nada. Que tal explorar nossas categorias?
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            >
              Voltar para a Loja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + Number(item.unitPrice) * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
          <p className="text-gray-500 mt-1">
            Você tem {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
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
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <CartSummary subtotal={subtotal} shipping={0} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
