import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  shipping: number; // Frete
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shipping }) => {
  const total = subtotal + shipping;

  return (
    <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Frete</span>
          <span>R$ {shipping.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4 mt-2">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;