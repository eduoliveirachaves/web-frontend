'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';

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
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-8">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      title: 'MEUS PEDIDOS',
      description: 'Veja históricos e acompanhe suas compras.',
      icon: '🛒',
      href: '/meus-pedidos',
      color: 'orange',
    },
    {
      title: 'MEUS DADOS',
      description: 'Altere seus dados cadastrados, endereços ou cadastre um novo endereço.',
      icon: '👤',
      href: '/meus-dados',
      color: 'orange',
    },
    {
      title: 'ENDEREÇO',
      description: 'Gerencie, edite ou adicione novos endereços de entrega.',
      icon: '📍',
      href: '/enderecos',
      color: 'orange',
    },
    {
      title: 'AVALIAÇÕES',
      description: 'Avalie suas compras e visualize suas avaliações e comentários.',
      icon: '👍',
      href: '/avaliacoes',
      color: 'orange',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, {user.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📧</span>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">⋮⋮</span> ATALHOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6 flex items-start gap-4 group"
              >
                <div className="text-4xl text-orange-500 group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
