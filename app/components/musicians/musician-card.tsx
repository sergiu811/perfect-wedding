import React from "react";
import { Star } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Musician {
  id: number;
  type: string;
  name: string;
  shortDescription: string;
  rating: number;
  reviewCount: number;
  image: string;
}

interface MusicianCardProps {
  musician: Musician;
  onClick?: (musician: Musician) => void;
}

export const MusicianCard = ({ musician, onClick }: MusicianCardProps) => {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-rose-600">
          <Star className="w-4 h-4 fill-rose-600" />
          <p>
            {musician.rating} ({musician.reviewCount} reviews)
          </p>
        </div>
        <h2 className="mt-1 text-lg font-bold text-gray-900">
          {musician.name}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {musician.shortDescription}
        </p>
        <Button
          onClick={() => onClick?.(musician)}
          className="mt-4 rounded-full bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          View Profile
        </Button>
      </div>
      <div
        className="aspect-square w-28 flex-shrink-0 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${musician.image})` }}
      />
    </div>
  );
};
