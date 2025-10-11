import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/layout";
import { VenueGallery } from "~/components/venues/venue-gallery";
import { VenueReviews } from "~/components/venues/venue-reviews";
import { VENUES } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface VenueDetailsPageProps {
  venueId: string;
}

export const VenueDetailsPage = ({ venueId }: VenueDetailsPageProps) => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const venue = VENUES.find((v) => v.id === parseInt(venueId));

  if (!venue) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Venue Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The venue you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/venues")}>Back to Venues</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow pb-6">
      {/* Header with Favorite Button */}
      <div className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          <Header
            title="Venue Details"
            onBack={() => navigate("/venues")}
            showBack={true}
          />
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-rose-600 -mt-8 mr-4"
          >
            <Heart
              className="h-7 w-7"
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div
        className="w-full h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${venue.image})` }}
      />

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Title & Location */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{venue.name}</h2>
          <p className="text-gray-600 text-lg">{venue.location}</p>
        </div>

        {/* Description */}
        <p className="text-base text-gray-700">{venue.description}</p>

        {/* Gallery */}
        <div>
          <h3 className="text-2xl font-bold mb-3">Gallery</h3>
          <VenueGallery gallery={venue.gallery} />
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Capacity</h3>
            <p className="text-gray-600">{venue.capacity}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Pricing</h3>
            <p className="text-gray-600">{venue.pricing}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Available Dates</h3>
            <p className="text-gray-600">Contact us for availability</p>
          </div>
        </div>

        {/* Reviews */}
        <VenueReviews
          rating={venue.rating}
          reviewCount={venue.reviewCount}
          reviews={venue.reviews}
        />
      </div>

      {/* Sticky Footer with CTA */}
      <div className="sticky bottom-0 bg-pink-50 border-t border-gray-200 px-6 py-4">
        <Button className="w-full h-12 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold shadow-lg">
          Request a Quote
        </Button>
      </div>
    </div>
  );
};
