import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface SweetDetailsPageProps {
  sweetId: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  specific_fields: any;
  packages: any;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const SweetDetailsPage = ({ sweetId }: SweetDetailsPageProps) => {
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
        const response = await fetch(`/api/services/${sweetId}`);

        if (!response.ok) {
          throw new Error("Failed to load sweet vendor");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching sweet vendor:", err);
        setError(err.message || "Failed to load sweet vendor");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [sweetId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">🍰</span>
          </div>
          <p className="text-gray-600 font-medium">
            Loading sweet vendor details...
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
            Sweet Vendor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The sweet vendor you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/sweets")}>Back to Sweets</Button>
        </div>
      </div>
    );
  }

  // Map service data to match original sweet structure
  const sweet = {
    id: service.id,
    name: service.title,
    description: service.description,
    image:
      service.images?.[0] ||
      service.vendor?.avatar_url ||
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    specialty:
      service.specific_fields?.specialty ||
      service.tags?.join(", ") ||
      "Wedding Cakes & Desserts",
    sampleMenus:
      service.specific_fields?.sample_offerings ||
      service.specific_fields?.sampleOfferings ||
      [],
    packages:
      service.packages && Array.isArray(service.packages)
        ? service.packages.map((pkg: any, idx: number) => ({
          id: idx + 1,
          name: pkg.name || `Package ${idx + 1}`,
          price: pkg.price || pkg.price_range || "Contact for pricing",
          features: pkg.features || pkg.included || [],
          highlighted: pkg.highlighted || false,
        }))
        : [],
    dietaryAccommodations:
      service.specific_fields?.dietary_accommodations ||
      service.specific_fields?.dietaryAccommodations ||
      "Contact vendor for dietary options",
    serviceOptions:
      service.specific_fields?.service_options ||
      service.specific_fields?.serviceOptions ||
      [],
    rating: service.rating || 0,
    reviewCount: service.review_count || 0,
    reviews: [], // Would come from a separate API call
  };

  const handleContactClick = () => {
    if (!service || !service.vendor_id) {
      return;
    }

    navigate(
      `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(sweet.name)}&category=sweets&serviceId=${service.id}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 max-w-7xl mx-auto w-full">
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-pink-50/95 p-4 lg:p-6 backdrop-blur-sm border-b border-gray-200">
          <button onClick={() => navigate("/sweets")}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          {profile?.role !== "vendor" && (
            <button onClick={() => setIsFavorite(!isFavorite)}>
              <Heart
                className="w-6 h-6 text-gray-900"
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          )}
          {profile?.role === "vendor" && <div className="w-6 h-6" />}
        </header>

        {/* Hero Image */}
        <div className="aspect-h-3 aspect-w-4 lg:aspect-h-2 lg:aspect-w-5">
          <div
            className="h-64 lg:h-96 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${sweet.image})` }}
          />
        </div>

        <div className="space-y-8 p-4 lg:p-8 max-w-4xl mx-auto w-full">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {sweet.name}
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              {sweet.description}
            </p>
          </div>

          {/* Vendor Profile Section */}
          {service.vendor && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                About the Baker
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: service.vendor.avatar_url
                      ? `url(${service.vendor.avatar_url})`
                      : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Baker")})`,
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                    {service.vendor.business_name || sweet.name}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600">
                    Wedding Cakes & Desserts Specialist
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sweet Details Section */}
          <div className="space-y-6">
            {/* Service Type */}
            {service.specific_fields && (
              (service.specific_fields.sweetCake ||
                service.specific_fields.sweetCandyBar ||
                service.specific_fields.sweetCupcakes ||
                service.specific_fields.sweetMacarons) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Service Type
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {service.specific_fields.sweetCake && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Wedding Cake</span>
                      </div>
                    )}
                    {service.specific_fields.sweetCandyBar && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Candy Bar</span>
                      </div>
                    )}
                    {service.specific_fields.sweetCupcakes && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Cupcakes</span>
                      </div>
                    )}
                    {service.specific_fields.sweetMacarons && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Macarons</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Flavors Offered */}
            {service.specific_fields?.flavors && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Flavors Offered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {typeof service.specific_fields.flavors === 'string'
                    ? service.specific_fields.flavors.split(',').map((flavor: string, index: number) => (
                      <span
                        key={index}
                        className="bg-rose-600/10 text-rose-600 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {flavor.trim()}
                      </span>
                    ))
                    : (
                      <p className="text-gray-700 lg:text-lg">
                        {service.specific_fields.flavors}
                      </p>
                    )
                  }
                </div>
              </div>
            )}

            {/* Specialty */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Specialty
              </h2>
              <p className="text-base lg:text-lg text-gray-600">
                {sweet.specialty}
              </p>
            </div>

            {/* Additional Options */}
            {service.specific_fields && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Additional Options
                </h2>
                <div className="space-y-3">
                  {service.specific_fields.tasting && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Tasting Available</span>
                    </div>
                  )}
                  {service.specific_fields.deliveryIncluded && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Delivery Included</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dietary Options */}
            {service.specific_fields && (
              (service.specific_fields.dietVegan ||
                service.specific_fields.dietGluten ||
                service.specific_fields.dietSugar) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Dietary Options
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {service.specific_fields.dietVegan && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Vegan</span>
                      </div>
                    )}
                    {service.specific_fields.dietGluten && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Gluten-free</span>
                      </div>
                    )}
                    {service.specific_fields.dietSugar && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Sugar-free</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Sample Menus */}
          {sweet.sampleMenus.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Sample Offerings
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {sweet.sampleMenus.map((menu: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-white p-4 lg:p-6 shadow-sm"
                  >
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          {menu.name || menu.title || `Offering ${index + 1}`}
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {menu.title || menu.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {menu.description || ""}
                        </p>
                      </div>
                      <button className="rounded bg-rose-600/20 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-600/30">
                        View Details
                      </button>
                    </div>
                    {menu.image && (
                      <div
                        className="h-24 w-24 lg:h-32 lg:w-32 flex-shrink-0 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${menu.image})` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Packages */}
          {sweet.packages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Pricing Packages
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sweet.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`flex flex-col gap-4 rounded-xl border p-6 shadow-sm ${pkg.highlighted
                        ? "border-rose-600 bg-rose-600/5"
                        : "border-gray-200 bg-white"
                      }`}
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {pkg.name}
                      </h3>
                      <p className="flex items-baseline gap-1 text-gray-900">
                        <span className="text-4xl font-black tracking-tight">
                          {pkg.price}
                        </span>
                        <span className="text-sm font-bold">per person</span>
                      </p>
                    </div>
                    {pkg.features.length > 0 && (
                      <ul className="space-y-2 text-sm text-gray-600">
                        {pkg.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-rose-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Accommodations */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              Dietary Accommodations
            </h2>
            <p className="text-base lg:text-lg text-gray-600">
              {sweet.dietaryAccommodations}
            </p>
          </div>

          {/* Service Styles */}
          {sweet.serviceOptions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Service Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
                {sweet.serviceOptions.map((option: any, index: number) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                  >
                    <input
                      checked={option.checked || false}
                      className="h-5 w-5 rounded border-gray-300 bg-transparent text-rose-600 focus:ring-rose-600"
                      type="checkbox"
                      readOnly
                    />
                    <span className="text-gray-900">
                      {option.label || option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Availability Calendar Placeholder */}
          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              Availability
            </h2>
            <div className="rounded-lg bg-white p-4 lg:p-6 shadow-sm">
              <p className="text-center text-base lg:text-lg text-gray-600">
                Contact vendor for availability
              </p>
            </div>
          </div>

          {/* Testimonials */}
          {sweet.reviews.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                Testimonials
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {sweet.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="rounded-lg bg-white p-4 lg:p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${review.avatar})` }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {review.author}
                        </p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-3 text-base lg:text-lg text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with 2 buttons */}
      {profile?.role !== "vendor" && (
        <footer className="sticky bottom-0 bg-pink-50/95 backdrop-blur-sm border-t border-gray-200 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <Button
                onClick={() =>
                  navigate(`/vendor-public-profile/${service.vendor_id}`)
                }
                variant="outline"
                className="h-12 lg:h-14 rounded-lg border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-bold text-base lg:text-lg"
              >
                View Profile
              </Button>
              <Button
                onClick={handleContactClick}
                className="h-12 lg:h-14 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-base lg:text-lg"
              >
                Contact Vendor
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
