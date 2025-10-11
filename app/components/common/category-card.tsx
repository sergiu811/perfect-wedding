import React from "react";

export interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => (
  <button
    onClick={() => onClick?.(category)}
    className="flex flex-col items-center gap-2 group"
    aria-label={`Browse ${category.name}`}
  >
    <div
      className="w-24 sm:w-32 md:w-40 lg:w-64 xl:w-96 aspect-square bg-cover bg-center rounded-2xl shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-active:scale-95"
      style={{ backgroundImage: `url(${category.image})` }}
    />
    <p className="text-xs sm:text-sm font-semibold text-gray-800 text-center leading-tight">
      {category.name}
    </p>
  </button>
);
