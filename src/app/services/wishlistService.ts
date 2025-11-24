import { Product } from '@/app/types/';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const wishlistService = {
	// Todos os itens da wishlist
	async getWishlist(token: string): Promise<Product[]> {
		const res = await fetch(`${BACKEND_URL}/wish-list`, {
			headers: { Authorization: `Bearer ${token}` },
			cache: 'no-store',
		});
		if (!res.ok) return [];
		return res.json();
	},

	async addItem(token: string, productId: string): Promise<void> {
		await fetch(`${BACKEND_URL}/wish-list`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ productId }),
		});
	},

	async removeItem(token: string, productId: string): Promise<void> {
		await fetch(`${BACKEND_URL}/wish-list/${productId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` },
		});
	}
};