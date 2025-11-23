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
};
