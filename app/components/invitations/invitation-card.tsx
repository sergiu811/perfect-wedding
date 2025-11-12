import React from "react";
import { Star, Mail } from "lucide-react";

interface Invitation {
  id: number;
  name: string;
  vendor: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags?: string[];
  price_min?: number;
  price_max?: number;
}

interface InvitationCardProps {
  invitation: Invitation;
  onClick?: (invitation: Invitation) => void;
}

export const InvitationCard = ({
  invitation,
  onClick,
}: InvitationCardProps) => {
  const priceRange =
    invitation.price_min && invitation.price_max
      ? `$${invitation.price_min.toLocaleString()} - $${invitation.price_max.toLocaleString()}`
      : invitation.price_min
        ? `From $${invitation.price_min.toLocaleString()}`
        : null;

  return (
    <div
      onClick={() => onClick?.(invitation)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div
        className="h-48 lg:h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${invitation.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
          <Mail className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-semibold text-gray-900">Invitations</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-1">
            {invitation.name}
          </h3>
          <p className="text-sm font-medium text-rose-600 mt-1">
            by {invitation.vendor}
          </p>
          <p className="text-sm lg:text-base text-gray-600 mt-2 line-clamp-2">
            {invitation.shortDescription}
          </p>
        </div>

        {/* Tags */}
        {invitation.tags && invitation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {invitation.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-rose-600/10 text-rose-600 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {invitation.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{invitation.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span className="text-sm font-semibold text-gray-900">
              {invitation.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">({invitation.reviewCount})</span>
          </div>
          {priceRange && (
            <span className="text-sm font-semibold text-rose-600">{priceRange}</span>
          )}
        </div>
      </div>
    </div>
  );
};
