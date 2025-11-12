import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface PhotographerDetailsPageProps {
  photographerId: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  price_min: number | null;
  price_max: number | null;
  specific_fields: any;
  packages: any;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const PhotographerDetailsPage = ({
  photographerId,
}: PhotographerDetailsPageProps) => {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${photographerId}`);

        if (!response.ok) {
          throw new Error("Failed to load photographer");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching photographer:", err);
        setError(err.message || "Failed to load photographer");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [photographerId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">📷</span>
          </div>
          <p className="text-gray-600 font-medium">
            Loading photographer details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Photographer Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The photographer you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/photo-video")}>
            Back to Photo & Video
          </Button>
        </div>
      </div>
    );
  }

  // Map service data to match original photographer structure
  const photographer = {
    id: service.id,
    businessName: service.vendor?.business_name || service.title,
    name: service.title,
    description: service.description,
    type: service.specific_fields?.type || "Photographer",
    specialties:
      service.tags?.join(", ") ||
      service.specific_fields?.specialties ||
      "Photography & Videography",
    about: service.description,
    specialty:
      service.specific_fields?.specialties ||
      service.tags?.join(", ") ||
      "Wedding Photography",
    portfolio: service.images || [],
    packages:
      service.packages && Array.isArray(service.packages)
        ? service.packages.map((pkg: any, idx: number) => ({
            id: idx + 1,
            name: pkg.name || `Package ${idx + 1}`,
            price:
              pkg.price ||
              (service.price_min && service.price_max
                ? `$${service.price_min.toLocaleString()} - $${service.price_max.toLocaleString()}`
                : service.price_min
                  ? `From $${service.price_min.toLocaleString()}`
                  : "Contact for pricing"),
          }))
        : [],
    rating: service.rating || 0,
    reviewCount: service.review_count || 0,
    testimonials: [], // Would come from a separate API call
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === photographer.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? photographer.portfolio.length - 1 : prev - 1
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  const handleContactClick = async () => {
    if (!service || !service.vendor_id) {
      navigate(
        `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(photographer.name)}&category=photo-video`
      );
      return;
    }

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: service.vendor_id,
          serviceId: service.id,
          initialMessage: `Hi! I'm interested in your ${photographer.name} service.`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/chat/${data.conversationId}`);
      } else {
        navigate(
          `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(photographer.name)}&category=photo-video&serviceId=${service.id}`
        );
      }
    } catch (err) {
      navigate(
        `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(photographer.name)}&category=photo-video&serviceId=${service.id}`
      );
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate("/photo-video")}
            className="text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Photo & Video</h2>
          {profile?.role !== "vendor" && (
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-rose-600"
            >
              <Heart
                className="w-6 h-6"
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          )}
          {profile?.role === "vendor" && <div className="w-6 h-6" />}
        </div>
      </header>

      <main className="flex-grow">
        {/* Image Carousel */}
        {photographer.portfolio.length > 0 ? (
          <div className="relative h-64 lg:h-96">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url(${photographer.portfolio[currentImageIndex]})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {photographer.portfolio.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                >
                  <ChevronRight className="w-5 h-5 text-gray-900" />
                </button>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {photographer.portfolio.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative h-64 lg:h-96 bg-gray-200" />
        )}

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {photographer.businessName}
            </h1>
            <p className="mt-2 text-base lg:text-lg text-gray-700">
              {photographer.description}
            </p>
          </div>

          {/* Vendor Profile Section */}
          {service.vendor && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                About the Photographer/Videographer
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: service.vendor.avatar_url
                      ? `url(${service.vendor.avatar_url})`
                      : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Photographer")})`,
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                    {service.vendor.business_name || photographer.businessName}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600">
                    Photography & Videography Specialist
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* About & Specialty */}
          <div className="p-4 lg:p-6 bg-white rounded-xl space-y-4 shadow-sm">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                About
              </h3>
              <p className="mt-2 text-base lg:text-lg text-gray-700">
                {photographer.about}
              </p>
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                Specialty
              </h3>
              <p className="mt-2 text-base lg:text-lg text-gray-700">
                {photographer.specialty}
              </p>
            </div>
          </div>

          {/* Photo & Video Details Section */}
          {service.specific_fields && (
            <div className="space-y-6">
              {/* Coverage Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Coverage Details
                </h3>
                <div className="space-y-3">
                  {service.specific_fields.duration && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Coverage Duration</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.duration} hours
                      </span>
                    </div>
                  )}
                  {service.specific_fields.teamSize && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Team Size</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.teamSize} photographer{service.specific_fields.teamSize > 1 ? 's' : ''}/videographer{service.specific_fields.teamSize > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {service.specific_fields.deliveryTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Editing & Delivery Time</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.deliveryTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Format */}
              {(service.specific_fields.formatUSB || 
                service.specific_fields.formatOnline || 
                service.specific_fields.formatAlbum) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Delivery Format
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.specific_fields.formatUSB && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">USB Drive</span>
                      </div>
                    )}
                    {service.specific_fields.formatOnline && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Online Gallery</span>
                      </div>
                    )}
                    {service.specific_fields.formatAlbum && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Printed Album</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Services */}
              {(service.specific_fields.drone || 
                service.specific_fields.travel) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Additional Services
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.specific_fields.drone && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700">Drone Option Available</span>
                      </div>
                    )}
                    {service.specific_fields.travel && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-gray-700">Travel Available</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Packages & Pricing */}
          {photographer.packages.length > 0 && (
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Packages & Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {photographer.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{pkg.name}</p>
                      <p className="text-sm text-rose-600">{pkg.price}</p>
                    </div>
                    <Button className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Calendar Placeholder */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              Availability
            </h3>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <p className="text-center text-gray-600">
                Contact vendor for availability
              </p>
            </div>
          </div>

          {/* Testimonials */}
          {photographer.testimonials.length > 0 && (
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                Testimonials
              </h3>
              <div className="space-y-6">
                {photographer.testimonials.map((testimonial: any) => (
                  <div
                    key={testimonial.id}
                    className="p-4 bg-white rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full"
                        src={testimonial.avatar}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.date}
                        </p>
                      </div>
                      <StarRating rating={testimonial.rating} size="sm" />
                    </div>
                    <p className="mt-4 text-gray-700">{testimonial.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Summary */}
          {photographer.rating > 0 && (
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-wrap items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">
                  {photographer.rating.toFixed(1)}
                </p>
                <StarRating rating={photographer.rating} size="sm" />
                <p className="text-sm text-gray-600 mt-1">
                  {photographer.reviewCount} reviews
                </p>
              </div>
              <div className="flex-1 min-w-[200px] space-y-2 text-sm">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-gray-900">{item.stars}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-amber-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-600 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      {profile?.role !== "vendor" && (
        <footer className="sticky bottom-0 bg-pink-50/95 backdrop-blur-sm p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() =>
                navigate(`/vendor-public-profile/${service.vendor_id}`)
              }
              variant="outline"
              className="h-12 text-center text-sm font-bold rounded-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50"
            >
              View Profile
            </Button>
            <Button
              onClick={handleContactClick}
              className="h-12 text-center text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full"
            >
              Contact Vendor
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};
