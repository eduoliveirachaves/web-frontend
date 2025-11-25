'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Star, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const AccountSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: 'Visão Geral',
      href: '/minha-conta',
      icon: LayoutDashboard,
    },
    {
      label: 'Meus Dados',
      href: '/profile',
      icon: User,
    },
    {
      label: 'Meus Pedidos',
      href: '/orders',
      icon: Package,
    },
    {
      label: 'Endereços',
      href: '/enderecos',
      icon: MapPin,
    },
    {
      label: 'Avaliações',
      href: '/avaliacoes',
      icon: Star,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Minha Conta</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-2 border-t border-gray-100 mt-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default AccountSidebar;
