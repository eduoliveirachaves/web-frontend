'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import {useRouter, useSearchParams} from 'next/navigation';

const LoginForm: React.FC = () => {
	const { login } = useAuth();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// pegar o email do register
	useEffect(() => {
		const emailFromRegister = searchParams.get('email');
		if (emailFromRegister) {
			setEmail(emailFromRegister);
			// limpa a url
			router.replace('/login');
		}
	}, [searchParams, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação da lógica de login
    console.log('Tentativa de Login:', { email, password });
    alert('Login simulado! Verifique o console.');
    router.push("/");
  };

	return (
		<div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
			<h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acessar Conta</h2>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
						E-mail
					</label>
					<input
						id="login-email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="seu@email.com"
						className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
						required
					/>
				</div>

				<div>
					<label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
						Senha
					</label>
					<input
						id="login-password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
				>
					{loading ? 'Entrando...' : 'Entrar'}
				</button>
			</form>

			<p className="text-sm text-gray-600 mt-4 text-center">
				Não tem uma conta?{' '}
				<Link href="/register" className="text-blue-600 hover:underline">
					Cadastre-se
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
