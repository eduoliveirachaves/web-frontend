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

	if (items.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
				<div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
					<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
						<Heart size={32} />
					</div>
					<h1 className="text-2xl font-bold text-slate-900 mb-2">Sua lista está vazia</h1>
					<p className="text-slate-500 mb-6">Explore nossa loja e salve seus itens favoritos aqui para comprar depois.</p>
					<Link
						href="/"
						className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
					>
						Começar a comprar
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
					<Heart className="text-red-500 fill-current" />
					Meus Favoritos
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{items.map((product) => (
						<div key={product.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
							<div className="relative h-48 bg-slate-50 p-4 flex items-center justify-center">
								<Image
									src={product.imageUrl || '/window.svg'}
									alt={product.name}
									fill
									className="object-contain p-4 group-hover:scale-105 transition-transform"
								/>
								<button
									onClick={() => removeFromWishlist(product.id)}
									className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors"
									title="Remover dos favoritos"
								>
									<Trash2 size={18} />
								</button>
							</div>

							<div className="p-5">
								<h3 className="font-medium text-slate-900 truncate mb-1">{product.name}</h3>
								<p className="text-lg font-bold text-blue-600 mb-4">
									R$ {Number(product.price).toFixed(2).replace('.', ',')}
								</p>

								<button
									onClick={() => addToCart(product)}
									className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
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