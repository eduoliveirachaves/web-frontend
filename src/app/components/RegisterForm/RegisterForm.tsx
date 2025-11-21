'use client';

import React, { useState } from 'react';
import { useRouter } from "next/navigation";


const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Simulação do cadastro
    console.log('Dados do Cadastro:', formData);
    alert('Cadastro simulado com sucesso! Verifique o console.');
    router.push("/login");

  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar Nova Conta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200 mt-2"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;