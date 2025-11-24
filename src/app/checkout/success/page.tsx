import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-md max-w-lg w-full flex flex-col items-center">
          <CheckCircle size={64} className="text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Realizado!</h1>
          <p className="text-gray-600 mb-8">
            Obrigado pela sua compra. Você receberá um e-mail com os detalhes em breve.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/orders" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Ver Meus Pedidos
            </Link>
            <Link href="/" className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}