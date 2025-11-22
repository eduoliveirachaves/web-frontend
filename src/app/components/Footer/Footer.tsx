import React from 'react';

const Footer: React.FC = () => {
  const team =
    'Eduardo Chaves, Guilherme Mulatinho, Felipe Probst, Matheus Piccoli, Matheus Pereira';

  return (
    <footer className="w-full bg-gray-100 p-6 mt-16 border-t">
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} E-commerce. Todos os direitos reservados.</p>
        <p className="text-sm mt-2">Desenvolvido por: {team}</p>
      </div>
    </footer>
  );
};

export default Footer;
