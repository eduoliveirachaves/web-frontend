'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Product } from '@/app/types';
import { cartService } from '@/app/services/cartService';

interface CartContextType {
  cart: Order | null;
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>(null!);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const MOCK_USER_ID = "user-id-exemplo-uuid"; 

  useEffect(() => {
    const savedOrderId = localStorage.getItem('my_order_id');
    if (savedOrderId) {
      loadCart(savedOrderId);
    }
  }, []);

  const loadCart = async (orderId: string) => {
    setIsLoading(true);
    try {
      const orderData = await cartService.getOrder(orderId);
      setCart(orderData);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      let currentOrderId = cart?.id;

      if (!currentOrderId) {
        const newOrder = await cartService.createOrder(MOCK_USER_ID);
        currentOrderId = newOrder.id;
        localStorage.setItem('my_order_id', currentOrderId); 
        setCart(newOrder); 
      }

      await cartService.addItem(currentOrderId, product.id, 1);
      
      await loadCart(currentOrderId);
      alert("Produto adicionado!");
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert("Erro ao adicionar produto.");
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

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};