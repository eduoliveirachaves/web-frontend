import React from 'react';
import Link from 'next/link';
import {ArrowRight, TrendingUp, ShieldCheck, Zap} from 'lucide-react';

const HeroBanner: React.FC = () => {
	return (
		<div className="w-full bg-white pb-8">
			<div className="container mx-auto px-4 pt-6">

				{/* Main Banner Card */}
				<div
					className="relative w-full bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex items-center">

					{/* Background */}
					<div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
						<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
							<path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"/>
						</svg>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full p-8 md:p-16 relative z-10">

						{/* Todos os conteudos da esquerda */}
						<div className="flex flex-col justify-center text-center lg:text-left space-y-6">

							<div
								className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-50 text-xs font-bold px-3 py-1 rounded-full w-fit mx-auto lg:mx-0 backdrop-blur-sm border border-blue-400/30">
								<Zap size={14} className="text-yellow-300"/>
								<span>BLACK FRIDAY ANTECIPADA</span>
							</div>

							<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
								Eleve sua performance <br/>
								<span className="text-blue-200">ao próximo nível.</span>
							</h2>

							<p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
								Os melhores equipamentos esportivos com a qualidade que você merece.
								Frete grátis para todo o Brasil na primeira compra.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
								<Link
									href="#products"
									className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-900/20"
								>
									Ver Ofertas
									<ArrowRight size={20}/>
								</Link>

								<button
									className="inline-flex items-center justify-center gap-2 bg-blue-800/40 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-800/60 border border-blue-400/30 backdrop-blur-sm transition-all">
									Saiba Mais
								</button>
							</div>

							{/* Trust Indicators */}
							<div
								className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-blue-200 text-sm font-medium">
								<div className="flex items-center gap-2">
									<ShieldCheck size={18}/>
									<span>Garantia de 30 dias</span>
								</div>
								<div className="flex items-center gap-2">
									<TrendingUp size={18}/>
									<span>Produtos Oficiais</span>
								</div>
							</div>
						</div>

						{/* Conteudo da coluna da direita (imagem) */}
						{/* Trocar imagem de destaque aqui */}
						<div className="hidden lg:flex items-center justify-center relative">
							<div
								className="w-80 h-80 bg-gradient-to-tr from-blue-400 to-blue-300 rounded-full opacity-20 blur-3xl absolute animate-pulse"></div>
							{/* Placeholder visual elegante usando CSS shapes para simular um produto em destaque */}
							<div
								className="relative w-full max-w-md h-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between">
								<div className="h-4 w-1/3 bg-white/20 rounded-full mb-4"></div>
								<div className="space-y-2">
									<div className="h-3 w-full bg-white/10 rounded-full"></div>
									<div className="h-3 w-5/6 bg-white/10 rounded-full"></div>
									<div className="h-3 w-4/6 bg-white/10 rounded-full"></div>
								</div>
								<div className="mt-auto flex justify-between items-end">
									<div className="h-8 w-20 bg-yellow-400/90 rounded-lg"></div>
									<div className="h-10 w-10 bg-white/90 rounded-full"></div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroBanner;