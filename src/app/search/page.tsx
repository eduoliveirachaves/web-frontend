'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import ProductList from '@/app/components/ProductList/ProductList';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types';
import { SearchX } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const results = await productService.searchProducts(query);
      setProducts(results);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex-grow">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Resultados da busca
      </h1>
      <p className="text-gray-500 mb-8">
        Mostrando resultados para: <strong className="text-gray-900">"{query}"</strong>
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Buscando produtos...</p>
        </div>
      ) : products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <SearchX size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Nenhum produto encontrado</h2>
          <p className="text-gray-500 mt-2 max-w-md text-center">
            Não encontramos nada com o termo "<strong>{query}</strong>". Tente usar palavras mais genéricas ou verifique a ortografia.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Suspense fallback={<div className="p-8 text-center">Carregando busca...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}