'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { Package, User, MapPin, Star, Loader2 } from 'lucide-react';

export default function MinhaContaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  if (!user) {
    return null;
  }

  const shortcuts = [
    {
      title: 'Meus Pedidos',
      description: 'Acompanhe o status de suas compras recentes.',
      icon: Package,
      href: '/orders',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Meus Dados',
      description: 'Gerencie suas informações pessoais e senha.',
      icon: User,
      href: '/profile',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Endereços',
      description: 'Cadastre e gerencie seus locais de entrega.',
      icon: MapPin,
      href: '/enderecos',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Avaliações',
      description: 'Veja os produtos que você já avaliou.',
      icon: Star,
      href: '/avaliacoes',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name}!</h1>
                  <p className="text-gray-500 mt-1">
                    Bem-vindo ao seu painel. Aqui você pode gerenciar toda sua conta.
                  </p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    Membro desde {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200 flex items-start gap-4"
                  >
                    <div
                      className={`p-3 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
