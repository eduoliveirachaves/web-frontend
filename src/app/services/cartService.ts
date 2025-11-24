import { Order } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

export const cartService = {
  async getOrder(orderId: string): Promise<Order> {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}`);
      if (!res.ok) throw new Error('Erro ao buscar carrinho');
      return res.json();
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      throw new Error('Não foi possível carregar o carrinho.');
    }
  },

  async createOrder(userId: string): Promise<Order> {
    try {
      const res = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'IN_CART', items: [] }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar pedido');
      }
      return res.json();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error('Não foi possível criar o carrinho. Verifique se o backend está rodando.');
    }
  },

  async addItem(orderId: string, productId: string, quantity: number) {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Erro detalhado do backend:', errorData);
        throw new Error(errorData.message || `Erro ${res.status}: Falha ao adicionar item`);
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  },

  async updateItemQuantity(orderId: string, itemId: string, quantity: number) {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar item');
      return res.json();
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  },

  async removeItem(orderId: string, itemId: string) {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao remover item');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  },

  async getMyOrders(userId: string, token: string) {
    try {
      const res = await fetch(`${API_URL}/order/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.warn('Erro ao buscar pedidos do usuário:', error);
      return [];
    }
  },
};
