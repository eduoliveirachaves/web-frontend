'use client'; 

import React from 'react';

const CheckoutButton: React.FC = () => {

  const handleCheckout = () => {
    console.log('Iniciando processo de checkout...');
  };

  return (
    <button 
      onClick={handleCheckout}
      className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
    >
      Finalizar Compra
    </button>
  );
};

export default CheckoutButton;