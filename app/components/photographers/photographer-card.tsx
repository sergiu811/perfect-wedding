import React from "react";
import { Star, MapPin, DollarSign } from "lucide-react";

interface Photographer {
  id: number;
  type: string;
  name: string;
  specialties: string;
  rating: number;
  reviewCount?: number;
  image: string;
  portfolio: any[];
  pricing: string;
  description: string;
  location?: string;
  tags?: string[];
}

interface PhotographerCardProps {
  photographer: Photographer;
  onClick?: (photographer: Photographer) => void;
}

export const PhotographerCard = ({
  photographer,
  onClick,
}: PhotographerCardProps) => {
  return (
    <div
      onClick={() => onClick?.(photographer)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div
        className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${photographer.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {photographer.portfolio && photographer.portfolio.length > 1 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-900">
            +{photographer.portfolio.length - 1} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div>
          <p className="text-xs lg:text-sm text-rose-600 font-semibold mb-1">
            {photographer.type}
          </p>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
            {photographer.name}
          </h3>
          <p className="text-sm lg:text-base text-gray-600 mt-1 line-clamp-2">
            {photographer.specialties}
          </p>
        </div>

        {/* Description */}
        {photographer.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {photographer.description}
          </p>
        )}

        {/* Tags */}
        {photographer.tags && photographer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {photographer.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-rose-600/10 text-rose-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {photographer.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{photographer.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span className="text-sm font-semibold text-gray-900">
                {photographer.rating.toFixed(1)}
              </span>
              {photographer.reviewCount !== undefined && (
                <span className="text-xs text-gray-500">
                  ({photographer.reviewCount})
                </span>
              )}
            </div>

            {/* Pricing */}
            {photographer.pricing && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-rose-600" />
                <span className="font-medium">{photographer.pricing}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
