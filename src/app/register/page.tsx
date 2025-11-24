import RegisterForm from '../components/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        {/* Lado de marketing / destaque */}
        <div className="hidden md:flex flex-col gap-6 pl-2">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800 leading-tight">
            Crie sua conta e aproveite uma experiência
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 bg-yellow-200 rotate-1 rounded-md" />
              <span className="relative font-bold text-indigo-700"> personalizada</span>
            </span>
            .
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Acompanhe pedidos, gerencie sua lista de desejos, receba recomendações e muito mais em
            uma plataforma simples e rápida.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
                1
              </span>
              <span>Cadastre-se com seus dados básicos em segundos.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
                2
              </span>
              <span>Personalize seu perfil e preferências.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
                3
              </span>
              <span>Comece a explorar os produtos e criar sua wishlist.</span>
            </li>
          </ul>
          <div className="pt-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-400 to-indigo-500 border border-white flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-pink-400 to-yellow-400 border border-white flex items-center justify-center text-white text-sm font-medium">
                B
              </div>
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-400 to-teal-500 border border-white flex items-center justify-center text-white text-sm font-medium">
                C
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Junte-se a outros usuários satisfeitos hoje.
            </p>
          </div>
        </div>
        {/* Card de registro */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-8 md:p-10 relative">
          <div className="absolute -top-4 -right-4 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl" />
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              Entrar
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
