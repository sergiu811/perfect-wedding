import React from "react";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { INVITATIONS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface InvitationDetailsPageProps {
  invitationId: string;
}

export const InvitationDetailsPage = ({
  invitationId,
}: InvitationDetailsPageProps) => {
  const { navigate } = useRouter();

  const invitation = INVITATIONS.find((i) => i.id === parseInt(invitationId));

  if (!invitation) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The invitation you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/invitations")}>
            Back to Invitations
          </Button>
        </div>
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate("/invitations")}
            className="flex items-center justify-center size-10 text-gray-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-10">
            Invitation Details
          </h1>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Image */}
        <div
          className="aspect-[3/2] w-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${invitation.image})` }}
        />

        <div className="p-6 space-y-8">
          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {invitation.name}
            </h2>
            <p className="text-gray-600">{invitation.description}</p>
          </div>

          {/* Customization Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Customization Options
            </h3>
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {invitation.customization.map((option, index) => (
                <div key={index} className="flex justify-between py-4">
                  <span className="text-gray-500">{option.label}</span>
                  <span className="font-medium text-gray-800">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Pricing</h3>
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {invitation.pricing.map((price, index) => (
                <div key={index} className="flex justify-between py-4">
                  <span className="text-gray-500">{price.quantity}</span>
                  <span className="font-medium text-gray-800">
                    {price.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Process */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Order Process</h3>
            <p className="text-gray-600">{invitation.orderProcess}</p>
          </div>

          {/* Delivery Timeline */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              Delivery Timeline
            </h3>
            <p className="text-gray-600">{invitation.deliveryTimeline}</p>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              Customer Reviews
            </h3>
            <div className="bg-rose-600/10 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="text-center space-y-1">
                <p className="text-5xl font-black text-rose-600">
                  {invitation.rating.toFixed(1)}
                </p>
                <StarRating rating={invitation.rating} size="sm" />
                <p className="text-sm text-gray-500">
                  {invitation.reviewCount} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="w-4 text-sm text-gray-600">
                      {item.stars}
                    </span>
                    <div className="flex-1 h-2 bg-gray-300 rounded-full">
                      <div
                        className="h-2 rounded-full bg-rose-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-8">
              {invitation.reviews.map((review) => (
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
                      <span>{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-700">
                      <ThumbsDown className="w-5 h-5" />
                      <span>{review.dislikes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-10 bg-pink-50/95 backdrop-blur-sm pb-safe-area">
        <div className="p-4 grid grid-cols-2 gap-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="flex items-center justify-center rounded-lg h-12 px-4 bg-rose-600/20 border-0 text-rose-600 text-sm font-bold hover:bg-rose-600/30"
          >
            Request Sample
          </Button>
          <Button className="flex items-center justify-center rounded-lg h-12 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold">
            Customize &amp; Order
          </Button>
        </div>
      </footer>
    </div>
  );
};
