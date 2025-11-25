'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { useAuth } from '@/app/context/AuthContext';
import { orderService } from '@/app/services/orderService';
import {
  Package,
  Calendar,
  ArrowLeft,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Order } from '@/app/types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      router.push('/login?next=/orders/' + id);
      return;
    }

    if (id && typeof id === 'string') {
      setLoading(true);
      orderService
        .getOrderById(id, token)
        .then((data) => {
          if (data) {
            setOrder(data);
          } else {
            setError('Pedido não encontrado.');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Erro ao carregar o pedido.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, token, user, authLoading, router]);

  const calculateTotal = (order: Order) => {
    if (order.totalAmount && !isNaN(Number(order.totalAmount)) && Number(order.totalAmount) > 0) {
      return Number(order.totalAmount);
    }

    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((acc, item) => {
        const price = Number(item.unitPrice ?? item.product?.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        return acc + price * qty;
      }, 0);
    }
    return 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CANCELED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      IN_CART: 'Em Aberto',
      PENDING: 'Pendente',
      PAID: 'Pago',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELED: 'Cancelado',
    };
    return map[status] || status;
  };

  if (authLoading || loading) {
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

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ops!</h2>
            <p className="text-gray-500 mb-6">{error || 'Pedido não encontrado.'}</p>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Voltar para Meus Pedidos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const total = calculateTotal(order);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0 hidden md:block">
            <AccountSidebar />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-6">
              <Link
                href="/orders"
                className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition mb-4"
              >
                <ArrowLeft size={16} className="mr-1" /> Voltar para pedidos
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Pedido #{order.id.slice(0, 8)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </h1>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={16} />
                  Realizado em{' '}
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-medium text-gray-700">
                    Itens do Pedido
                  </div>
                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <div className="h-20 w-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {item.product?.name || 'Produto indisponível'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Quantidade: {item.quantity}</p>
                          <div className="mt-2 font-semibold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(Number(item.unitPrice ?? item.product?.price ?? 0))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-medium text-gray-700">
                    Resumo do Pedido
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Frete</span>
                      <span>Grátis</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placeholder for Address/Payment if available in future */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Endereço de Entrega</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Endereço não disponível nos detalhes do pedido.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
