'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {Product} from '@/app/types';
import {
	Star,
	// Share2,
	// MapPin,
	ShieldCheck,
	// RefreshCw,
	Truck,
	ShoppingCart,
	CreditCard,
	Heart,
	// Lock,
	Minus, Plus, CheckCircle
} from 'lucide-react';
import {useCart} from '@/app/context/CartContext';

interface ProductDetailsProps {
	product: Product;
}


const ProductDetails: React.FC<ProductDetailsProps> = ({product}) => {
	const {addToCart} = useCart();
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0); // Estado para controle da galeria

	const handleAddToCart = () => {
		for (let i = 0; i < quantity; i++) {
			addToCart(product);
		}
	};

	const incrementQty = () => setQuantity(prev => prev + 1);
	const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

	// === FORMATAÇÃO DE DADOS ===
	const price = Number(product.price);
	const installments = 10;
	const installmentValue = (price / installments).toFixed(2);

	const formatPrice = (val: number) =>
		new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(val);

	return (
		<div className="bg-white min-h-[calc(100vh-100px)]">

			{/* Navegação de Migalhas (Breadcrumbs) Minimalista */}
			<nav className="container mx-auto px-6 py-6 text-sm text-slate-500">
				<ul className="flex items-center gap-2">
					<li><Link href="/" className="hover:text-blue-600 transition-colors">Início</Link></li>
					<span className="text-slate-300">/</span>
					<li><Link href="/products" className="hover:text-blue-600 transition-colors">Produtos</Link></li>
					<span className="text-slate-300">/</span>
					<li className="text-slate-900 font-medium truncate">{product.name}</li>
				</ul>
			</nav>

			<main className="container mx-auto px-6 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

					{/* === COLUNA ESQUERDA: GALERIA MODERNA === */}
					<div className="space-y-6">
						{/* Imagem Principal com fundo suave */}
						<div
							className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center group">
							<Image
								src={product.imageUrl || '/window.svg'}
								alt={product.name}
								fill
								className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
								priority
								sizes="(max-width: 768px) 100vw, 50vw"
							/>
							<button
								className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-blue-600 hover:shadow-lg transition-all duration-300">
								<Heart size={20}/>
							</button>
						</div>

						{/* Miniaturas em Linha */}
						<div className="flex gap-4 overflow-x-auto pb-2">
							{[0, 1, 2, 3].map((i) => (
								<button
									key={i}
									onClick={() => setSelectedImage(i)}
									className={`relative w-24 h-24 rounded-xl bg-slate-50 border-2 flex-shrink-0 overflow-hidden transition-all duration-300 ${
										selectedImage === i
											? 'border-blue-600 ring-2 ring-blue-100'
											: 'border-transparent hover:border-slate-200'
									}`}
								>
									<Image
										src={product.imageUrl || '/window.svg'}
										alt={`Thumbnail ${i}`}
										fill
										className="object-contain p-2"
									/>
								</button>
							))}
						</div>
					</div>

					{/* === COLUNA DIREITA: DETALHES E AÇÃO === */}
					<div className="flex flex-col gap-8">

						{/* Cabeçalho do Produto */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
                <span
	                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                  Novo Lançamento
                </span>
								<div className="flex items-center text-yellow-400 text-sm">
									<Star fill="currentColor" size={16}/>
									<span className="ml-1 text-slate-700 font-medium">4.8</span>
									<span className="text-slate-400 mx-1">•</span>
									<span className="text-slate-500 underline cursor-pointer hover:text-blue-600">128 avaliações</span>
								</div>
							</div>

							<h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
								{product.name}
							</h1>

							<p className="text-lg text-slate-600 leading-relaxed">
								{product.description ||
									'Experimente o máximo de performance e conforto. Este produto foi projetado com materiais premium para garantir durabilidade e estilo em qualquer situação.'}
							</p>
						</div>

						{/* Preço e Parcelamento */}
						<div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
							<div className="flex items-baseline gap-2">
								<span className="text-5xl font-bold text-blue-600">{formatPrice(price)}</span>
								<span className="text-xl text-slate-400 line-through decoration-red-400">
                  {formatPrice(price * 1.2)}
                </span>
							</div>
							<p className="text-slate-600 mt-2 flex items-center gap-2">
								<CreditCard size={18} className="text-blue-600"/>
								Em até <strong className="text-slate-900">{installments}x de R$ {installmentValue}</strong> sem juros
							</p>
						</div>

						{/* Controles de Ação */}
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Seletor de Quantidade Customizado */}
							<div className="flex items-center bg-white border-2 border-slate-200 rounded-xl h-14 w-fit">
								<button
									onClick={decrementQty}
									className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
								>
									<Minus size={18}/>
								</button>
								<span className="w-12 text-center font-semibold text-lg text-slate-900">{quantity}</span>
								<button
									onClick={incrementQty}
									className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
								>
									<Plus size={18}/>
								</button>
							</div>

							{/* Botão Principal */}
							<button
								onClick={handleAddToCart}
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
							>
								<ShoppingCart size={22}/>
								Adicionar ao Carrinho
							</button>
						</div>

						{/* Benefícios (Ícones) */}
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div
								className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-100 transition-colors">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<Truck size={20}/>
								</div>
								<div>
									<h4 className="font-semibold text-slate-900 text-sm">Frete Grátis</h4>
									<p className="text-xs text-slate-500">Para todo o Brasil</p>
								</div>
							</div>

							<div
								className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-100 transition-colors">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<ShieldCheck size={20}/>
								</div>
								<div>
									<h4 className="font-semibold text-slate-900 text-sm">Garantia Estendida</h4>
									<p className="text-xs text-slate-500">30 dias para troca</p>
								</div>
							</div>
						</div>

						{/* Informações Extras */}
						<div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
							<CheckCircle size={16} className="text-green-500"/>
							<span>Estoque disponível - Envio imediato</span>
						</div>

					</div>
				</div>
			</main>
		</div>
	);
};

export default ProductDetails;