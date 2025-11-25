import Header from './components/Header/Header';
import HeroBanner from './components/HeroBanner/HeroBanner';
import ProductList from './components/ProductList/ProductList';
import Footer from './components/Footer/Footer';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import CategoryCard from './components/Category/Category'; // Assuming this is the path, wait, I need to check the export
import Link from 'next/link';

export default async function Home() {
  // Busca os dados reais
  const products = await productService.getProducts();
  const categories = await categoryService.getCategories();
  const featuredCategories = categories.slice(0, 4); // Show top 4 categories

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-12">
          <HeroBanner />

          {/* Categories Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Categorias em Destaque</h2>
              <Link href="/categories" className="text-blue-600 hover:underline font-medium">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>

          {/* Passa os produtos reais para a lista */}
          <ProductList products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
