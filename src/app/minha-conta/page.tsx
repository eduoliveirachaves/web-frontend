'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MinhaContaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="container mx-auto p-8">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Informações da Conta</h2>
          <p className="text-gray-600">Nome: {user.name}</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}
