import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/layout";
import { VenueGallery } from "~/components/venues/venue-gallery";
import { VenueReviews } from "~/components/venues/venue-reviews";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface VenueDetailsPageProps {
  venueId: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[] | null;
  price_min: number | null;
  price_max: number | null;
  rating: number | null;
  review_count: number | null;
  specific_fields: any;
  packages: any;
  tags: string[] | null;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const VenueDetailsPage = ({ venueId }: VenueDetailsPageProps) => {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${venueId}`);

        if (!response.ok) {
          throw new Error("Failed to load venue");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching venue:", err);
        setError(err.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [venueId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">🏛️</span>
          </div>
          <p className="text-gray-600 font-medium">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Venue Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The venue you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/venues")}>Back to Venues</Button>
        </div>
      </div>
    );
  }

  // Map service data to match original venue structure
  const venue = {
    id: service.id,
    name: service.title,
    location: service.location,
    description: service.description,
    image:
      service.images?.[0] ||
      service.vendor?.avatar_url ||
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
    gallery: (service.images || []).map((img, idx) => ({
      id: idx + 1,
      image: img,
      label: `Image ${idx + 1}`,
    })),
    venueType:
      service.specific_fields?.venueType ||
      service.specific_fields?.venue_type ||
      service.specific_fields?.style ||
      "Venue",
    capacity:
      typeof service.specific_fields?.capacity === "string"
        ? service.specific_fields.capacity
        : service.specific_fields?.capacity
          ? `${service.specific_fields.capacity} guests`
          : "Capacity not specified",
    locationType:
      service.specific_fields?.locationType ||
      service.specific_fields?.location_type ||
      service.specific_fields?.style ||
      "Indoor",
    cateringInHouse: service.specific_fields?.cateringInHouse || service.specific_fields?.catering_in_house || false,
    cateringExternal: service.specific_fields?.cateringExternal || service.specific_fields?.catering_external || false,
    parking: service.specific_fields?.parking || false,
    accommodation: service.specific_fields?.accommodation || false,
    pricing:
      service.price_min && service.price_max
        ? `$${service.price_min.toLocaleString()} - $${service.price_max.toLocaleString()}`
        : service.price_min
          ? `From $${service.price_min.toLocaleString()}`
          : "Contact for pricing",
    menuPrice: service.specific_fields?.menuPrice || service.specific_fields?.menu_price || null,
    packages:
      service.packages && Array.isArray(service.packages)
        ? service.packages.map((pkg: any, idx: number) => ({
          name: pkg.name || `Package ${idx + 1}`,
          price: pkg.price || pkg.price_range || "Contact for pricing",
          description: pkg.description || "",
        }))
        : [],
    rating: service.rating || 0,
    reviewCount: service.review_count || 0,
    reviews: [], // Reviews would come from a separate API call
  };

  const handleContactClick = () => {
    if (!service || !service.vendor_id) {
      return;
    }

    // Navigate to contact form with vendor ID in path and other details as query params
    navigate(
      `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(venue.name)}&category=venue&serviceId=${service.id}`
    );
  };

  return (
    <div className="flex-grow pb-6 lg:pb-8">
      {/* Header with Favorite Button */}
      <div className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4 lg:px-8 pb-2 max-w-7xl mx-auto">
          <Header
            title="Venue Details"
            onBack={() => navigate("/venues")}
            showBack={true}
          />
          {profile?.role !== "vendor" && (
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
          )}
        </div>
      </div>

      {/* Hero Image */}
      <div
        className="w-full h-64 lg:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${venue.image})` }}
      />

      {/* Content */}
      <div className="p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
        {/* Title & Location */}
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
            {venue.name}
          </h2>
          <p className="text-gray-600 text-lg lg:text-xl">{venue.location}</p>
        </div>

        {/* Description */}
        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
          {venue.description}
        </p>

        {/* Vendor Profile Section */}
        {service.vendor && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              About the Venue
            </h3>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: service.vendor.avatar_url
                    ? `url(${service.vendor.avatar_url})`
                    : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Venue")})`,
                }}
              />
              <div className="flex-1">
                <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                  {service.vendor.business_name || venue.name}
                </h4>
                <p className="text-sm lg:text-base text-gray-600">
                  Venue Provider
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tags/Features */}
        {service.tags && service.tags.length > 0 && (
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              Features & Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-rose-600/10 text-rose-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {venue.gallery.length > 0 && (
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
              Gallery
            </h3>
            <VenueGallery gallery={venue.gallery} />
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Venue Type */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Venue Type
            </h3>
            <p className="text-gray-600 lg:text-lg">
              {venue.venueType || "Ballroom"}
            </p>
          </div>

          {/* Capacity */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Capacity
            </h3>
            <p className="text-gray-600 lg:text-lg">{venue.capacity}</p>
          </div>

          {/* Location Type */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Location Type
            </h3>
            <p className="text-gray-600 lg:text-lg">
              {venue.locationType || "Indoor"}
            </p>
          </div>

          {/* Catering Options */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
              Catering Options
            </h3>
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
                  <span className="text-gray-600">
                    External catering allowed
                  </span>
                </div>
              )}
              {service.specific_fields?.cateringNone && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-600">No catering</span>
                </div>
              )}
              {!venue.cateringInHouse && !venue.cateringExternal && !service.specific_fields?.cateringNone && (
                <p className="text-gray-600">Contact vendor for catering options</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
              Amenities
            </h3>
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

          {/* Facilities */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
              Facilities
            </h3>
            <div className="space-y-2">
              {service.specific_fields?.facilityAC && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Air Conditioning</span>
                </div>
              )}
              {service.specific_fields?.facilityWaiters && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Waiters/Service Staff</span>
                </div>
              )}
              {service.specific_fields?.facilityTablesChairs && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Tables & Chairs</span>
                </div>
              )}
              {service.specific_fields?.facilitySoundSystem && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Sound System</span>
                </div>
              )}
              {service.specific_fields?.facilityWiFi && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">WiFi</span>
                </div>
              )}
              {service.specific_fields?.facilityGenerator && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Generator/Backup Power</span>
                </div>
              )}
              {service.specific_fields?.facilityDanceFloor && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Dance Floor</span>
                </div>
              )}
              {service.specific_fields?.facilityStage && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Stage/Platform</span>
                </div>
              )}
              {!service.specific_fields?.facilityAC &&
                !service.specific_fields?.facilityWaiters &&
                !service.specific_fields?.facilityTablesChairs &&
                !service.specific_fields?.facilitySoundSystem &&
                !service.specific_fields?.facilityWiFi &&
                !service.specific_fields?.facilityGenerator &&
                !service.specific_fields?.facilityDanceFloor &&
                !service.specific_fields?.facilityStage && (
                  <p className="text-gray-600">Contact vendor for facilities</p>
                )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Pricing
            </h3>
            <p className="text-gray-600 lg:text-lg">{venue.pricing}</p>
            {venue.menuPrice && (
              <p className="text-sm text-gray-500 mt-1">
                Menu: ${venue.menuPrice} per person
              </p>
            )}
          </div>

          {/* Available Dates */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
              Available Dates
            </h3>
            <p className="text-gray-600 lg:text-lg">
              Contact us for availability
            </p>
          </div>
        </div>

        {/* Packages */}
        {venue.packages && venue.packages.length > 0 && (
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
              Packages
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {venue.packages.map((pkg: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-5 lg:p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:border-rose-300 transition-all"
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
      {profile?.role !== "vendor" && (
        <div className="sticky bottom-0 bg-pink-50 border-t border-gray-200 px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() =>
                  navigate(`/vendor-public-profile/${service.vendor_id}`)
                }
                variant="outline"
                className="h-12 lg:h-14 px-5 rounded-xl border-2 border-rose-600 text-rose-600 hover:bg-rose-50 text-lg lg:text-xl font-bold"
              >
                View Profile
              </Button>
              <Button
                onClick={handleContactClick}
                className="h-12 lg:h-14 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-lg lg:text-xl font-bold shadow-lg"
              >
                Contact Vendor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
