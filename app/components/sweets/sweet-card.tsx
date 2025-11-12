import React from "react";
import { Star, Cake } from "lucide-react";

interface Sweet {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags?: string[];
  price_min?: number;
  price_max?: number;
  specialty?: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onClick?: (sweet: Sweet) => void;
}

export const SweetCard = ({ sweet, onClick }: SweetCardProps) => {
  const priceRange =
    sweet.price_min && sweet.price_max
      ? `$${sweet.price_min.toLocaleString()} - $${sweet.price_max.toLocaleString()}`
      : sweet.price_min
        ? `From $${sweet.price_min.toLocaleString()}`
        : null;

  return (
    <div
      onClick={() => onClick?.(sweet)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div
        className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${sweet.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <Cake className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-semibold text-gray-900">Sweets</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
            {sweet.name}
          </h3>
          {sweet.specialty && (
            <p className="text-sm text-rose-600 font-medium mt-1">
              {sweet.specialty}
            </p>
          )}
          <p className="text-sm lg:text-base text-gray-600 mt-2 line-clamp-2">
            {sweet.shortDescription}
          </p>
        </div>

        {/* Tags */}
        {sweet.tags && sweet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sweet.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-rose-600/10 text-rose-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {sweet.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{sweet.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span className="text-sm font-semibold text-gray-900">
              {sweet.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({sweet.reviewCount})</span>
          </div>
          {priceRange && (
            <span className="text-sm font-semibold text-rose-600">{priceRange}</span>
          )}
        </div>
      </div>
    </div>
  );
};
