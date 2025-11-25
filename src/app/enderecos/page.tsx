'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { addressService } from '@/app/services/addressService';
import { Address, CreateAddressDto, UpdateAddressDto } from '@/app/types';
import { MapPin } from 'lucide-react';

export default function EnderecosPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    cep: '',
  });

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      loadAddresses();
    }
  }, [user, token]);

  const loadAddresses = async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const data = await addressService.findAllByUser(token, user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        city: address.city,
        state: address.state,
        cep: address.cep,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        cep: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    try {
      if (editingAddress) {
        await addressService.update(token, editingAddress.id, formData as UpdateAddressDto);
      } else {
        await addressService.create(token, {
          ...formData,
          userId: user.id,
        } as CreateAddressDto);
      }
      handleCloseModal();
      loadAddresses();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar endereço');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Deseja realmente excluir este endereço?')) return;

    try {
      await addressService.delete(token, id);
      loadAddresses();
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir endereço');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow container mx-auto p-8">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <AccountSidebar />

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <MapPin className="text-blue-600" size={28} /> Endereços
              </h1>
              <p className="text-gray-600">Gerencie seus endereços de entrega</p>
            </div>

            <div className="mb-4">
              <button
                onClick={() => handleOpenModal()}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <span className="text-xl">+</span> CADASTRAR NOVO ENDEREÇO
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">Nenhum endereço cadastrado.</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Cadastrar Primeiro Endereço
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">ENDEREÇO</h3>
                      <div className="space-y-1 text-gray-700">
                        <p>{address.street}</p>
                        <p>
                          Número {address.number}
                          {address.complement ? `, ${address.complement}` : ''}
                        </p>
                        <p>{address.city}</p>
                        <p>
                          CEP {address.cep} - {address.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-sm font-semibold">
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700 underline"
                      >
                        EXCLUIR
                      </button>
                      <button
                        onClick={() => handleOpenModal(address)}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        EDITAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua/Avenida *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="SC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value.replace(/\D/g, '') })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="88056682"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {editingAddress ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
