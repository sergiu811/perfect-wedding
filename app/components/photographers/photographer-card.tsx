import React from "react";
import { Star } from "lucide-react";

interface Photographer {
  id: number;
  type: string;
  name: string;
  specialties: string;
  rating: number;
  image: string;
  portfolio: any[];
  pricing: string;
  description: string;
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
      className="flex items-stretch justify-between gap-4 rounded-xl bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex flex-[2_2_0px] flex-col justify-between">
        <div>
          <p className="text-sm text-gray-600">{photographer.type}</p>
          <p className="text-lg font-bold text-gray-900">{photographer.name}</p>
          <p className="text-sm text-gray-600">{photographer.specialties}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
          <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>{photographer.rating}</span>
        </div>
      </div>
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-1"
        style={{ backgroundImage: `url(${photographer.image})` }}
      />
    </div>
  );
};
