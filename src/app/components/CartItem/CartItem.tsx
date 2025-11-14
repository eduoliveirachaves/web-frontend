'use client'; 

import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/app/types'; 

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {

  const handleIncrease = () => {
    console.log('Botão + clicado para:', item.name);
  };

  const handleDecrease = () => {
    console.log('Botão - clicado para:', item.name);
  };

  const handleRemove = () => {
    console.log('Botão Remover clicado para:', item.name);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">

      <div className="relative w-20 h-20 flex-shrink-0">
        <Image 
          src={item.imageUrl} 
          alt={item.name} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-lg" 
        />
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleDecrease} 
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button 
          onClick={handleIncrease} 
          className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right font-semibold text-gray-800">
        R$ {(item.price * item.quantity).toFixed(2)}
      </div>

      <button 
        onClick={handleRemove} 
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Remover
      </button>
    </div>
  );
};

export default CartItem;