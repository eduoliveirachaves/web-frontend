import { Address, CreateAddressDto, UpdateAddressDto } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-backend-sck9.onrender.com';

export const addressService = {
  async create(token: string, data: CreateAddressDto): Promise<Address> {
    try {
      const res = await fetch(`${API_URL}/adress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao criar endereço');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  },

  async findAll(token: string): Promise<Address[]> {
    try {
      const res = await fetch(`${API_URL}/adress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar endereços');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      return [];
    }
  },

  async findAllByUser(token: string, userId: string): Promise<Address[]> {
    try {
      const res = await fetch(`${API_URL}/adress/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao buscar endereços do usuário');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao buscar endereços do usuário:', error);
      return [];
    }
  },

  async findOne(token: string, id: string): Promise<Address | null> {
    try {
      const res = await fetch(`${API_URL}/adress/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Endereço não encontrado');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  },

  async update(token: string, id: string, data: UpdateAddressDto): Promise<Address> {
    try {
      const res = await fetch(`${API_URL}/adress/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao atualizar endereço');
      }

      return res.json();
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw error;
    }
  },

  async delete(token: string, id: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/adress/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erro ao deletar endereço');
      }
    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
      throw error;
    }
  },
};
