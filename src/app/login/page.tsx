import Image from 'next/image';
import LoginForm from '../components/LoginForm/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-2xl p-10 border border-gray-100">
        {/* Ícone no topo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/cart-1-svgrepo-com.svg"
            alt="Ícone"
            width={60}
            height={60}
            className="opacity-90"
          />
        </div>

        {/* Títulos */}
        <h1 className="text-3xl font-bold text-center text-gray-800">Bem-vindo de volta</h1>

        <p className="text-gray-600 text-center mt-2 mb-8">
          Acesse sua conta usando seu e-mail e senha.
        </p>

        {/* Formulário */}
        <LoginForm />
      </div>
    </main>
  );
}
