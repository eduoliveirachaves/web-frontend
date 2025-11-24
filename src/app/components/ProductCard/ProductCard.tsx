'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '@/app/types';
import { useCart } from '@/app/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const price = Number(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita comportamento padrão do browser
    e.stopPropagation(); // <--- ESSENCIAL: Impede que o Link pai receba o clique
    addToCart(product);
  };

  // Função placeholder para wishlist (futuro)
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Wishlist click');
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      {/* === Imagem === */}
      <div className="relative w-full aspect-square bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
        <Image
          src={product.imageUrl || '/window.svg'}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Botão de Wishlist (corrigido para div) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
          <div
            role="button"
            onClick={handleWishlist}
            className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Heart size={18} />
          </div>
        </div>
      </div>

      {/* === DETALHES === */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
          Esportes
        </span>

        <h3 className="text-slate-800 font-medium text-base leading-snug mb-2 line-clamp-2 flex-grow group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* PRECO */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(price * 1.2)}
            </span>
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(price)}
            </span>
          </div>

          {/* ADICIONAR AO CARRINHO - Alterado de <button> para <div> */}
          <div
            role="button"
            onClick={handleAddToCart}
            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-200 cursor-pointer z-10"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;