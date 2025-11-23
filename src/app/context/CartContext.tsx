"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Order, Product } from "@/app/types";
import { cartService } from "@/app/services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Order | null;
  isLoading: boolean;
  addToCart: (product: Product) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>(null!);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth(); // Pega usuário real
  const [cart, setCart] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Se tiver usuário logado, usa o ID dele.
  const userId = user?.id;

  useEffect(() => {
    const savedOrderId = localStorage.getItem("my_order_id");

    // Só carrega se tivermos um usuário E um ID de pedido salvo
    if (savedOrderId && userId) {
      loadCart(savedOrderId);
    } else {
      // Se o usuário deslogar, limpamos o estado do carrinho visualmente
      setCart(null);
    }
  }, [userId]); // Recarrega quando o usuário muda (login/logout)

  const loadCart = async (orderId: string) => {
    setIsLoading(true);
    try {
      const orderData = await cartService.getOrder(orderId);
      console.log("🛒 Dados do carrinho:", orderData);
      setCart(orderData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      // Se o pedido não for encontrado (ex: foi pago ou deletado), limpa o localStorage
      localStorage.removeItem("my_order_id");
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!userId) {
      alert("Por favor, faça login para adicionar produtos ao carrinho.");
      return;
    }

    try {
      let currentOrderId = cart?.id;

      if (!currentOrderId) {
        // Tenta recuperar do localStorage primeiro caso o state esteja vazio mas o ID exista
        const storedId = localStorage.getItem("my_order_id");

        if (storedId) {
          currentOrderId = storedId;
        } else {
          const newOrder = await cartService.createOrder(userId);
          currentOrderId = newOrder.id;
          localStorage.setItem("my_order_id", currentOrderId);
          setCart(newOrder);
        }
      }

      await cartService.addItem(currentOrderId, product.id, 1);

      await loadCart(currentOrderId);
      alert('Produto adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      alert('Erro ao adicionar produto. Tente novamente.');
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
    <CartContext.Provider
      value={{ cart, isLoading, addToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
