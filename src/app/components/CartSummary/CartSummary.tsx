import React from 'react';
import CheckoutButton from '../CheckOutButton/CheckOutButton';
import { ShieldCheck, Truck } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shipping = 0 }) => {
  const total = subtotal + shipping;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              subtotal,
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Frete</span>
          <span className="text-green-600 font-medium">
            {shipping === 0
              ? 'Grátis'
              : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  shipping,
                )}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">
            ou em até 10x de{' '}
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              total / 10,
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <CheckoutButton />

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-green-600" />
            <span>Compra Segura</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck size={14} className="text-blue-600" />
            <span>Entrega Garantida</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
