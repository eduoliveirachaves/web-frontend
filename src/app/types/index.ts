export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;
  cep: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAddressDto {
  userId: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  cep: string;
}

export interface UpdateAddressDto {
  street?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  cep?: string;
}

export interface Rating {
  id: string;
  rate: number;
  comment?: string;
  userId: string;
  productId: string;
  user?: {
    name: string;
  };
  createdAt: string;
}
