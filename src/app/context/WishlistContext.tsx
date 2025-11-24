'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '@/app/services/wishlistService';
import { Product } from '@/app/types/';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>(null!);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  // Carrega wishlist quando user loga
  useEffect(() => {
    if (token && user) {
      wishlistService
        .getWishlist(token)
        .then((data) => setItems(data))
        .catch((err) => console.error('Failed to load wishlist', err));
    } else {
      setItems([]);
    }
  }, [token, user]);

  const addToWishlist = async (product: Product) => {
    if (!token) {
      alert('Você precisa estar logado para salvar itens!');
      return;
    }
    // evita duplicatas
    if (items.some((p) => p.id === product.id)) return;
    //update
    setItems((prev) => [...prev, product]);
    try {
      await wishlistService.addItem(token, product.id);
    } catch (error) {
      // Revert if fails
      setItems((prev) => prev.filter((p) => p.id !== product.id));
      console.error(error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!token) return;
    // guarda estado anterior para possível rollback
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      return next;
    });
    const previous = items;
    try {
      await wishlistService.removeItem(token, productId);
    } catch (error) {
      console.error(error);
      // rollback
      setItems(previous);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
