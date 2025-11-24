const API_URL = 'https://web-backend-sck9.onrender.com'; // TODO: Não está comunicando com o backend, provavelmente por causa do CORS. Verificar depois.

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

  // Atualiza o perfil do usuário autenticado
  async updateProfile(token: string, data: Partial<{ name: string; email: string; age: number }>) {
    const res = await fetch(`${API_URL}/user/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Falha ao atualizar perfil');
    }
    return res.json();
  },
};
