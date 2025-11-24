import React from 'react';
import Link from 'next/link';
import { Category } from '@/app/types';

interface CategoryProps {
  category: Category;
}

// Card visual de categoria
const CategoryCard: React.FC<CategoryProps> = ({ category }) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition flex flex-col"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm group-hover:scale-105 transition">
          {category.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition">
          {category.name}
        </h3>
      </div>
      <p className="mt-3 text-sm text-gray-500 line-clamp-2">
        Explore produtos em {category.name}. Clique para ver mais.
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
        Ver categoria
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </Link>
  );
};

export default CategoryCard;
