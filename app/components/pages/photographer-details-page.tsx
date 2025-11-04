import React, { useState } from "react";
import { Heart, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { PHOTOGRAPHERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface PhotographerDetailsPageProps {
  photographerId: string;
}

export const PhotographerDetailsPage = ({
  photographerId,
}: PhotographerDetailsPageProps) => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photographer = PHOTOGRAPHERS.find(
    (p) => p.id === parseInt(photographerId)
  );

  if (!photographer) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Photographer Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The photographer you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/photo-video")}>
            Back to Photo & Video
          </Button>
        </div>
      </div>
    );
  }

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
        </div>
      </header>

      <main className="flex-grow">
        {/* Image Carousel */}
        <div className="relative h-64 lg:h-96">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url(${photographer.portfolio[currentImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Navigation Arrows */}
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

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {photographer.portfolio.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900">
              {photographer.businessName}
            </h1>
            <p className="mt-2 text-base lg:text-lg text-gray-700">{photographer.description}</p>
          </div>

          {/* About & Specialty */}
          <div className="p-4 lg:p-6 bg-white rounded-xl space-y-4 shadow-sm">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">About</h3>
              <p className="mt-2 text-base lg:text-lg text-gray-700">{photographer.about}</p>
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Specialty</h3>
              <p className="mt-2 text-base lg:text-lg text-gray-700">{photographer.specialty}</p>
            </div>
          </div>

          {/* Packages & Pricing */}
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
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              Testimonials
            </h3>
            <div className="space-y-6">
              {photographer.testimonials.map((testimonial) => (
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

          {/* Rating Summary */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-pink-50/95 backdrop-blur-sm p-4 border-t border-gray-200">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 py-3 text-center text-sm font-bold rounded-full border-2 border-gray-300 hover:bg-gray-50"
          >
            View Portfolio
          </Button>
          <Button 
            onClick={() => navigate(`/contact-vendor/${photographer.id}?name=${encodeURIComponent(photographer.name)}&category=photo-video`)}
            className="flex-1 py-3 text-center text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full"
          >
            Check Availability
          </Button>
        </div>
      </footer>
    </div>
  );
};
