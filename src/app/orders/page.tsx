'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { useAuth } from '@/app/context/AuthContext';
import { orderService } from '@/app/services/orderService';
import { Package, Calendar, ChevronRight, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { Order } from '@/app/types';

export default function MyOrdersPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (token && user) {
      setLoading(true);
      orderService
        .getMyOrders(user.id, token)
        .then(async (data) => {
          // Fetch details for each order to ensure we have full item/product data
          // This fixes the issue where the list endpoint might not return full item details
          const detailedOrders = await Promise.all(
            data.map(async (order) => {
              try {
                const details = await orderService.getOrderById(order.id, token);
                return details || order;
              } catch (e) {
                console.error(`Failed to fetch details for order ${order.id}`, e);
                return order;
              }
            }),
          );
          setOrders(detailedOrders.reverse());
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user, authLoading]);

  const calculateOrderTotal = (order: any) => {
    try {
      if (
        order.totalAmount !== undefined &&
        order.totalAmount !== null &&
        !isNaN(Number(order.totalAmount)) &&
        Number(order.totalAmount) > 0
      ) {
        return Number(order.totalAmount);
      }

      if (order.items && Array.isArray(order.items)) {
        return order.items.reduce((acc: number, item: any) => {
          let price = Number(item.unitPrice);
          // Se unitPrice for 0 ou inválido, tenta pegar do produto
          if (!price || price <= 0) {
            price = Number(item.product?.price ?? 0);
          }

          const qty = Number(item.quantity ?? 1);

          if (isNaN(price) || isNaN(qty)) return acc;
          return acc + price * qty;
        }, 0);
      }
      return 0;
    } catch (e) {
      console.error('Error calculating total', e);
      return 0;
    }
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

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-500 mb-6">
              Faça login para visualizar seus pedidos e acompanhar entregas.
            </p>
            <Link
              href="/login?next=/orders"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Fazer Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <AccountSidebar />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Acompanhe e gerencie seu histórico de compras.
                  </p>
                </div>
                <div className="hidden sm:block p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Package size={24} />
                </div>
              </div>

              <div className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                      Você ainda não realizou nenhuma compra conosco. Que tal dar uma olhada em
                      nossos produtos?
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                    >
                      Começar a Comprar
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="group border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Package size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">
                                  Pedido #{order.id.slice(0, 8)}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar size={14} />
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('pt-BR')
                                  : 'Data desconhecida'}
                              </div>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm text-gray-500">Total do Pedido</p>
                            <p className="text-xl font-bold text-gray-900">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(calculateOrderTotal(order))}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                          <div className="flex -space-x-2 overflow-hidden">
                            {order.items?.slice(0, 4).map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center overflow-hidden"
                                title={item.product?.name}
                              >
                                {/* Placeholder image if no product image */}
                                {item.product?.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[10px] font-bold text-gray-400">
                                    {item.quantity}x
                                  </span>
                                )}
                              </div>
                            ))}
                            {(order.items?.length || 0) > 4 && (
                              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                +{(order.items?.length || 0) - 4}
                              </div>
                            )}
                            <span className="ml-4 text-sm text-gray-500 self-center pl-2">
                              {order.items?.length || 0}{' '}
                              {order.items?.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>

                          <Link
                            href={`/orders/${order.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                          >
                            Detalhes <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}