export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string; 
}
export interface OrderItem {
  id: string;
  productId: string;
  product: Product; // backend precisa incluir o produto aqui (include: { product: true })
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'IN_CART' | 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  totalAmount: number;
  items: OrderItem[];
}