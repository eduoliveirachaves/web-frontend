import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
	// essas fera ai bixo
	const teamMembers = [
		'Eduardo Chaves',
		'Felipe Probst',
		'Guilherme Mulatinho',
		'Matheus Pereira',
		'Matheus Piccoli',
	];

	return (
		<footer className="w-full bg-slate-900 text-slate-300 mt-auto pt-16 pb-8">
			<div className="container mx-auto px-4">
				{/* Seção Principal em Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

					{/* Marca */}
					<div className="space-y-4">
						<h2 className="text-2xl font-bold text-white">🛒 MVP Market</h2>
						<p className="text-sm leading-relaxed text-slate-400">
							Fazer uma desc legal.
						</p>
					</div>

					{/* Navegação */}
					<div>
						<h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Navegação</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/" className="hover:text-blue-400 transition-colors">Início</Link>
							</li>
							<li>
								<Link href="/categories" className="hover:text-blue-400 transition-colors">Categorias</Link>
							</li>
							<li>
								<Link href="/cart" className="hover:text-blue-400 transition-colors">Meu Carrinho</Link>
							</li>
							<li>
								<Link href="/login" className="hover:text-blue-400 transition-colors">Entrar / Cadastrar</Link>
							</li>
						</ul>
					</div>

					{/* Equipe */}
					<div>
						<h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Equipe de Desenvolvimento</h3>
						<ul className="space-y-1 text-sm">
							{teamMembers.map((member) => (
								<li key={member} className="flex items-center gap-2 hover:text-white transition-colors">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
									{member}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Seção Inferior: Copyright e Links Legais ->  so pa ficar legal */}
				<div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
					<p>&copy; {new Date().getFullYear()} MVP Market. Todos os direitos reservados.</p>
					<div className="flex gap-6">
						<span className="hover:text-slate-300 cursor-pointer transition-colors">Política de Privacidade</span>
						<span className="hover:text-slate-300 cursor-pointer transition-colors">Termos de Serviço</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;