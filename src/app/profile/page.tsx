'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import AccountSidebar from '@/app/components/AccountSidebar/AccountSidebar';
import { User, Mail, Calendar, Lock, Save, Loader2 } from 'lucide-react';

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
        age: user.age ? String(user.age) : '',
        password: '',
      });
    }
  }, [user]);

  const disabled = useMemo(() => saving || !token, [saving, token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const payload: any = { name: form.name, email: form.email };
      if (form.age) payload.age = Number(form.age);
      if (form.password) payload.password = form.password;

      await updateProfile(payload);
      setSuccess(true);
      setForm((prev) => ({ ...prev, password: '' })); // Limpa senha após salvar
    } catch (err: any) {
      setError(err?.message || 'Não foi possível atualizar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <AccountSidebar />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h1 className="text-2xl font-bold text-gray-800">Meus Dados</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Gerencie suas informações pessoais e de segurança.
                </p>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <span className="font-bold">Erro:</span> {error}
                  </div>
                )}
                {success && (
                  <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                    <span className="font-bold">Sucesso!</span> Seus dados foram atualizados.
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <User size={16} className="text-gray-400" />
                        Nome Completo
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Seu nome"
                        className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="age"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Calendar size={16} className="text-gray-400" />
                        Idade
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min={1}
                        value={form.age}
                        onChange={onChange}
                        placeholder="Ex: 25"
                        className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Mail size={16} className="text-gray-400" />
                        E-mail
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Usaremos este e-mail para comunicação sobre seus pedidos.
                      </p>
                    </div>

                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Segurança</h3>
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <Lock size={16} className="text-gray-400" />
                        Nova Senha
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder="Deixe em branco para manter a atual"
                        className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-gray-50 focus:bg-white"
                      />
                      <p className="text-xs text-gray-500">
                        Preencha apenas se desejar alterar sua senha atual.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={disabled}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed min-w-[160px]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
