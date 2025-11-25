'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowRight, ShoppingBag, Heart, Star, ShieldCheck, Truck } from 'lucide-react';

const HeroBanner: React.FC = () => {
  const { user } = useAuth();
  return (
    <section className="w-full py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/20">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[10%] left-[10%] h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute top-[40%] left-[20%] h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-12">
            {/* Text Content */}
            <div className="flex-1 max-w-2xl space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-xs font-semibold backdrop-blur-sm w-fit mx-auto md:mx-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-100"></span>
                  </span>
                  Novas ofertas disponíveis
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Sua loja favorita, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200">
                    agora online.
                  </span>
                </h1>

                <p className="text-lg text-blue-100/90 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  Descubra uma nova forma de comprar. Produtos selecionados, entrega rápida e a
                  segurança que você merece.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/categories"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg shadow-blue-900/10 hover:bg-blue-50 hover:scale-105 transition-all duration-200"
                >
                  Começar a Comprar
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                {!user && (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-800/40 border border-blue-400/30 backdrop-blur-md px-8 py-4 text-base font-semibold text-white hover:bg-blue-800/60 transition-all duration-200"
                  >
                    Criar Conta Grátis
                  </Link>
                )}
              </div>

              <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-sm font-medium text-blue-200/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} /> Compra Segura
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} /> Entrega Rápida
                </div>
              </div>
            </div>

            {/* Visual/Floating Elements (Right Side) */}
            <div className="hidden md:block relative w-80 h-80 lg:w-96 lg:h-96 shrink-0">
              {/* Abstract composition representing shopping */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl border border-white/10 backdrop-blur-md rotate-6 shadow-2xl flex items-center justify-center">
                <ShoppingBag size={80} className="text-white/80 drop-shadow-lg" />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-0 right-0 p-4 bg-white rounded-2xl shadow-xl animate-[bounce_3s_infinite]">
                <Heart className="text-red-500 fill-red-500" size={24} />
              </div>

              <div className="absolute bottom-10 left-0 p-4 bg-white rounded-2xl shadow-xl animate-[bounce_4s_infinite]">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-[10px] font-bold text-gray-600 mt-1 text-center">5.0 de 5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
