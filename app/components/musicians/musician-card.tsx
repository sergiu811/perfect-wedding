import React from "react";
import { Star, Music } from "lucide-react";

interface Musician {
  id: number;
  type: string;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags?: string[];
  genres?: string[];
  price_min?: number;
  price_max?: number;
}

interface MusicianCardProps {
  musician: Musician;
  onClick?: (musician: Musician) => void;
}

export const MusicianCard = ({ musician, onClick }: MusicianCardProps) => {
  const priceRange =
    musician.price_min && musician.price_max
      ? `$${musician.price_min.toLocaleString()} - $${musician.price_max.toLocaleString()}`
      : musician.price_min
        ? `From $${musician.price_min.toLocaleString()}`
        : null;

  const displayTags = musician.tags || musician.genres || [];

  return (
    <div
      onClick={() => onClick?.(musician)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div
        className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${musician.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <Music className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-semibold text-gray-900">{musician.type}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
            {musician.name}
          </h3>
          <p className="text-sm lg:text-base text-gray-600 mt-2 line-clamp-2">
            {musician.shortDescription}
          </p>
        </div>

        {/* Tags/Genres */}
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
              {musician.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({musician.reviewCount})</span>
          </div>
          {priceRange && (
            <span className="text-sm font-semibold text-rose-600">{priceRange}</span>
          )}
        </div>
      </div>
    </div>
  );
};
