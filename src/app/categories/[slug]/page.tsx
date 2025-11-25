'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ProductCard from '@/app/components/ProductCard/ProductCard';
import CategorySidebar from '@/app/components/CategorySidebar/CategorySidebar';
import Pagination from '@/app/components/Pagination/Pagination';
import { categoryService } from '@/app/services/categoryService';
import { Category, Product } from '@/app/types';

const PRODUCTS_PER_PAGE = 20;

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug as string);

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    loadData();
  }, [slug]);

  useEffect(() => {
    paginateProducts();
  }, [currentPage, allProducts]);

  const loadData = async () => {
    setLoading(true);
    setCurrentPage(1);
    
    try {
      const [categoryData, categoriesData] = await Promise.all([
        categoryService.getCategoryBySlug(slug),
        categoryService.getCategories(),
      ]);

      if (!categoryData) {
        setCategory(null);
        setLoading(false);
        return;
      }

      setCategory(categoryData);
      setAllCategories(categoriesData);

      const productsData = await categoryService.getProductsByCategory(categoryData.id);
      setAllProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const paginateProducts = () => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setDisplayedProducts(allProducts.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Carregando categoria...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Categoria não encontrada</h1>
            <p className="text-gray-600">A categoria que você está procurando não existe.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            {allProducts.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                {allProducts.length} {allProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar para navegação rápida entre categorias */}
            <div className="md:w-64 shrink-0 hidden md:block">
              <CategorySidebar categories={allCategories} activeSlug={slug} />
            </div>

            {/* Lista de Produtos */}
            <div className="flex-1">
              {allProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
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
