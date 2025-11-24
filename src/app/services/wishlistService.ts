import { Product } from '@/app/types/';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

// Normaliza respostas de wishlist vindas do backend para um array de Product
function normalizeWishlistPayload(payload: any): Product[] {
  if (!payload) return [];
  const arr = Array.isArray(payload) ? payload : payload.items || [];
  return arr
    .map((item: any) => {
      // Alguns backends retornam { id, product: {...} }, outros retornam o próprio produto
      const p = item?.product ?? item;
      const id = String(p?.id ?? item?.productId ?? item?.id ?? '');
      const name = p?.name != null ? String(p.name) : '';
      // Garante número mesmo se vier string
      const rawPrice = p?.price;
      const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice ?? 0);
      // Cobrir diferentes convenções de campo para imagem
      const imageUrl = p?.imageUrl || p?.image_url || p?.image || '';
      const description = p?.description ?? undefined;

      if (!id) return null;
      return { id, name, price, imageUrl, description } as Product;
    })
    .filter((p: Product | null) => p && p.id);
}

export const wishlistService = {
  // Todos os itens da wishlist
  async getWishlist(token: string): Promise<Product[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/wish-list`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) return [];
      const json = await res.json();
      return normalizeWishlistPayload(json);
    } catch (error) {
      console.warn('Erro ao buscar wishlist (backend pode estar offline):', error);
      return [];
    }
  },

  async addItem(token: string, productId: string): Promise<void> {
    try {
      await fetch(`${BACKEND_URL}/wish-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error('Erro ao adicionar item à wishlist:', error);
      throw error;
    }
  },

  async removeItem(token: string, productId: string): Promise<void> {
    try {
      await fetch(`${BACKEND_URL}/wish-list/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Erro ao remover item da wishlist:', error);
      throw error;
    }
  },
};
