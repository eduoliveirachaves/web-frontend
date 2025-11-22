'use client';

import React from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar/SearchBar';
import {useCart} from '@/app/context/CartContext';
import {useAuth} from '@/app/context/AuthContext'; // 1. Importa o hook de autenticação

const Header: React.FC = () => {
	// FAZER
	const handleSearch = (query: string) => {
		console.log('Buscando por:', query);
	};

	// Pega os dados do carrinho do contexto
	const {cart} = useCart();

	// Pega o usuário e a função de logout
	const {user, logout} = useAuth();

	// Calcula o total de itens somando a quantidade de cada item no carrinho
	const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

	const getUserName = (fullName: string) => {
		const names = fullName.split(' ');
		return `${names[0]} ${names[names.length - 1]}`;
	}

	return (
		<header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between gap-8">

				<Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
					🛒 MVP Market
				</Link>

				<div className="flex-1 max-w-xl hidden md:block">
					<SearchBar onSearch={handleSearch} placeholder="O que você procura hoje?"/>
				</div>

				{/* Navegação Principal */}
				<nav className="flex items-center gap-6">
					<Link href="/categories" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
						Categorias
					</Link>

					<Link href="/cart"
					      className="group relative flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
						<span className="font-medium">Carrinho</span>
						{totalItems > 0 && (
							<span
								className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                {totalItems}
              </span>
						)}
					</Link>

					{/* Muda o que aparece baseado se o usuário está logado ou não */}
					<div className="border-l pl-6 border-gray-200">
						{user ? (
							// === VISÃO QUANDO LOGADO ===
							<div className="flex items-center gap-4">
								<div className="flex flex-col items-end">
									<span className="text-xs text-gray-500">Bem-vindo,</span>
									<span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                    {getUserName(user.name)}
                  </span>
								</div>
								<button
									onClick={logout}
									className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
								>
									Sair
								</button>
							</div>
						) : (
							// === VISÃO QUANDO DESLOGADO ===
							<div className="flex items-center gap-3">
								<Link
									href="/login"
									className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
								>
									Entrar
								</Link>
								<Link
									href="/register"
									className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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