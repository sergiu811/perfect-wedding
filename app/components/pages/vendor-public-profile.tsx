import React, { useState } from "react";
import {
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Clock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { useRouter } from "~/contexts/router-context";

export const VendorPublicProfile = () => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample vendor data - would come from props/context in real app
  const vendor = {
    businessName: "Elegant Events Co.",
    category: "Wedding Planner",
    description:
      "Specializing in luxury weddings, Elegant Events Co. offers bespoke planning services.",
    about:
      "With over 10 years of experience in the wedding industry, we pride ourselves on creating unforgettable moments. Our team of dedicated professionals works closely with each couple to bring their dream wedding to life, handling every detail with precision and care.",
    location: "New York, NY",
    serviceAreas: "New York, New Jersey, Connecticut",
    phone: "+1 (555) 123-4567",
    email: "contact@elegantevents.com",
    website: "www.elegantevents.com",
    instagram: "@elegantevents",
    facebook: "facebook.com/elegantevents",
    businessHours:
      "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed",
    yearsOfExperience: 10,
    startingPrice: "$5,000",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Luxury Weddings", "Destination Weddings", "Event Design"],
    portfolio: [
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    ],
    services: [
      {
        id: 1,
        name: "Full Wedding Package",
        price: "$5,000",
        description: "Complete wedding planning from start to finish",
      },
      {
        id: 2,
        name: "Day-of Coordination",
        price: "$1,500",
        description: "Professional coordination on your wedding day",
      },
      {
        id: 3,
        name: "Venue Selection",
        price: "$800",
        description: "Expert assistance in finding the perfect venue",
      },
    ],
    testimonials: [
      {
        id: 1,
        author: "Sarah & Michael",
        date: "June 2024",
        rating: 5,
        comment:
          "Elegant Events made our wedding absolutely perfect! Every detail was handled with care and professionalism. Highly recommend!",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
      {
        id: 2,
        author: "Emily & James",
        date: "May 2024",
        rating: 5,
        comment:
          "Working with this team was a dream come true. They understood our vision and brought it to life beautifully.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
      {
        id: 3,
        author: "Jessica & David",
        date: "April 2024",
        rating: 5,
        comment:
          "Professional, creative, and so easy to work with. Our wedding was everything we hoped for and more!",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vendor.portfolio.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vendor.portfolio.length - 1 : prev - 1
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 92 },
    { stars: 4, percentage: 6 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/vendor-dashboard")}
            className="text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Public Profile</h2>
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

      <main className="flex-grow pb-20">
        {/* Image Carousel */}
        <div className="relative h-64">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url(${vendor.portfolio[currentImageIndex]})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Navigation Arrows */}
          {vendor.portfolio.length > 1 && (
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
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {vendor.portfolio.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Title & Category */}
          <div className="text-center">
            <p className="text-rose-600 text-sm font-semibold uppercase tracking-wide">
              {vendor.category}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {vendor.businessName}
            </h1>
            <p className="mt-2 text-gray-700">{vendor.description}</p>
            
            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <StarRating rating={vendor.rating} size="sm" />
              <span className="text-sm font-semibold text-gray-900">
                {vendor.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                ({vendor.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-rose-600">
                {vendor.yearsOfExperience}+
              </p>
              <p className="text-sm text-gray-600 mt-1">Years Experience</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-rose-600">
                {vendor.startingPrice}
              </p>
              <p className="text-sm text-gray-600 mt-1">Starting Price</p>
            </div>
          </div>

          {/* Specialties */}
          {vendor.specialties.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {vendor.specialties.map((specialty, index) => (
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
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{vendor.about}</p>
          </div>

          {/* Services & Pricing */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Services & Pricing
            </h3>
            <div className="space-y-3">
              {vendor.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-rose-600 ml-4">
                      {service.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">{vendor.location}</p>
                  <p className="text-sm text-gray-600">
                    Serving: {vendor.serviceAreas}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <a
                  href={`tel:${vendor.phone}`}
                  className="hover:text-rose-600 transition-colors"
                >
                  {vendor.phone}
                </a>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <a
                  href={`mailto:${vendor.email}`}
                  className="hover:text-rose-600 transition-colors"
                >
                  {vendor.email}
                </a>
              </div>

              {vendor.website && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <a
                    href={`https://${vendor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-600 transition-colors"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>

            {/* Social Media */}
            {(vendor.instagram || vendor.facebook) && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {vendor.instagram && (
                    <a
                      href={`https://instagram.com/${vendor.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-rose-600 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">{vendor.instagram}</span>
                    </a>
                  )}
                  {vendor.facebook && (
                    <a
                      href={`https://${vendor.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-rose-600 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
            </div>
            <div className="text-gray-700 whitespace-pre-line text-sm">
              {vendor.businessHours}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Client Testimonials
            </h3>
            <div className="space-y-4">
              {vendor.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                      src={testimonial.avatar}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">{testimonial.date}</p>
                    </div>
                    <StarRating rating={testimonial.rating} size="sm" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Rating Breakdown
            </h3>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-gray-900">
                  {vendor.rating.toFixed(1)}
                </p>
                <StarRating rating={vendor.rating} size="md" />
                <p className="text-sm text-gray-600 mt-2">
                  Based on {vendor.reviewCount} reviews
                </p>
              </div>
              <div className="flex-1 w-full space-y-2 text-sm">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-gray-900 font-medium w-3">
                      {item.stars}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-amber-500 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-600 w-10 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 text-sm font-bold rounded-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50"
          >
            Save to Favorites
          </Button>
          <Button className="flex-1 h-12 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md">
            Contact Vendor
          </Button>
        </div>
      </footer>
    </div>
  );
};
