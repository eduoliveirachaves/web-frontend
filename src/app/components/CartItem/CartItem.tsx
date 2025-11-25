'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2, Package } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      // Optional: confirm before removing on quantity 0/1
      // For better UX, maybe just don't go below 1 here and let the remove button handle deletion
      // or keep the confirm behavior.
      const confirmDelete = window.confirm('Deseja remover este item?');
      if (confirmDelete) onRemove(item.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center bg-white group">
      {/* Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={32} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-between min-h-[6rem]">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500">
              Valor unitário:{' '}
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                item.price,
              )}
            </p>
          </div>
          <div className="text-right sm:hidden">
            <p className="font-bold text-blue-600 text-lg">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                item.price * item.quantity,
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-0">
          {/* Quantity Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                onClick={handleDecrease}
                className="p-2 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50"
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium text-gray-900 text-sm">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
              title="Remover item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Total Price (Desktop) */}
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="font-bold text-blue-600 text-xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                item.price * item.quantity,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
