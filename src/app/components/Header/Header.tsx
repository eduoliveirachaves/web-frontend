'use client';

import React from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar/SearchBar';

const Header: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Buscando por:', query);
  };

  return (
    <header className="w-full bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          🛒 E-commerce
        </Link>
        
        <div className="w-full md:w-1/2">
          <SearchBar onSearch={handleSearch} placeholder="Buscar produtos..." />
        </div>
        
        <nav className="flex gap-4">
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">
            Categorias
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-gray-900">
            Carrinho
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;