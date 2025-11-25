'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowRight } from 'lucide-react';

const HeroBanner: React.FC = () => {
  const { user } = useAuth();
  return (
    <section className="w-full bg-gray-50/70 py-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-500 to-blue-600 p-8 md:p-14 shadow-md">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-400/30 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col gap-6 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Tudo para sua próxima compra, fácil e rápido.
            </h1>
            <p className="text-indigo-100 text-base md:text-lg leading-relaxed">
              Encontre produtos, gerencie carrinho e wishlist, e finalize sua compra com uma
              experiência simples. Sem distrações, apenas o que importa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 transition"
              >
                Explorar Categorias
                <ArrowRight size={18} />
              </Link>
              {user ? (
                <Link
                  href="/wishlist"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700/30 border border-indigo-300/30 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700/40 transition"
                >
                  Minha Wishlist
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700/30 border border-indigo-300/30 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700/40 transition"
                >
                  Criar Conta
                </Link>
              )}
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-xs font-medium text-indigo-100">
              <li className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400" /> Checkout rápido
              </li>
              <li className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-300" /> Wishlist integrada
              </li>
              <li className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-300" /> Perfil editável
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
