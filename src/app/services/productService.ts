import { Product } from '../types';
import { categoryService } from './categoryService';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

export const productService = {
  async getProducts(limit?: number, offset?: number): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (limit !== undefined) params.append('limit', limit.toString());
      if (offset !== undefined) params.append('offset', offset.toString());
      
      const queryString = params.toString();
      const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;

      const [res, categories] = await Promise.all([
        fetch(url, {
          cache: 'no-store',
        }),
        categoryService.getCategories(),
      ]);

      if (!res.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await res.json();
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

      // Normalização básica caso o backend retorne campos diferentes
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.imageUrl || p.image_url || p.image || '',
        description: p.description,
        categoryId: p.categoryId,
        categoryName: p.categoryId ? categoryMap.get(p.categoryId) : undefined,
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  async searchProducts(query: string = ''): Promise<Product[]> {
    try {
      const url = `${API_URL}/products${query ? `?search=${encodeURIComponent(query)}` : ''}`;

      console.log('Frontend chamando:', url);
      const [res, categories] = await Promise.all([
        fetch(url, {
          cache: 'no-store',
        }),
        categoryService.getCategories(),
      ]);

      if (!res.ok) {
        throw new Error('Erro ao buscar produtos');
      }

      const data = await res.json();
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.imageUrl || p.image_url || p.image || '',
        description: p.description,
        categoryId: p.categoryId,
        categoryName: p.categoryId ? categoryMap.get(p.categoryId) : undefined,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const [res, categories] = await Promise.all([
        fetch(`${API_URL}/products/${id}`, {
          cache: 'no-store',
        }),
        categoryService.getCategories(),
      ]);

      if (!res.ok) return null;

      const p = await res.json();
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        imageUrl: p.imageUrl || p.image_url || p.image || '',
        description: p.description,
        categoryId: p.categoryId,
        categoryName: p.categoryId ? categoryMap.get(p.categoryId) : undefined,
      };
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  },
};
