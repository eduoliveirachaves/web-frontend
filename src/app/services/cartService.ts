import { Order } from '../types';

const API_URL = "https://web-backend-sck9.onrender.com";

export const cartService = {
  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${API_URL}/order/${orderId}`);
    if (!res.ok) throw new Error('Erro ao buscar carrinho');
    return res.json();
  },

  async createOrder(userId: string): Promise<Order> {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: "IN_CART", items: [] }),
    });
    return res.json();
  },

  async addItem(orderId: string, productId: string, quantity: number) {
    const res = await fetch(`${API_URL}/order/${orderId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    return res.json();
  },

  async updateItemQuantity(orderId: string, itemId: string, quantity: number) {
    return fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
  },

  async removeItem(orderId: string, itemId: string) {
    return fetch(`${API_URL}/order/${orderId}/items/${itemId}`, {
      method: 'DELETE',
    });
  },
};
