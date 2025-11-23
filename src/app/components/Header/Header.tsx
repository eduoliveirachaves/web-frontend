'use client';

import React from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar/SearchBar';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
	const handleSearch = (query: string) => {
		console.log('Buscando por:', query);
	};

	const { cart } = useCart();
	const { user, logout } = useAuth();
	const { items: wishlistItems } = useWishlist();

	const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
	const totalWishlist = wishlistItems.length;

	const getUserName = (fullName: string) => {
		const names = fullName.split(' ');
		if (names.length === 1) return names[0];
		return `${names[0]} ${names[names.length - 1]}`;
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
				{/* Logo */}
				<Link href="/" className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors whitespace-nowrap">
					🛒 MVP Market
				</Link>

				{/* Search Bar - no mobile nao */}
				<div className="flex-1 max-w-xl hidden md:block">
					<SearchBar onSearch={handleSearch} placeholder="O que você procura hoje?" />
				</div>

				{/* Navegacao */}
				<nav className="flex items-center gap-4 md:gap-6">
					<Link href="/categories" className="hidden md:block text-gray-600 font-medium hover:text-blue-600 transition-colors">
						Categorias
					</Link>

					{/* Wishlist Link */}
					<Link href="/wishlist" className="relative text-gray-600 hover:text-red-500 transition-colors" title="Meus Favoritos">
						<Heart size={22} />
						{totalWishlist > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalWishlist}
              </span>
						)}
					</Link>

					{/* Cart Link */}
					<Link href="/cart" className="group relative flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
						<span className="hidden md:inline font-medium">Carrinho</span>
						<span className="md:hidden">🛒</span> {/* Fallback icon for mobile */}
						{totalItems > 0 && (
							<span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
						)}
					</Link>

					{/* ===User autenticado ou nao === */}
					<div className="border-l pl-4 md:pl-6 border-gray-200">
						{user ? (
							<div className="flex items-center gap-4">
								<div className="hidden md:flex flex-col items-end">
									<span className="text-xs text-gray-500">Bem-vindo,</span>
									<span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                    {getUserName(user.name)}
                  </span>
								</div>
								<button
									onClick={logout}
									className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
								>
									Sair
								</button>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
									Entrar
								</Link>
								<Link
									href="/register"
									className="hidden md:inline-block px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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