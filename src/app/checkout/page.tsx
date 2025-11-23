'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Para redirecionar após a compra
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { useCart } from '@/app/context/CartContext';

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  // Estado simples para o formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    paymentMethod: 'credit_card',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui entraria a lógica real de enviar para o backend
    console.log('Dados do Pedido:', { user: formData, items: cart?.items });

    alert('Pedido realizado com sucesso! Obrigado pela compra.');

    // Opcional: Limpar carrinho aqui (seria uma função clearCart() no contexto)

    router.push('/'); // Volta para a home
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando informações...</div>;
  }

  // Se não tiver itens, não faz sentido estar no checkout
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800">Carrinho vazio</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para a loja
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Cálculos de totais
  const subtotal = cart.items.reduce((acc, item) => {
    return acc + Number(item.unitPrice) * item.quantity;
  }, 0);
  const shipping = 15.0; // Frete fixo para exemplo
  const total = subtotal + shipping;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Coluna da Esquerda: Formulário --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Card de Endereço */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Dados de Entrega
              </h2>
              <form
                id="checkout-form"
                onSubmit={handleFinishOrder}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Rua, número, bairro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: São Paulo"
                  />
                </div>
              </form>
            </div>

            {/* Card de Pagamento */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Pagamento</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                  />
                  <span>Cartão de Crédito</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={formData.paymentMethod === 'pix'}
                    onChange={handleChange}
                  />
                  <span>PIX</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="boleto"
                    checked={formData.paymentMethod === 'boleto'}
                    onChange={handleChange}
                  />
                  <span>Boleto Bancário</span>
                </label>
              </div>
            </div>
          </div>

          {/* --- Coluna da Direita: Resumo do Pedido --- */}
          <div className="w-full lg:w-1/3 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                Resumo do Pedido
              </h2>

              {/* Lista compacta de itens */}
              <div className="space-y-2 mb-4 max-h-60 overflow-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate w-2/3">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-gray-600 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">R$ {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t mt-4">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition mt-6"
              >
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
