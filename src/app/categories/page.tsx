import React, { Suspense } from 'react';
import CategorySidebar from '../components/CategorySidebar/CategorySidebar';
import CategoryCard from '../components/Category/Category';
import { Category } from '../types';

// Função simulada / placeholder para buscar categorias
async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('https://web-backend-sck9.onrender.com/category', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Falha ao carregar categorias');
    const data = await res.json();
    // Normaliza se backend tiver outro formato
    return (data?.categories || data || []).map((c: any) => ({
      id: c.id ?? c.slug ?? c.name,
      name: c.name,
      slug: c.slug ?? (c.name || '').toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (e) {
    // Fallback estático
    return [
      { id: '1', name: 'Eletrônicos', slug: 'eletronicos' },
      { id: '2', name: 'Livros', slug: 'livros' },
      { id: '3', name: 'Casa & Cozinha', slug: 'casa-cozinha' },
      { id: '4', name: 'Esportes', slug: 'esportes' },
    ];
  }
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();
  return (
    <main className="min-h-[calc(100vh-100px)] bg-gray-50 py-10">
      <div className="container mx-auto px-4 flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-gray-800">Categorias</h1>
          <p className="text-gray-600 max-w-2xl text-sm">
            Navegue pelas categorias disponíveis e descubra produtos relevantes. Clique em qualquer
            categoria para ver seus itens.
          </p>
        </header>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 shrink-0">
            <CategorySidebar categories={categories} />
          </div>
          <section className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
