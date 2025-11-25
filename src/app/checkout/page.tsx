'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressService } from '@/app/services/addressService';
import { Address } from '@/app/types';

export default function CheckoutPage() {
  const { cart, isLoading, clearLocalCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Estado para novo endereço
  const [newAddress, setNewAddress] = useState({
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      loadAddresses();
    }
  }, [user, token]);

  const loadAddresses = async () => {
    if (!user || !token) return;
    
    setLoadingAddresses(true);
    try {
      const data = await addressService.findAllByUser(token, user.id);
      setAddresses(data);
      

      if (data.length > 0 && !selectedAddressId) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlurCep = async () => {
    const cep = newAddress.cep.replace(/\D/g, '');

    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (!data.erro) {
          setNewAddress((prev) => ({
            ...prev,
            street: data.logradouro,
            city: data.localidade,
            state: data.uf,
          }));
          document.getElementById('number-input')?.focus();
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !token) return;

    try {
      const createdAddress = await addressService.create(token, {
        ...newAddress,
        userId: user.id,
      });
      
      setAddresses([...addresses, createdAddress]);
      setSelectedAddressId(createdAddress.id);
      setShowAddressForm(false);
      
      // Limpa o formulário
      setNewAddress({
        cep: '',
        street: '',
        number: '',
        city: '',
        state: '',
        complement: '',
      });
    } catch (error) {
      alert('Erro ao salvar endereço. Tente novamente.');
    }
  };

  const handleFinishOrder = async () => {
    if (!cart?.id) return;
    
    if (!selectedAddressId) {
      alert('Por favor, selecione um endereço de entrega.');
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${cart.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      });

      clearLocalCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Houve um problema ao finalizar o pedido. Tente novamente.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando informações...</div>;
  }

  // Se não tiver itens, não faz sentido estar no checkout
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800">Carrinho vazio</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar para a loja
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc, item) => {
    return acc + Number(item.unitPrice) * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Coluna da Esquerda: Endereço e Pagamento --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Card de Endereço */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Selecione seu endereço:
              </h2>

              {loadingAddresses ? (
                <p className="text-gray-500">Carregando endereços...</p>
              ) : (
                <>
                  {/* Lista de endereços */}
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                          selectedAddressId === address.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 accent-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {address.street}, {address.number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state}, CEP{' '}
                            {address.cep}
                          </p>
                          {address.complement && (
                            <p className="text-sm text-gray-500">{address.complement}</p>
                          )}
                        </div>
                        {selectedAddressId === address.id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              // Aqui você pode adicionar lógica para editar
                            }}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            ✏️
                          </button>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* button addnewadress */}
                  {!showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="w-full text-blue-600 font-medium py-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition"
                    >
                      CADASTRAR NOVO ENDEREÇO
                    </button>
                  )}

                  {/* Form newadress*/}
                  {showAddressForm && (
                    <form onSubmit={handleSaveNewAddress} className="border-t pt-4 mt-4 space-y-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Novo Endereço</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                        <div className="relative">
                          <input
                            name="cep"
                            required
                            value={newAddress.cep}
                            onChange={handleNewAddressChange}
                            onBlur={handleBlurCep}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="00000-000"
                            maxLength={9}
                          />
                          {cepLoading && (
                            <span className="absolute right-3 top-2 text-xs text-blue-600">
                              Buscando...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                          <input
                            name="street"
                            required
                            value={newAddress.street}
                            onChange={handleNewAddressChange}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                          <input
                            id="number-input"
                            name="number"
                            required
                            value={newAddress.number}
                            onChange={handleNewAddressChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="123"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                          <input
                            name="city"
                            value={newAddress.city}
                            onChange={handleNewAddressChange}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                          <input
                            name="state"
                            value={newAddress.state}
                            onChange={handleNewAddressChange}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complemento (opcional)
                          </label>
                          <input
                            name="complement"
                            value={newAddress.complement}
                            onChange={handleNewAddressChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Apto, bloco, etc."
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                          Salvar Endereço
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* paymentcard*/}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Pagamento</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cartão de Crédito</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PIX</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="boleto"
                    checked={paymentMethod === 'boleto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Boleto Bancário</span>
                </label>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 h-fit">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                Resumo do Pedido
              </h2>

              {/* Lista compacta de itens */}
              <div className="space-y-2 mb-4 max-h-60 overflow-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate w-2/3">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-gray-600 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Valor dos Produtos:</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl text-blue-600 pt-4 border-t mt-4">
                  <span>Total a prazo:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  (em até <span className="font-semibold">10x de R$ {(subtotal / 10).toFixed(2)}</span> sem juros)
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinishOrder}
                disabled={!selectedAddressId}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                CONTINUAR
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition mt-3"
              >
                VOLTAR
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
