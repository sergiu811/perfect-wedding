import React from "react";

interface GalleryImage {
  id: number;
  image: string;
  label: string;
}

interface VenueGalleryProps {
  gallery: GalleryImage[];
}

export const VenueGallery = ({ gallery }: VenueGalleryProps) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
      {gallery.map((item) => (
        <div key={item.id} className="flex-shrink-0 w-40 space-y-2">
          <div
            className="w-full aspect-square bg-cover bg-center rounded-xl shadow-md"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <p className="text-center font-medium text-sm text-gray-900">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};
