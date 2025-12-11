import React, { useState, useEffect } from "react";
import { ArrowLeft, ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface InvitationDetailsPageProps {
  invitationId: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  specific_fields: any;
  vendor_id: string;
  vendor: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const InvitationDetailsPage = ({
  invitationId,
}: InvitationDetailsPageProps) => {
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
        const response = await fetch(`/api/services/${invitationId}`);

        if (!response.ok) {
          throw new Error("Failed to load invitation");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err: any) {
        console.error("Error fetching invitation:", err);
        setError(err.message || "Failed to load invitation");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [invitationId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-gray-400 text-2xl">💌</span>
          </div>
          <p className="text-gray-600 font-medium">
            Loading invitation details...
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
            Invitation Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The invitation you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/invitations")}>
            Back to Invitations
          </Button>
        </div>
      </div>
    );
  }

  // Map service data to match original invitation structure
  const invitation = {
    id: service.id,
    name: service.title,
    description: service.description,
    image:
      service.images?.[0] ||
      service.vendor?.avatar_url ||
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
    customization:
      service.specific_fields?.customization ||
      service.specific_fields?.customizationOptions ||
      [],
    pricing:
      service.specific_fields?.pricing ||
      service.specific_fields?.pricingOptions ||
      [],
    orderProcess:
      service.specific_fields?.order_process ||
      service.specific_fields?.orderProcess ||
      "Contact vendor for order process",
    deliveryTimeline:
      service.specific_fields?.delivery_timeline ||
      service.specific_fields?.deliveryTimeline ||
      "Contact vendor for delivery timeline",
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
      `/contact-vendor/${service.vendor_id}?name=${encodeURIComponent(invitation.name)}&category=invitations&serviceId=${service.id}`
    );
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/invitations")}
            className="flex items-center justify-center size-10 text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-10">
            Invitation Details
          </h1>
          {profile?.role !== "vendor" && (
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center justify-center size-10 text-rose-600"
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
      </header>

      <main className="flex-grow">
        {/* Hero Image */}
        <div
          className="aspect-[3/2] w-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${invitation.image})` }}
        />

        <div className="p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {invitation.name}
            </h2>
            <p className="text-base lg:text-lg text-gray-600">{invitation.description}</p>
          </div>

          {/* Vendor Profile Section */}
          {service.vendor && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                About the Designer
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: service.vendor.avatar_url
                      ? `url(${service.vendor.avatar_url})`
                      : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(service.vendor.business_name || "Designer")})`,
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-lg lg:text-xl font-bold text-gray-900">
                    {service.vendor.business_name || invitation.name}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-600">
                    Invitation & Stationery Specialist
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Invitation Details Section */}
          <div className="space-y-6">
            {/* Invitation Type */}
            {service.specific_fields && (
              (service.specific_fields.typePrinted ||
                service.specific_fields.typeDigital ||
                service.specific_fields.typeHandmade) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Invitation Type
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.specific_fields.typePrinted && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Printed</span>
                      </div>
                    )}
                    {service.specific_fields.typeDigital && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Digital</span>
                      </div>
                    )}
                    {service.specific_fields.typeHandmade && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <span className="text-gray-700">Handmade</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Printing Materials */}
            {service.specific_fields?.materials && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Printing Materials
                </h3>
                <p className="text-gray-700 lg:text-lg">
                  {service.specific_fields.materials}
                </p>
              </div>
            )}

            {/* Order Details */}
            {service.specific_fields && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  Order Details
                </h3>
                <div className="space-y-3">
                  {service.specific_fields.minOrder && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Minimum Order Quantity</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.minOrder} pieces
                      </span>
                    </div>
                  )}
                  {service.specific_fields.deliveryDays && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Delivery Time</span>
                      <span className="font-semibold text-gray-900">
                        {service.specific_fields.deliveryDays} days
                      </span>
                    </div>
                  )}
                  {service.specific_fields.designIncluded && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Design Service Included</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {invitation.customization.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  ✨ Customization Options
                </h3>
                <div className="divide-y divide-gray-200">
                  {invitation.customization.map((option: any, index: number) => (
                    <div key={index} className="flex justify-between py-4">
                      <span className="text-gray-600 lg:text-lg">
                        {option.label || option.name || `Option ${index + 1}`}
                      </span>
                      <span className="font-semibold text-gray-900 lg:text-lg">
                        {option.value || option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          {invitation.pricing.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                💰 Pricing Packages
              </h3>
              <div className="divide-y divide-gray-200">
                {invitation.pricing.map((price: any, index: number) => (
                  <div key={index} className="flex justify-between py-4">
                    <span className="text-gray-600 lg:text-lg">
                      {price.quantity || price.name || `Quantity ${index + 1}`}
                    </span>
                    <span className="font-semibold text-rose-600 lg:text-lg">
                      {price.price || price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Process */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              📋 Order Process
            </h3>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {invitation.orderProcess}
            </p>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              🚚 Delivery Timeline
            </h3>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {invitation.deliveryTimeline}
            </p>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              📅 Availability
            </h3>
            <p className="text-center text-gray-600">
              Contact vendor for current availability and lead times
            </p>
          </div>

          {/* Customer Reviews */}
          {invitation.rating > 0 && (
            <div className="space-y-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                ⭐ Customer Reviews
              </h3>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="text-center space-y-2">
                  <p className="text-5xl font-black text-rose-600">
                    {invitation.rating.toFixed(1)}
                  </p>
                  <StarRating rating={invitation.rating} size="sm" />
                  <p className="text-sm text-gray-600">
                    {invitation.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="w-4 text-sm text-gray-600">
                        {item.stars}
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 rounded-full bg-rose-600"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              {invitation.reviews.length > 0 && (
                <div className="space-y-8">
                  {invitation.reviews.map((review: any) => (
                    <div key={review.id} className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <img
                          alt={review.author}
                          className="size-10 rounded-full"
                          src={review.avatar}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {review.author}
                          </p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <div className="flex gap-4 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-gray-700">
                          <ThumbsUp className="w-5 h-5" />
                          <span>{review.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-700">
                          <ThumbsDown className="w-5 h-5" />
                          <span>{review.dislikes || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      {profile?.role !== "vendor" && (
        <footer className="sticky bottom-0 z-10 bg-pink-50/95 backdrop-blur-sm pb-safe-area">
          <div className="p-4 grid grid-cols-2 gap-3 border-t border-gray-200">
            <Button
              onClick={() =>
                navigate(`/vendor-public-profile/${service.vendor_id}`)
              }
              variant="outline"
              className="h-12 rounded-lg border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-bold"
            >
              View Profile
            </Button>
            <Button
              onClick={handleContactClick}
              className="h-12 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Contact Vendor
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};
