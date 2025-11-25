'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type { Product } from '@/app/types';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { ratingService } from '@/app/services/ratingService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const [wishLoading, setWishLoading] = useState(false);
  const price = Number(product.price);
  
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        const ratings = await ratingService.getRatingsByProduct(product.id);
        setTotalReviews(ratings.length);
        
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, rating) => acc + rating.rate, 0);
          setAverageRating(sum / ratings.length);
        }
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    };

    loadRatings();
  }, [product.id]);

  // Este handler é chamado ao clicar no botão de carrinho
  // dentro do card que está envolto por um <Link>.
  // Cancelamos a navegação do Link e o "bubbling" do clique
  // para apenas adicionar ao carrinho sem abrir a página do produto.
  const handleAddToCart = (e: React.MouseEvent) => {
    // Impede que o <Link> faça a navegação padrão
    e.preventDefault();
    // Evita que o clique suba para o <Link> pai
    e.stopPropagation();
    // Adiciona o produto ao carrinho mantendo o usuário na listagem
    addToCart(product);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    // Toggle de favoritos dentro de um <Link>:
    // - preventDefault/stopPropagation evitam a navegação
    // - wishLoading funciona como um "lock" simples contra cliques duplos
    // - a persistência (API) e o estado global ficam no WishlistContext
    e.preventDefault();
    e.stopPropagation();
    if (wishLoading) return;
    try {
      setWishLoading(true);
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } finally {
      setWishLoading(false);
    }
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

        {/* Botão de Wishlist: acessível (aria-pressed) e coração preenchido quando ativo */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
          <div
            role="button"
            aria-pressed={inWishlist}
            aria-label={inWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-sm cursor-pointer transition-all ${inWishlist ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
          >
            <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
          </div>
        </div>
      </div>

      {/* === DETALHES === */}
      <div className="p-5 flex flex-col grow">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
          {product.categoryName || 'Geral'}
        </span>

        <h3 className="text-slate-800 font-medium text-base leading-snug mb-2 line-clamp-2 grow group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {totalReviews > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <Star size={14} fill="currentColor" className="text-yellow-400" />
            <span className="font-medium text-slate-700">{averageRating.toFixed(1)}</span>
            <span className="text-slate-400">({totalReviews})</span>
          </div>
        )}

        {/* PRECO */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 line-through">{formatPrice(price * 1.2)}</span>
            <span className="text-xl font-bold text-slate-900">{formatPrice(price)}</span>
          </div>

          {/* ADICIONAR AO CARRINHO */}
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