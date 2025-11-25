import { Category, Product } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_URL}/category`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Falha ao carregar categorias');
      const data = await res.json();

      // Normaliza a resposta
      return (Array.isArray(data) ? data : data.categories || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || slugify(c.name),
      }));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      // Como não temos endpoint direto por slug, buscamos todas e filtramos
      // Idealmente o backend teria /category/slug/:slug
      const categories = await this.getCategories();
      return categories.find((c) => c.slug === slug || c.slug === slug.toLowerCase()) || null;
    } catch (error) {
      console.error('Erro ao buscar categoria por slug:', error);
      return null;
    }
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      // Fetch category info first to get the name
      const categories = await this.getCategories();
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category ? category.name : 'Geral';

      // Tenta buscar produtos filtrados por categoria
      // Ajuste conforme a API real: pode ser /products?categoryId=X ou /category/X/products
      const res = await fetch(`${API_URL}/products?categoryId=${categoryId}`, {
        cache: 'no-store',
      });

      let productsData = [];

      if (!res.ok) {
        // Fallback: se não tiver filtro, busca todos e filtra no front (não ideal para produção)
        const allRes = await fetch(`${API_URL}/products`, { cache: 'no-store' });
        if (!allRes.ok) return [];
        const allProducts = await allRes.json();
        productsData = allProducts.filter((p: any) => p.categoryId === categoryId);
      } else {
        productsData = await res.json();
      }

      return productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.imageUrl || p.image_url || p.image || '',
        description: p.description,
        categoryId: categoryId,
        categoryName: categoryName,
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos da categoria:', error);
      return [];
    }
  },
};
