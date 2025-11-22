import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';
import ProductList from './components/ProductList/ProductList';
import Footer from './components/Footer/Footer';
import {Product} from './types';

// Função para buscar produtos do backend
async function getProducts(): Promise<Product[]> {
	try {
		const backendUrl = process.env.BACKEND_URL

		if (!backendUrl) {
			console.error('BACKEND_URL is not defined');
			return [];
		}

		const res = await fetch(`${backendUrl}/products`, {
			cache: 'no-store', // garante que sempre pega dados novos
		});

		if (!res.ok) return [];

		// O backend retorna "ProductDto", precisamos garantir que bata com a interface "Product"
		return res.json();
	} catch (error) {
		console.error('Erro ao buscar produtos:', error);
		return [];
	}
}

export default async function Home() {
	// Busca os dados reais
	const products = await getProducts();

	return (
		<div className="flex flex-col min-h-screen">
			<Header/>
			<main className="flex-grow container mx-auto p-4 md:p-8">
				<div className="flex flex-col gap-12">
					<HeroBanner/>
					{/* Passa os produtos reais para a lista */}
					<ProductList products={products}/>
				</div>
			</main>
			<Footer/>
		</div>
	);
}
