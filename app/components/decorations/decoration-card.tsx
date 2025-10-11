import React from "react";
import { Star } from "lucide-react";

interface Decoration {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
}

interface DecorationCardProps {
  decoration: Decoration;
  onClick?: (decoration: Decoration) => void;
}

export const DecorationCard = ({
  decoration,
  onClick,
}: DecorationCardProps) => {
  return (
    <div
      onClick={() => onClick?.(decoration)}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${decoration.image})` }}
      />
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{decoration.name}</h3>
        <p className="text-sm text-gray-600 mt-2">
          {decoration.shortDescription}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
          <Star className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>
            {decoration.rating} ({decoration.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};
