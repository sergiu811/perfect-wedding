import React from "react";

interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: string;
  image: string;
  priceRange: string;
  style: string;
}

interface VenueCardProps {
  venue: Venue;
  onClick?: (venue: Venue) => void;
}

export const VenueCard = ({ venue, onClick }: VenueCardProps) => (
  <div
    onClick={() => onClick?.(venue)}
    className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
  >
    <div
      className="aspect-video w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
      style={{ backgroundImage: `url(${venue.image})` }}
    />
    <div className="p-5">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h2>
      <p className="text-rose-600/70 text-sm mb-0.5">{venue.location}</p>
      <p className="text-rose-600/70 text-sm">{venue.capacity}</p>
    </div>
  </div>
);
