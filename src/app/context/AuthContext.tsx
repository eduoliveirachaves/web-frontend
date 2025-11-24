'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // opcional
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (
    data: Partial<{ name: string; email: string; age: number; password: string }>,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // verifica se tem token no localStorage e se o token eh valido
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      authService
        .getMe(storedToken)
        .then((userData: any) => setUser(userData))
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const data = await authService.login(email, pass);
      const token = data.token;

      localStorage.setItem('auth_token', token);
      setToken(token);

      const userData = await authService.getMe(token);
      setUser(userData);

      router.push('/');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (data: any) => {
    await authService.register(data);
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  // Atualiza o perfil no backend e sincroniza o estado local
  const updateProfile = async (
    data: Partial<{ name: string; email: string; age: number; password: string }>,
  ) => {
    if (!token) throw new Error('Usuário não autenticado');
    const updated = await authService.updateProfile(token, data);
    setUser((prev) => ({ ...(prev as User), ...updated }));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
