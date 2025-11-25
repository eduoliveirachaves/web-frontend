import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ProductList from '@/app/components/ProductList/ProductList';
import CategorySidebar from '@/app/components/CategorySidebar/CategorySidebar';
import { categoryService } from '@/app/services/categoryService';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Busca categoria e produtos em paralelo
  const category = await categoryService.getCategoryBySlug(decodedSlug);
  const allCategories = await categoryService.getCategories();

  if (!category) {
    return notFound();
  }

  const products = await categoryService.getProductsByCategory(category.id);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          {/* Header da Categoria */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{category.name}</h1>
            <p className="text-gray-500 mt-2">
              Confira os melhores produtos em {category.name} selecionados para você.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar para navegação rápida entre categorias */}
            <div className="md:w-64 shrink-0 hidden md:block">
              <CategorySidebar categories={allCategories} activeSlug={slug} />
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
              {products.length > 0 ? (
                <ProductList products={products} hideTitle />
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-gray-500 text-lg">
                    Nenhum produto encontrado nesta categoria no momento.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Volte em breve para novidades!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
