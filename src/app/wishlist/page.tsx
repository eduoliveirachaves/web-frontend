'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';

export default function WishlistPage() {
	const { items, removeFromWishlist } = useWishlist();
	const { addToCart } = useCart();

	const formatPrice = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[#F3F4F6] p-6">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-[#E5E7EB] text-center max-w-md">
          <div className="w-16 h-16 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937] mb-2">Sua lista está vazia</h1>
          <p className="text-[#6B7280] mb-6">
            Explore nossa loja e salve seus itens favoritos para comprar depois.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Começar a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#F3F4F6] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#1F2937] flex items-center gap-3">
            <Heart className="text-red-500 fill-current" />
            Meus Favoritos
            <span className="ml-2 text-sm text-[#6B7280] font-normal">({items.length})</span>
          </h1>
          <Link
            href="/"
            className="hidden sm:inline-block rounded-xl border border-[#2563EB] text-[#2563EB] px-4 py-2 text-sm font-medium hover:bg-[#EFF6FF] transition-colors"
          >
            Continuar comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-52 bg-[#EFF6FF] p-4 flex items-center justify-center">
                <Image
                  src={product.imageUrl || '/window.svg'}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remover dos favoritos"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-medium text-[#1F2937] truncate mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-[#2563EB] mb-4">
                  {formatPrice(Number(product.price))}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 rounded-xl transition-colors text-sm font-semibold shadow-sm"
                >
                  <ShoppingCart size={16} />
                  Mover para o Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}