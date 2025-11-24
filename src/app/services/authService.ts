const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-backend-sck9.onrender.com';

export const authService = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Falha no login');
    return res.json();
  },

  async register(userData: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Falha no cadastro');
    }
    return res.json();
  },

  async getMe(token: string) {
    const res = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    return res.json();
  },

  // Atualiza o perfil do usuário autenticado (usa PATCH /user/me conforme backend NestJS)
  async updateProfile(
    token: string,
    data: Partial<{ name: string; email: string; age: number; password: string }>,
  ) {
    // Filtra apenas campos definidos para evitar enviar undefined
    const payload: Record<string, any> = {};
    ['name', 'email', 'age', 'password'].forEach((key) => {
      const value = (data as any)[key];
      if (value !== undefined && value !== '') payload[key] = value;
    });

    const res = await fetch(`${API_URL}/user/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao atualizar perfil');
    }
    return res.json();
  },
};
