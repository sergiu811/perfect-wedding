import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart, Share } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface DecorationDetailsPageProps {
  decorationId: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  specific_fields: any;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const DecorationDetailsPage = ({
  decorationId,
}: DecorationDetailsPageProps) => {
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
        const response = await fetch(`/api/services/${decorationId}`);

        if (!response.ok) {
          throw new Error("Failed to load decoration");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching decoration:", err);
        setError(err.message || "Failed to load decoration");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [decorationId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">🌸</span>
          </div>
          <p className="text-gray-600 font-medium">
            Loading decoration details...
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
            Decoration Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The decoration you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/decorations")}>
            Back to Decorations
          </Button>
        </div>
      </div>
    );
  }

  // Map service data to match original decoration structure
  const decoration = {
    id: service.id,
    name: service.title,
    description: service.description,
    portfolio: service.images || [],
    styles: service.specific_fields?.styles || service.tags || [],
    pricingDetails:
      service.specific_fields?.pricing_details ||
      service.specific_fields?.pricingDetails ||
      "Contact for pricing",
    customization:
      service.specific_fields?.customization ||
      "Customization options available",
    rentalInfo:
      service.specific_fields?.rental_info ||
      service.specific_fields?.rentalInfo ||
      "Rental and purchase options available",
    rating: service.rating || 0,
    reviewCount: service.review_count || 0,
    reviews: [], // Would come from a separate API call
  };

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  const handleContactClick = () => {
    if (!service || !service.vendor_id) {
      return;
    }

    navigate(
      `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(decoration.name)}&category=decorations&serviceId=${service.id}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate("/decorations")}
            className="p-2 rounded-full hover:bg-rose-600/20"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-rose-600/20">
              <Share className="w-6 h-6 text-gray-900" />
            </button>
            {profile?.role !== "vendor" && (
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-rose-600/20"
              >
                <Heart
                  className="w-6 h-6 text-gray-900"
                  fill={isFavorite ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </button>
            )}
            {profile?.role === "vendor" && <div className="w-10 h-10" />}
          </div>
        </div>
      </header>

      <main className="flex-grow pb-24">
        {/* Hero Image with Carousel */}
        {decoration.portfolio.length > 0 ? (
          <div className="h-64 lg:h-96 bg-cover bg-center relative">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url(${decoration.portfolio[currentImageIndex]})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {decoration.portfolio.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 lg:h-96 bg-gray-200" />
        )}

        <div className="p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
          {/* Title & Description */}
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {decoration.name}
            </h1>
            <p className="mt-2 text-base lg:text-lg text-gray-700">
              {decoration.description}
            </p>
          </div>

          {/* Vendor Profile Section */}
          {service.vendor && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                About the Decorator
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: service.vendor.avatar_url
                      ? `url(${service.vendor.avatar_url})`
                      : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Decorator")})`,
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                    {service.vendor.business_name || decoration.name}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600">
                    Decoration & Design Specialist
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decoration Details Section */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Decoration Type */}
            {service.specific_fields && (
              (service.specific_fields.decorFloral ||
                service.specific_fields.decorLighting ||
                service.specific_fields.decorTable ||
                service.specific_fields.decorStage) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
                    Decoration Type
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {service.specific_fields.decorFloral && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Floral Arrangements</span>
                      </div>
                    )}
                    {service.specific_fields.decorLighting && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Lighting</span>
                      </div>
                    )}
                    {service.specific_fields.decorTable && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Table Design</span>
                      </div>
                    )}
                    {service.specific_fields.decorStage && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Stage Setup</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Available Styles */}
            {decoration.styles.length > 0 || service.specific_fields?.themeStyles ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
                  Theme Styles
                </h2>
                <div className="flex flex-wrap gap-3">
                  {service.specific_fields?.themeStyles ? (
                    typeof service.specific_fields.themeStyles === 'string'
                      ? service.specific_fields.themeStyles.split(',').map((style: string, index: number) => (
                        <span
                          key={index}
                          className="bg-rose-600/10 text-rose-600 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {style.trim()}
                        </span>
                      ))
                      : (
                        <span className="bg-rose-600/10 text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                          {service.specific_fields.themeStyles}
                        </span>
                      )
                  ) : (
                    decoration.styles.map((style: string, index: number) => (
                      <span
                        key={index}
                        className="bg-rose-600/10 text-rose-600 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {style}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ) : null}

            {/* Setup Information */}
            {service.specific_fields && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
                  Setup Information
                </h2>
                <div className="space-y-3">
                  {service.specific_fields.setupIncluded && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Setup & Teardown Included</span>
                    </div>
                  )}
                  {service.specific_fields.setupTimeHours && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Average Setup Time</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.setupTimeHours} hours
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Gallery Grid */}
          {decoration.portfolio.length > 1 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
                Portfolio Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {decoration.portfolio
                  .slice(1)
                  .map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundImage: `url(${image})` }}
                      onClick={() => setCurrentImageIndex(index + 1)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 border-t border-gray-200 pt-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900">
                💰 Pricing
              </h2>
              <p className="text-gray-600 lg:text-lg">
                {decoration.pricingDetails}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900">
                ✨ Customization
              </h2>
              <p className="text-gray-600 lg:text-lg">
                {decoration.customization}
              </p>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900">
                📦 Rental & Purchase Options
              </h2>
              <p className="text-gray-600 lg:text-lg">
                {decoration.rentalInfo}
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              📅 Availability
            </h3>
            <p className="text-center text-gray-600">
              Contact vendor for availability and booking
            </p>
          </div>

          {/* Reviews */}
          {decoration.rating > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
                Reviews
              </h2>
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-amber-500">
                    {decoration.rating.toFixed(1)}
                  </p>
                  <div className="flex justify-center mt-1">
                    <StarRating rating={decoration.rating} size="sm" />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {decoration.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-4">
                        {item.stars}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-amber-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          {decoration.reviews.length > 0 && (
            <div className="space-y-6">
              {decoration.reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      alt={review.author}
                      className="w-10 h-10 rounded-full"
                      src={review.avatar}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 my-2">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      {profile?.role !== "vendor" && (
        <footer className="sticky bottom-0 bg-pink-50/95 backdrop-blur-sm shadow-t-sm">
          <div className="p-4 grid grid-cols-2 gap-3">
            <Button
              onClick={() =>
                navigate(`/vendor-public-profile/${service.vendor_id}`)
              }
              variant="outline"
              className="h-12 bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-bold rounded-lg"
            >
              View Profile
            </Button>
            <Button
              onClick={handleContactClick}
              className="h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
            >
              Contact Vendor
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};
