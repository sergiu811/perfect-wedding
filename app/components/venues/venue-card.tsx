import React from "react";
import { Star, MapPin, Users } from "lucide-react";

interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: string;
  image: string;
  priceRange: string;
  style: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

interface VenueCardProps {
  venue: Venue;
  onClick?: (venue: Venue) => void;
}

export const VenueCard = ({ venue, onClick }: VenueCardProps) => (
  <div
    onClick={() => onClick?.(venue)}
    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
  >
    {/* Hero Image */}
    <div
      className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${venue.image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <span className="text-xs font-semibold text-gray-900">
          {venue.style}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 lg:p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
          {venue.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span className="line-clamp-1">{venue.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Users className="w-4 h-4 text-rose-600" />
          <span>{venue.capacity}</span>
        </div>
      </div>

      {/* Tags */}
      {venue.tags && venue.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {venue.tags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-rose-600/10 text-rose-600 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {venue.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{venue.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Info Row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {/* Rating */}
          {venue.rating && venue.rating !== 0.0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span className="text-sm font-semibold text-gray-900">
                {venue.rating.toFixed(1)}
              </span>
              {venue.reviewCount !== undefined && (
                <span className="text-xs text-gray-500">
                  ({venue.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          <span className="text-sm font-semibold text-rose-600">
            {venue.priceRange}
          </span>
        </div>
      </div>
    </div>
  </div>
);
