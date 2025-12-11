import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart, Share, Music, Play } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface MusicianDetailsPageProps {
  musicianId: string;
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
  packages: any;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const MusicianDetailsPage = ({
  musicianId,
}: MusicianDetailsPageProps) => {
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
        const response = await fetch(`/api/services/${musicianId}`);

        if (!response.ok) {
          throw new Error("Failed to load musician");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching musician:", err);
        setError(err.message || "Failed to load musician");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [musicianId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">🎵</span>
          </div>
          <p className="text-gray-600 font-medium">
            Loading musician details...
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
            Musician Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The musician you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/music-dj")}>
            Back to Music/DJ
          </Button>
        </div>
      </div>
    );
  }

  // Map service data to match original musician structure
  const musician = {
    id: service.id,
    name: service.title,
    description: service.description,
    image:
      service.images?.[0] ||
      service.vendor?.avatar_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    genres:
      service.tags ||
      service.specific_fields?.genres ||
      service.specific_fields?.music_styles ||
      [],
    packages:
      service.packages && Array.isArray(service.packages)
        ? service.packages.map((pkg: any, idx: number) => ({
          id: idx + 1,
          name: pkg.name || `Package ${idx + 1}`,
          title: pkg.name || `Package ${idx + 1}`,
          description: pkg.description || "",
          price: pkg.price || pkg.price_range || "Contact for pricing",
          image:
            pkg.image ||
            service.images?.[0] ||
            service.vendor?.avatar_url ||
            "",
        }))
        : [],
    rating: service.rating || 0,
    reviewCount: service.review_count || 0,
    reviews: [], // Would come from a separate API call
    audioSamples:
      service.specific_fields?.audio_samples ||
      service.specific_fields?.audioSamples ||
      [],
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
      `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(musician.name)}&category=music-dj&serviceId=${service.id}`
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-pink-50">
      <div className="pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-pink-50/95 px-4 lg:px-8 py-3 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <button
              onClick={() => navigate("/music-dj")}
              className="flex size-10 items-center justify-center rounded-full text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full text-gray-900">
                <Share className="w-6 h-6" />
              </button>
              {profile?.role !== "vendor" && (
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex size-10 items-center justify-center rounded-full text-gray-900"
                >
                  <Heart
                    className="w-6 h-6"
                    fill={isFavorite ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </button>
              )}
              {profile?.role === "vendor" && <div className="w-10 h-10" />}
            </div>
          </div>
        </header>

        <main>
          {/* Hero Image */}
          <div
            className="h-64 lg:h-96 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${musician.image})` }}
          />

          {/* Description */}
          <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {musician.name}
            </h1>
            <p className="mt-2 text-base lg:text-lg text-gray-600">
              {musician.description}
            </p>
          </div>

          {/* Vendor Profile Section */}
          {service.vendor && (
            <div className="px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  About the Musician/DJ
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: service.vendor.avatar_url
                        ? `url(${service.vendor.avatar_url})`
                        : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Musician")})`,
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                      {service.vendor.business_name || musician.name}
                    </h4>
                    <p className="text-sm lg:text-base text-gray-600">
                      Music & Entertainment Specialist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Details Section */}
          <div className="px-4 lg:px-8 pb-6 max-w-7xl mx-auto space-y-6">
            {/* Service Type */}
            {service.specific_fields && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Service Type
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {service.specific_fields.serviceDJ && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                      <span className="text-gray-700">DJ</span>
                    </div>
                  )}
                  {service.specific_fields.serviceBand && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                      <span className="text-gray-700">Live Band</span>
                    </div>
                  )}
                  {service.specific_fields.serviceMC && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                      <span className="text-gray-700">MC Services</span>
                    </div>
                  )}
                  {service.specific_fields.serviceSinger && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                      <span className="text-gray-700">Singer</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Musical Genres */}
            {(musician.genres &&
              (Array.isArray(musician.genres)
                ? musician.genres.length > 0
                : musician.genres)) ||
              service.specific_fields?.genres ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Musical Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const genres =
                      service.specific_fields?.genres || musician.genres;
                    if (typeof genres === "string") {
                      return genres
                        .split(",")
                        .map((genre: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full bg-rose-600/10 px-3 py-1 text-sm font-medium text-rose-600"
                          >
                            {genre.trim()}
                          </span>
                        ));
                    } else if (Array.isArray(genres)) {
                      return genres.map((genre: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-rose-600/10 px-3 py-1 text-sm font-medium text-rose-600"
                        >
                          {genre}
                        </span>
                      ));
                    }
                    return null;
                  })()}
                </div>
              </div>
            ) : null}

            {/* Performance Details */}
            {service.specific_fields && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Performance Details
                </h3>
                <div className="space-y-3">
                  {service.specific_fields.performanceDuration && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Performance Duration
                      </span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.performanceDuration} hours
                      </span>
                    </div>
                  )}
                  {service.specific_fields.setupTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Setup Time</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.setupTime} hours
                      </span>
                    </div>
                  )}
                  {service.specific_fields.playlistCustom && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">
                        Playlist Customization Available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Equipment Included */}
            {service.specific_fields &&
              (service.specific_fields.equipSound ||
                service.specific_fields.equipLighting ||
                service.specific_fields.equipMics) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Equipment Included
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.specific_fields.equipSound && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Sound System</span>
                      </div>
                    )}
                    {service.specific_fields.equipLighting && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Lighting</span>
                      </div>
                    )}
                    {service.specific_fields.equipMics && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Microphones</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Service Packages */}
          {musician.packages.length > 0 && (
            <div className="space-y-6 px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900">
                Service Packages
              </h3>
              {musician.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{pkg.name}</p>
                      <p className="font-bold text-gray-900">{pkg.title}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {pkg.description}
                      </p>
                      <p className="mt-2 text-lg font-bold text-rose-600">
                        {pkg.price}
                      </p>
                    </div>
                    {pkg.image && (
                      <div
                        className="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${pkg.image})` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Availability */}
          <div className="px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900">Availability</h3>
            <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
              <p className="text-center text-gray-600">
                Contact vendor for availability
              </p>
            </div>
          </div>

          {/* Client Reviews */}
          {musician.rating > 0 && (
            <div className="px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900">
                Client Reviews
              </h3>
              <div className="mt-4 flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-bold text-gray-900">
                    {musician.rating.toFixed(1)}
                  </p>
                  <StarRating rating={musician.rating} size="sm" />
                  <p className="mt-1 text-sm text-gray-600">
                    {musician.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {item.stars}
                      </span>
                      <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-1.5 rounded-full bg-rose-600"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          {musician.reviews.length > 0 && (
            <div className="space-y-6 px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
              {musician.reviews.map((review: any) => (
                <div key={review.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${review.avatar})` }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audio Samples */}
          {musician.audioSamples.length > 0 && (
            <div className="px-4 lg:px-8 pb-6 max-w-7xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900">Audio Samples</h3>
              <div className="mt-4 space-y-2">
                {musician.audioSamples.map((sample: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-600/10 text-rose-600">
                      <Music className="w-6 h-6" />
                    </div>
                    <p className="flex-1 truncate font-medium text-gray-800">
                      {sample.name || sample.title || `Sample ${index + 1}`}
                    </p>
                    <button className="shrink-0 text-gray-600">
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Fixed Footer */}
      {profile?.role !== "vendor" && (
        <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-pink-50/95 backdrop-blur-sm">
          <div className="flex flex-col justify-end bg-pink-50">
            <div className="grid grid-cols-2 gap-3 p-4">
              <Button
                onClick={() =>
                  navigate(`/vendor-public-profile/${service.vendor_id}`)
                }
                variant="outline"
                className="h-12 rounded-lg border-2 border-rose-600 text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                View Profile
              </Button>
              <Button
                onClick={handleContactClick}
                className="h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white"
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
