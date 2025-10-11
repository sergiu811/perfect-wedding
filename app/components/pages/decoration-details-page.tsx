import React, { useState } from "react";
import { ArrowLeft, Heart, Share } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { DECORATIONS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface DecorationDetailsPageProps {
  decorationId: string;
}

export const DecorationDetailsPage = ({
  decorationId,
}: DecorationDetailsPageProps) => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const decoration = DECORATIONS.find((d) => d.id === parseInt(decorationId));

  if (!decoration) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Decoration Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The decoration you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/decorations")}>
            Back to Decorations
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
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
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
          </div>
        </div>
      </header>

      <main className="flex-grow pb-24">
        {/* Hero Image with Carousel */}
        <div className="h-80 bg-cover bg-center relative">
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
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {decoration.name}
            </h1>
            <p className="text-gray-600 mt-2">{decoration.description}</p>
          </div>

          {/* Available Styles */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Available Styles
            </h2>
            <div className="flex flex-wrap gap-3">
              {decoration.styles.map((style, index) => (
                <span
                  key={index}
                  className="bg-rose-600/20 text-gray-900 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Pricing</h2>
              <p className="text-gray-600">{decoration.pricingDetails}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                Customization
              </h2>
              <p className="text-gray-600">{decoration.customization}</p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                Rental & Purchase
              </h2>
              <p className="text-gray-600">{decoration.rentalInfo}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Reviews</h2>
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

          {/* Individual Reviews */}
          {decoration.reviews.length > 0 && (
            <div className="space-y-6">
              {decoration.reviews.map((review) => (
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
      <footer className="sticky bottom-0 bg-pink-50/95 backdrop-blur-sm shadow-t-sm">
        <div className="p-4">
          <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-lg text-lg">
            Inquire Now
          </Button>
        </div>
      </footer>
    </div>
  );
};
