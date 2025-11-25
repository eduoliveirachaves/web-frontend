'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Product } from '@/app/types';
import { cartService } from '@/app/services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { useRouter, usePathname } from 'next/navigation';

interface CartContextType {
  cart: Order | null;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearLocalCart: () => void;
}

const CartContext = createContext<CartContextType>(null!);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      // Se não tem usuário logado, limpa o carrinho
      localStorage.removeItem('my_order_id');
      setCart(null);
      return;
    }

    const savedOrderId = localStorage.getItem('my_order_id');
    if (savedOrderId) {
      loadCart(savedOrderId);
    } else {
      setCart(null);
    }
  }, [userId]);

  const loadCart = async (orderId: string) => {
    if (!userId) {
      localStorage.removeItem('my_order_id');
      setCart(null);
      return;
    }

    setIsLoading(true);
    try {
      const orderData = await cartService.getOrder(orderId);


      if (orderData.status !== 'IN_CART' || orderData.userId !== userId) {
        localStorage.removeItem('my_order_id');
        setCart(null);
        return;
      }

      setCart(orderData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      localStorage.removeItem('my_order_id');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!userId) {
      showToast({
        message: 'Entre para adicionar produtos ao carrinho.',
        variant: 'info',
        action: {
          label: 'Entrar',
          onClick: () => router.push(`/login?next=${encodeURIComponent(pathname || '/')}`),
        },
      });
      return;
    }

    try {
      let currentOrderId = cart?.id;

      // 1. Ensure we have an Order ID
      if (!currentOrderId) {
        const storedId = localStorage.getItem('my_order_id');
        if (storedId) {
          currentOrderId = storedId;
        } else {
          const newOrder = await cartService.createOrder(userId);
          currentOrderId = newOrder.id;
          localStorage.setItem('my_order_id', currentOrderId);
          setCart(newOrder);
        }
      }

      // 2. Try to add the item
      await cartService.addItem(currentOrderId, product.id, quantity);

      // 3. Reload cart to show changes
      await loadCart(currentOrderId);
      showToast({
        message: 'Produto adicionado ao carrinho.',
        variant: 'success',
        action: { label: 'Ver carrinho', onClick: () => router.push('/cart') },
      });
    } catch (error: any) {
      console.error('Erro ao adicionar:', error);

      // === AUTO-FIX FOR THE "IN_CART" ERROR ===
      // If the backend says the order is not IN_CART, we create a new one and retry.
      if (
        error.message &&
        (error.message.includes('IN_CART') || error.message.includes('status'))
      ) {
        console.warn('Pedido antigo finalizado detectado. Criando novo pedido...');

        try {
          // Clear old ID
          localStorage.removeItem('my_order_id');
          setCart(null);

          // Create new order
          const newOrder = await cartService.createOrder(userId);
          const newOrderId = newOrder.id;
          localStorage.setItem('my_order_id', newOrderId);
          setCart(newOrder);

          // Retry adding the item to the new order
          await cartService.addItem(newOrderId, product.id, quantity);
          await loadCart(newOrderId);
          showToast({
            message: 'Produto adicionado ao carrinho. Novo carrinho criado.',
            variant: 'success',
            action: { label: 'Ver carrinho', onClick: () => router.push('/cart') },
          });
          return;
        } catch (retryError) {
          console.error('Falha ao recriar pedido:', retryError);
          showToast({
            message: 'Erro ao criar novo pedido. Tente recarregar a página.',
            variant: 'error',
          });
        }
      } else {
        showToast({
          message: `Erro: ${error.message || 'Falha ao adicionar ao carrinho.'}`,
          variant: 'error',
        });
      }
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return;
    await cartService.updateItemQuantity(cart.id, itemId, quantity);
    await loadCart(cart.id);
  };

  const removeItem = async (itemId: string) => {
    if (!cart) return;
    await cartService.removeItem(cart.id, itemId);
    await loadCart(cart.id);
  };

  const clearLocalCart = () => {
    localStorage.removeItem('my_order_id');
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{ cart, isLoading, addToCart, updateQuantity, removeItem, clearLocalCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
