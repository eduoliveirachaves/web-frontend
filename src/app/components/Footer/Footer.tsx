'use client';

import React from 'react';

const Footer: React.FC = () => {
  const teamMembers = [
    'Eduardo Chaves',
    'Felipe Probst',
    'Guilherme Mulatinho',
    'Matheus Pereira',
    'Matheus Piccoli',
  ];

  return (
    <footer className="w-full bg-gray-900 text-gray-400 mt-auto py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-bold text-white text-lg">MVP Market</span>
          <span>&copy; {new Date().getFullYear()} Todos os direitos reservados.</span>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
            Desenvolvido por
          </span>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-3 gap-y-1 text-xs">
            {teamMembers.map((member, index) => (
              <span key={member} className="hover:text-white transition-colors">
                {member}
                {index < teamMembers.length - 1 && <span className="text-gray-700 ml-3">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
