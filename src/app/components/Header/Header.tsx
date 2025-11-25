'use client';

import React from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar/SearchBar';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { Heart } from 'lucide-react';
import UserMenu from '../UserMenu/UserMenu';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const handleSearch = (query: string) => {
    if (query.trim()){
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const { cart } = useCart();
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalWishlist = wishlistItems.length;
  const cartLabel = totalItems > 0 ? `Carrinho com ${totalItems} itens` : 'Carrinho vazio';
  const wishlistLabel =
    totalWishlist > 0 ? `Favoritos com ${totalWishlist} itens` : 'Favoritos vazio';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          🛒 MVP Market
        </Link>

        {/* Search Bar - no mobile nao */}
        <div className="flex-1 max-w-xl hidden md:block">
          <SearchBar onSearch={handleSearch} placeholder="O que você procura hoje?" />
        </div>

        {/* Navegacao */}
        <nav className="flex items-center gap-3 md:gap-5">
          <Link
            href="/categories"
            className="hidden md:block text-gray-600 font-medium hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md px-1.5 py-0.5"
          >
            Categorias
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative text-gray-600 hover:text-red-500 transition-colors"
            title="Meus Favoritos"
          >
            <Heart size={22} />
            {totalWishlist > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="group relative flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label={cartLabel}
            title="Carrinho"
          >
            <span className="hidden md:inline font-medium">Carrinho</span>
            <span className="md:hidden">🛒</span> {/* Fallback icon for mobile */}
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ===User autenticado ou nao === */}
          <div className="border-l pl-3 md:pl-5 border-gray-200">
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
