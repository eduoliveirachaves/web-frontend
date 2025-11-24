import { Rating } from '../types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://web-backend-sck9.onrender.com';

export const ratingService = {
  async getRatingsByProduct(productId: string): Promise<Rating[]> {
    const res = await fetch(`${API_URL}/ratings/product/${productId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  },

  async createRating(
    productId: string,
    userId: string,
    rate: number,
    comment: string,
    token: string,
  ) {
    const res = await fetch(`${API_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, userId, rate, comment }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao enviar avaliação');
    }
    return res.json();
  },
};
