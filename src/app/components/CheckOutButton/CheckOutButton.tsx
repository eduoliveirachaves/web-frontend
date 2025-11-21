'use client'; 

import React from 'react';
import Link from 'next/link';

const CheckoutButton: React.FC = () => {
  return (
    <Link 
      href="/checkout"
      className="block w-full bg-green-600 text-white text-center py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
    >
      Finalizar Compra
    </Link>
  );
};

export default CheckoutButton;