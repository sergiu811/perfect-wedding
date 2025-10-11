import React from "react";
import { Star } from "lucide-react";

interface Sweet {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onClick?: (sweet: Sweet) => void;
}

export const SweetCard = ({ sweet, onClick }: SweetCardProps) => {
  return (
    <div
      onClick={() => onClick?.(sweet)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${sweet.image})` }}
      />
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{sweet.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{sweet.shortDescription}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
          <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>
            {sweet.rating} ({sweet.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};
