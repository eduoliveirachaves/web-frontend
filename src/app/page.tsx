import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';
import ProductList from './components/ProductList/ProductList';
import Footer from './components/Footer/Footer';
import { productService } from './services/productService';

export default async function Home() {
  // Busca os dados reais
  const products = await productService.getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-12">
          <HeroBanner />
          {/* Passa os produtos reais para a lista */}
          <ProductList products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
