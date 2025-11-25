import { Order } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

export const orderService = {
  async getMyOrders(userId: string, token: string): Promise<Order[]> {
    try {
      const res = await fetch(`${API_URL}/order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Falha ao buscar pedidos');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      return [];
    }
  },

  async getOrderById(orderId: string, token: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return null;
    }
  },
};
