import { Product } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const productService = {
  async searchProducts(query: string = ''): Promise<Product[]> {
    try {
      const url = `${API_URL}/products${query ? `?search=${encodeURIComponent(query)}` : ''}`;
      
      console.log("Frontend chamando:", url);
      const res = await fetch(url, { 
        cache: 'no-store' 
      });
      
      if (!res.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      
      return res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};