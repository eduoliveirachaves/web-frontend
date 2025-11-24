'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading, updateProfile, token } = useAuth();
  const router = useRouter();

  // Redireciona não autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login?next=/profile');
    }
  }, [isLoading, user, router]);

  const [form, setForm] = useState({ name: '', email: '', age: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Preenche inicial com dados do usuário (se disponíveis)
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age ? String(user.age) : '', // Ajuste para refletir idade do backend
        password: '',
      });
    }
  }, [user]);

  const disabled = useMemo(() => saving || !token, [saving, token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const payload: any = { name: form.name, email: form.email };
      if (form.age) payload.age = Number(form.age);
      if (form.password) payload.password = form.password; // Incluindo senha no payload

      // Comentário: updateProfile chama o backend e sincroniza o estado de usuário no contexto
      await updateProfile(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível atualizar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#F3F4F6] py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-semibold text-[#1F2937] mb-6">Meu Perfil</h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#E5E7EB] shadow-sm p-8">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Perfil atualizado com sucesso.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Idade (opcional)
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={1}
                value={form.age}
                onChange={onChange}
                placeholder="Ex: 25"
                className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nova Senha (opcional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Digite sua nova senha"
                className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </span>
                ) : (
                  'Salvar alterações'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="rounded-xl border border-[#2563EB] text-[#2563EB] px-5 py-3 text-sm font-medium hover:bg-[#EFF6FF] transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
