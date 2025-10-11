import React from "react";
import { Star } from "lucide-react";

interface Invitation {
  id: number;
  name: string;
  vendor: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
}

interface InvitationCardProps {
  invitation: Invitation;
  onClick?: (invitation: Invitation) => void;
}

export const InvitationCard = ({
  invitation,
  onClick,
}: InvitationCardProps) => {
  return (
    <div
      onClick={() => onClick?.(invitation)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${invitation.image})` }}
      />
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{invitation.name}</h3>
        <p className="text-sm font-medium text-gray-800 mt-1">
          by {invitation.vendor}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {invitation.shortDescription}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
          <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>
            {invitation.rating} ({invitation.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};
