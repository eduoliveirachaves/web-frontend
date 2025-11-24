'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { cartService } from '@/app/services/cartService';
import { Package } from 'lucide-react';

export default function MyOrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
       cartService.getMyOrders(user.id, token) 
        .then(data => setOrders(data)) 
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
        } else {
            setLoading(false);
    }
  }, [token, user]);

  const calculateOrderTotal = (order: any) => {
    if (order.totalAmount && !isNaN(Number(order.totalAmount)) && Number(order.totalAmount) > 0) {
        return Number(order.totalAmount);
    }
    
    if (order.items && Array.isArray(order.items)) {
        return order.items.reduce((acc: number, item: any) => {
            const rawPrice = item.unitPrice ?? item.product?.price ?? 0;
            
            const price = Number(rawPrice);
            const qty = Number(item.quantity ?? 1);

            if (isNaN(price) || isNaN(qty)) {
                console.warn("Item com preço inválido encontrado:", item);
                return acc;
            }

            return acc + (price * qty);
        }, 0);
    }

    return 0;
  };

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header /><main className="flex-grow flex justify-center items-center">Faça login para ver seus pedidos.</main><Footer />
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Package /> Meus Pedidos
        </h1>

        {loading ? <p>Carregando...</p> : orders.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-lg shadow">
               <p>Você ainda não tem pedidos.</p>
               <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">Começar a comprar</Link>
           </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {order.status}
                    </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-medium">{order.items?.length || 0} itens</span>
                    <span className="text-lg font-bold text-gray-900">R$ {calculateOrderTotal(order).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}