import { Order } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const cartService = {
  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_URL}/order/${orderId}`);
    if (!res.ok) throw new Error('Erro ao buscar carrinho');
    return res.json();
  },

  async createOrder(userId: string): Promise<Order> {
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
  },

  async addItem(orderId: string, productId: string, quantity: number) {
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
  },

  async updateItemQuantity(orderId: string, itemId: string, quantity: number) {
    const res = await fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar item');
    return res.json();
  },

  async removeItem(orderId: string, itemId: string) {
    const res = await fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao remover item');
  },

  async getMyOrders(userId: string, token: string) {
    const res = await fetch(`${API_URL}/order/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  },
};
