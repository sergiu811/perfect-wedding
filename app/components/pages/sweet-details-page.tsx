import React, { useState } from "react";
import { ArrowLeft, Heart, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { StarRating } from "~/components/venues";
import { SWEETS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface SweetDetailsPageProps {
  sweetId: string;
}

export const SweetDetailsPage = ({ sweetId }: SweetDetailsPageProps) => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const sweet = SWEETS.find((s) => s.id === parseInt(sweetId));

  if (!sweet) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sweet Vendor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The sweet vendor you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/sweets")}>Back to Sweets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-pink-50/95 p-4 backdrop-blur-sm">
          <button onClick={() => navigate("/sweets")}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button onClick={() => setIsFavorite(!isFavorite)}>
            <Heart
              className="w-6 h-6 text-gray-900"
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        </header>

        {/* Hero Image */}
        <div className="aspect-h-3 aspect-w-4">
          <div
            className="h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${sweet.image})` }}
          />
        </div>

        <div className="space-y-8 p-4">
          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{sweet.name}</h1>
            <p className="text-gray-600">{sweet.description}</p>
          </div>

          {/* Specialty */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Specialty</h2>
            <p className="text-gray-600">{sweet.specialty}</p>
          </div>

          {/* Sample Menus */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Sample Offerings
            </h2>
            <div className="space-y-4">
              {sweet.sampleMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm"
                >
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">{menu.name}</p>
                      <p className="font-bold text-gray-900">{menu.title}</p>
                      <p className="text-sm text-gray-600">
                        {menu.description}
                      </p>
                    </div>
                    <button className="rounded bg-rose-600/20 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-600/30">
                      View Details
                    </button>
                  </div>
                  <div
                    className="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${menu.image})` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Packages */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Pricing Packages
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sweet.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`flex flex-col gap-4 rounded-xl border p-6 shadow-sm ${
                    pkg.highlighted
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
                  <ul className="space-y-2 text-sm text-gray-600">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-rose-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Accommodations */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Dietary Accommodations
            </h2>
            <p className="text-gray-600">{sweet.dietaryAccommodations}</p>
          </div>

          {/* Service Styles */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Service Options</h2>
            <div className="space-y-2">
              {sweet.serviceOptions.map((option, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input
                    checked={option.checked}
                    className="h-5 w-5 rounded border-gray-300 bg-transparent text-rose-600 focus:ring-rose-600"
                    type="checkbox"
                    readOnly
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Calendar Placeholder */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Availability</h2>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-center text-gray-600">
                Contact vendor for availability
              </p>
            </div>
          </div>

          {/* Testimonials */}
          {sweet.reviews.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
              <div className="space-y-4">
                {sweet.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full bg-cover bg-center"
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
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Inquiry Form</h2>
            <form className="space-y-4">
              <Input
                className="w-full rounded-lg border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-rose-600 focus:ring-rose-600"
                placeholder="Your Name"
                type="text"
              />
              <Input
                className="w-full rounded-lg border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-rose-600 focus:ring-rose-600"
                placeholder="Your Email"
                type="email"
              />
              <Input
                className="w-full rounded-lg border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-rose-600 focus:ring-rose-600"
                placeholder="Event Date"
                type="date"
              />
              <textarea
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-rose-600 focus:ring-rose-600"
                placeholder="Message (e.g., number of guests, flavor preferences)"
                rows={4}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/contact-vendor/${sweet.id}?name=${encodeURIComponent(sweet.name)}&category=sweets`);
                }}
                className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                Check Availability
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
