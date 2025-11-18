'use client';

import React from 'react';
import Image from 'next/image';

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
      const confirmDelete = window.confirm("Deseja remover este item?");
      if (confirmDelete) onRemove(item.id);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm mb-4">
      
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image 
          src={item.imageUrl || '/window.svg'} 
          alt={item.name} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-md border" 
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-gray-500 text-sm">Valor un.: R$ {item.price.toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button 
            onClick={handleDecrease}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
            disabled={false} 
          >
            -
          </button>
          <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
          <button 
            onClick={handleIncrease}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 transition"
          >
            +
          </button>
        </div>

        <div className="text-right">
            <p className="font-bold text-blue-600">
                R$ {(item.price * item.quantity).toFixed(2)}
            </p>
            <button 
                onClick={() => onRemove(item.id)}
                className="text-xs text-red-500 hover:text-red-700 underline mt-1"
            >
                Remover
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;