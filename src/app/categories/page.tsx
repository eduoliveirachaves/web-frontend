import React from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import CategorySidebar from '@/app/components/CategorySidebar/CategorySidebar';
import ProductList from '@/app/components/ProductList/ProductList';
import { categoryService } from '@/app/services/categoryService';

export default async function CategoriesPage() {
  const categories = await categoryService.getCategories();

  // Fetch a preview of products for each category (limit to 4)
  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat) => {
      const products = await categoryService.getProductsByCategory(cat.id);
      return { ...cat, products: products.slice(0, 4) };
    }),
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-gray-800">Categorias</h1>
            <p className="text-gray-600 max-w-2xl text-sm">
              Navegue pelas categorias disponíveis e descubra produtos relevantes.
            </p>
          </header>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 shrink-0 hidden md:block">
              <CategorySidebar categories={categories} />
            </div>

            <div className="flex-1 flex flex-col gap-12">
              {categoriesWithProducts.length > 0 ? (
                categoriesWithProducts.map((cat) => (
                  <section key={cat.id} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h2 className="text-2xl font-bold text-gray-800">
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="hover:text-blue-600 transition"
                        >
                          {cat.name}
                        </Link>
                      </h2>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Ver todos
                      </Link>
                    </div>

                    {cat.products.length > 0 ? (
                      <ProductList products={cat.products} hideTitle />
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Nenhum produto em destaque nesta categoria.
                      </p>
                    )}
                  </section>
                ))
              ) : (
                <p className="text-gray-500 text-center py-10">Nenhuma categoria encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
