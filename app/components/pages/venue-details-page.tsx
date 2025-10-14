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
          {/* Venue Type */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Venue Type</h3>
            <p className="text-gray-600">{venue.venueType || 'Ballroom'}</p>
          </div>

          {/* Capacity */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Capacity</h3>
            <p className="text-gray-600">{venue.capacity}</p>
          </div>

          {/* Location Type */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Location Type</h3>
            <p className="text-gray-600">{venue.locationType || 'Indoor'}</p>
          </div>

          {/* Catering Options */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Catering Options</h3>
            <div className="space-y-2">
              {venue.cateringInHouse && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  <span className="text-gray-600">In-house catering</span>
                </div>
              )}
              {venue.cateringExternal && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  <span className="text-gray-600">External catering allowed</span>
                </div>
              )}
              {!venue.cateringInHouse && !venue.cateringExternal && (
                <p className="text-gray-600">No catering available</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities</h3>
            <div className="space-y-2">
              {venue.parking && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Parking available</span>
                </div>
              )}
              {venue.accommodation && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Accommodation available</span>
                </div>
              )}
              {!venue.parking && !venue.accommodation && (
                <p className="text-gray-600">No additional amenities</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing</h3>
            <p className="text-gray-600">{venue.pricing}</p>
            {venue.menuPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Menu: ${venue.menuPrice} per person
              </p>
            )}
          </div>

          {/* Available Dates */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Available Dates</h3>
            <p className="text-gray-600">Contact us for availability</p>
          </div>
        </div>

        {/* Packages */}
        {venue.packages && venue.packages.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Packages</h3>
            <div className="space-y-4">
              {venue.packages.map((pkg: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm hover:border-rose-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        {pkg.name}
                      </h4>
                      <p className="text-2xl font-bold text-rose-600">
                        ${pkg.price}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                      Package {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {pkg.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <VenueReviews
          rating={venue.rating}
          reviewCount={venue.reviewCount}
          reviews={venue.reviews}
        />
      </div>

      {/* Sticky Footer with CTA */}
      <div className="sticky bottom-0 bg-pink-50 border-t border-gray-200 px-6 py-4">
        <Button 
          onClick={() => navigate(`/contact-vendor/${venue.id}?name=${encodeURIComponent(venue.name)}&category=venue`)}
          className="w-full h-12 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold shadow-lg"
        >
          Check Availability
        </Button>
      </div>
    </div>
  );
};
