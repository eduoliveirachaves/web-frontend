import React from 'react';
import CheckoutButton from '../CheckOutButton/CheckOutButton';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number; 
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shipping = 0 }) => {
  const total = subtotal + shipping;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Resumo do Pedido</h2>
      
      <div className="space-y-3 text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frete</span>
          <span className="text-green-600 font-medium">
            {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t mt-4">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
      <CheckoutButton />
    </div>
  );
};

export default CartSummary;