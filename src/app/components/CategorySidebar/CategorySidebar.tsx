import React from 'react';
import Link from 'next/link';
import { Category } from '@/app/types';

interface CategorySidebarProps {
  categories: Category[];
  activeSlug?: string;
}
const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, activeSlug }) => {
  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Categorias</h3>
      <nav>
        <ul className="space-y-2">
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className={`block transition ${
                    isActive
                      ? 'text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md'
                      : 'text-gray-600 hover:text-blue-600 hover:font-semibold px-2 py-1'
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default CategorySidebar;
