import React, { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Instagram,
  Facebook,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface ServiceRecord {
  id: string;
  title?: string;
  description?: string;
  price_min?: number | string | null;
  price_max?: number | string | null;
  images?: string[] | null;
  tags?: string[] | null;
  rating?: number | null;
  review_count?: number | null;
  is_active?: boolean | null;
}

interface VendorPublicProfileProps {
  vendorId?: string;
}

const formatPriceRange = (service: ServiceRecord) => {
  const min =
    service.price_min !== null && service.price_min !== undefined
      ? Number(service.price_min)
      : null;
  const max =
    service.price_max !== null && service.price_max !== undefined
      ? Number(service.price_max)
      : null;

  if (min !== null && max !== null) {
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  }

  if (min !== null) {
    return `From $${min.toLocaleString()}`;
  }

  return "Contact for pricing";
};

export const VendorPublicProfile = ({ vendorId }: VendorPublicProfileProps) => {
  const { navigate } = useRouter();
  const { profile, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which vendor ID to use
  const targetVendorId = vendorId || user?.id;
  const isViewingOwnProfile = !vendorId || vendorId === user?.id;

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!targetVendorId) return;

      try {
        setLoadingProfile(true);
        setLoadingServices(true);
        setError(null);

        // Fetch vendor profile
        const profileResponse = await fetch(`/api/profiles/${targetVendorId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setVendorProfile(profileData.profile || profileData);
        }

        // Fetch vendor services
        const servicesResponse = await fetch(
          `/api/services?vendorId=${targetVendorId}`
        );
        if (!servicesResponse.ok) {
          throw new Error("Failed to load services");
        }

        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);
      } catch (err: any) {
        console.error("Error fetching vendor data:", err);
        setError(err.message || "Failed to load vendor profile");
      } finally {
        setLoadingProfile(false);
        setLoadingServices(false);
      }
    };

    fetchVendorData();
  }, [targetVendorId]);

  // Use vendorProfile if available, otherwise fall back to current user's profile
  const displayProfile = vendorProfile || profile;

  const portfolioImages = useMemo(() => {
    const images = new Set<string>();

    if (displayProfile?.avatar_url) {
      images.add(displayProfile.avatar_url);
    }

    services.forEach((service) => {
      (service.images || []).forEach((image) => {
        if (image) {
          images.add(image);
        }
      });
    });

    return Array.from(images);
  }, [displayProfile?.avatar_url, services]);

  useEffect(() => {
    if (portfolioImages.length === 0) {
      setCurrentImageIndex(0);
    } else if (currentImageIndex >= portfolioImages.length) {
      setCurrentImageIndex(0);
    }
  }, [portfolioImages.length, currentImageIndex]);

  const specialtyTags = useMemo(() => {
    const tagSet = new Set<string>();
    services.forEach((service) => {
      (service.tags || []).forEach((tag) => {
        if (tag) {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet);
  }, [services]);

  const ratingSummary = useMemo(() => {
    const ratedServices = services.filter(
      (service) =>
        typeof service.rating === "number" && !Number.isNaN(service.rating)
    );

    if (ratedServices.length === 0) {
      return null;
    }

    const totalRating = ratedServices.reduce(
      (sum, service) => sum + (service.rating || 0),
      0
    );

    const totalReviews = ratedServices.reduce(
      (sum, service) => sum + (service.review_count || 0),
      0
    );

    return {
      average: totalRating / ratedServices.length,
      reviews: totalReviews,
    };
  }, [services]);

  const startingPrice = useMemo(() => {
    const prices = services
      .map((service) =>
        service.price_min !== null && service.price_min !== undefined
          ? Number(service.price_min)
          : null
      )
      .filter(
        (value): value is number => value !== null && !Number.isNaN(value)
      );

    if (prices.length === 0) {
      return null;
    }

    return Math.min(...prices);
  }, [services]);

  const hasPortfolioImages = portfolioImages.length > 0;
  const heroImage = hasPortfolioImages
    ? portfolioImages[currentImageIndex]
    : null;

  const businessName = displayProfile?.business_name || "Vendor";
  const categoryLabel = "Vendor";
  const description =
    displayProfile?.bio ||
    "This vendor hasn't shared a description yet. Once they update their profile, you'll see more details here.";
  const businessLocation = displayProfile?.location || "Location not provided";
  const contactPhone = displayProfile?.phone || "";
  // Email is not stored in profiles table, so we only show it if viewing own profile
  const contactEmail = isViewingOwnProfile ? user?.email || "" : "";

  const activeServices = services.filter(
    (service) => service.is_active !== false
  );

  const nextImage = () => {
    if (!hasPortfolioImages) return;
    setCurrentImageIndex((prev) =>
      prev === portfolioImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!hasPortfolioImages) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? portfolioImages.length - 1 : prev - 1
    );
  };

  const handleContactClick = async () => {
    if (!targetVendorId) return;

    try {
      // Navigate to contact vendor page or create conversation
      navigate(
        `/contact-vendor/${targetVendorId}?name=${encodeURIComponent(businessName)}`
      );
    } catch (err) {
      console.error("Error contacting vendor:", err);
    }
  };

  if (loadingProfile || loadingServices) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>
          <p className="text-gray-600 font-medium">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vendor Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/vendors")}>Back to Vendors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() =>
              navigate(isViewingOwnProfile ? "/vendor-dashboard" : "/vendors")
            }
            className="text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Public Profile</h2>
          {!isViewingOwnProfile && (
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
          {isViewingOwnProfile && <div className="w-6 h-6" />}
        </div>
      </header>

      <main className="flex-grow pb-20">
        {/* Image Carousel */}
        <div className="relative h-64 lg:h-96">
          {heroImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url(${heroImage})`,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Navigation Arrows */}
          {portfolioImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {portfolioImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {portfolioImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Title & Category */}
          <div className="text-center">
            <p className="text-rose-600 text-sm font-semibold uppercase tracking-wide">
              {categoryLabel}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mt-1">
              {businessName}
            </h1>
            <p className="mt-2 text-base lg:text-lg text-gray-700">
              {description}
            </p>

            {/* Rating */}
            {ratingSummary && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <StarRating rating={ratingSummary.average} size="sm" />
                <span className="text-sm font-semibold text-gray-900">
                  {ratingSummary.average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({ratingSummary.reviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm text-center">
              <p className="text-2xl lg:text-3xl font-bold text-rose-600">
                {activeServices.length}
              </p>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                Active Listings
              </p>
            </div>
            {startingPrice !== null ? (
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm text-center">
                <p className="text-2xl lg:text-3xl font-bold text-rose-600">
                  ${startingPrice.toLocaleString()}
                </p>
                <p className="text-sm lg:text-base text-gray-600 mt-1">
                  Starting Price
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm text-center">
                <p className="text-2xl lg:text-3xl font-bold text-rose-600">
                  —
                </p>
                <p className="text-sm lg:text-base text-gray-600 mt-1">
                  Starting Price
                </p>
              </div>
            )}
          </div>

          {/* Specialties */}
          {specialtyTags.length > 0 && (
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {specialtyTags.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">
              About
            </h3>
            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Services & Pricing */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              Services & Pricing
            </h3>
            {loadingServices ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-600 shadow-sm">
                Loading services...
              </div>
            ) : activeServices.length > 0 ? (
              <div className="space-y-3">
                {activeServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      // Navigate to service detail page based on category
                      const category = (service as any).category;
                      if (category === "venue") {
                        navigate(`/venues/${service.id}`);
                      } else if (category === "photo_video") {
                        navigate(`/photo-video/${service.id}`);
                      } else if (category === "music_dj") {
                        navigate(`/music-dj/${service.id}`);
                      } else if (category === "decorations") {
                        navigate(`/decorations/${service.id}`);
                      } else if (category === "sweets") {
                        navigate(`/sweets/${service.id}`);
                      } else if (category === "invitations") {
                        navigate(`/invitations/${service.id}`);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-base lg:text-lg">
                          {service.title || "Untitled Service"}
                        </p>
                        {service.description && (
                          <p className="text-sm lg:text-base text-gray-600 mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <p className="text-lg lg:text-xl font-bold text-rose-600 min-w-[120px] text-left sm:text-right">
                        {formatPriceRange(service)}
                      </p>
                    </div>
                    {service.tags && service.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-xs font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-gray-600 shadow-sm">
                This vendor hasn't added any services yet.
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-4">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-base lg:text-lg">
                    {businessLocation}
                  </p>
                </div>
              </div>

              {contactPhone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <a
                    href={`tel:${contactPhone}`}
                    className="hover:text-rose-600 transition-colors text-base lg:text-lg"
                  >
                    {contactPhone}
                  </a>
                </div>
              )}

              {contactEmail && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-rose-600 transition-colors text-base lg:text-lg"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          {(displayProfile?.website ||
            displayProfile?.instagram ||
            displayProfile?.facebook) && (
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                Social Media
              </h3>
              <div className="space-y-3">
                {displayProfile.website && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Globe className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <a
                      href={
                        displayProfile.website.startsWith("http")
                          ? displayProfile.website
                          : `https://${displayProfile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-600 transition-colors text-sm lg:text-base"
                    >
                      {displayProfile.website}
                    </a>
                  </div>
                )}
                {displayProfile.instagram && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Instagram className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <a
                      href={
                        displayProfile.instagram.startsWith("http")
                          ? displayProfile.instagram
                          : `https://instagram.com/${displayProfile.instagram.replace("@", "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-600 transition-colors text-sm lg:text-base"
                    >
                      {displayProfile.instagram}
                    </a>
                  </div>
                )}
                {displayProfile.facebook && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Facebook className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <a
                      href={
                        displayProfile.facebook.startsWith("http")
                          ? displayProfile.facebook
                          : `https://${displayProfile.facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-600 transition-colors text-sm lg:text-base"
                    >
                      {displayProfile.facebook}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Hours */}
          {displayProfile?.business_hours && (
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                  Business Hours
                </h3>
              </div>
              <div className="text-gray-700 text-sm lg:text-base whitespace-pre-line">
                {displayProfile.business_hours}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer CTA - Only show for couples viewing vendor profiles */}
      {!isViewingOwnProfile && (
        <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex gap-3 max-w-4xl mx-auto w-full">
            <Button
              variant="outline"
              className="flex-1 h-12 text-sm font-bold rounded-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50"
            >
              Save to Favorites
            </Button>
            <Button
              onClick={handleContactClick}
              className="flex-1 h-12 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md"
            >
              Contact Vendor
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};
