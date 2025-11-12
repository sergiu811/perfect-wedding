import React from "react";
import { Star, Sparkles } from "lucide-react";

interface Decoration {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags?: string[];
  styles?: string[];
  price_min?: number;
  price_max?: number;
}

interface DecorationCardProps {
  decoration: Decoration;
  onClick?: (decoration: Decoration) => void;
}

export const DecorationCard = ({
  decoration,
  onClick,
}: DecorationCardProps) => {
  const priceRange =
    decoration.price_min && decoration.price_max
      ? `$${decoration.price_min.toLocaleString()} - $${decoration.price_max.toLocaleString()}`
      : decoration.price_min
        ? `From $${decoration.price_min.toLocaleString()}`
        : null;

  const displayTags = decoration.tags || decoration.styles || [];

  return (
    <div
      onClick={() => onClick?.(decoration)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div
        className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${decoration.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-semibold text-gray-900">Decorations</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
            {decoration.name}
          </h3>
          <p className="text-sm lg:text-base text-gray-600 mt-2 line-clamp-2">
            {decoration.shortDescription}
          </p>
        </div>

        {/* Tags/Styles */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-rose-600/10 text-rose-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {displayTags.length > 3 && (
              <span className="text-xs text-gray-500">+{displayTags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span className="text-sm font-semibold text-gray-900">
              {decoration.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({decoration.reviewCount})</span>
          </div>
          {priceRange && (
            <span className="text-sm font-semibold text-rose-600">{priceRange}</span>
          )}
        </div>
      </div>
    </div>
  );
};
