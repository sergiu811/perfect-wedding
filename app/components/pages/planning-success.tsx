import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

export const PlanningSuccess = () => {
  const { navigate } = useRouter();
  const { formData, resetFormData } = usePlanning();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const topVendorSuggestions = [
    { name: "Elegant Venue Hall", category: "Venue", rating: 4.9 },
    {
      name: "Captured Moments Photography",
      category: "Photo & Video",
      rating: 4.8,
    },
    { name: "DJ SoundWave", category: "Music & DJ", rating: 4.7 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              {["🎉", "✨", "💕", "🌸"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <main className="flex-1 py-6 lg:py-8 space-y-6 lg:space-y-8 overflow-y-auto">
        <div className="w-full space-y-6 lg:space-y-8">
          {/* Success Icon */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 lg:w-16 lg:h-16 text-green-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Your Wedding Plan Is Ready!
            </h1>
            <p className="text-base lg:text-lg text-gray-600">
              We've created a personalized planning experience just for you
            </p>
          </div>

          {/* Key Summary */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl space-y-4 max-w-2xl mx-auto">
            <p className="text-sm lg:text-base font-bold text-gray-500 uppercase tracking-wide">
              Your Details
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-rose-600" />
                <div>
                  <p className="text-sm lg:text-base text-gray-500">Wedding Date</p>
                  <p className="font-semibold text-base lg:text-lg text-gray-900">
                    {formData.weddingDate
                      ? new Date(formData.weddingDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-rose-600" />
                <div>
                  <p className="text-sm lg:text-base text-gray-500">Theme</p>
                  <p className="font-semibold text-base lg:text-lg text-gray-900">
                    {formData.themes && formData.themes.length > 0
                      ? formData.themes
                          .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                          .join(", ")
                      : "Classic"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-rose-600" />
                <div>
                  <p className="text-sm lg:text-base text-gray-500">Budget Range</p>
                  <p className="font-semibold text-base lg:text-lg text-gray-900">
                    {formData.budgetMin && formData.budgetMax
                      ? `$${formData.budgetMin} - $${formData.budgetMax}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Vendor Suggestions */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl space-y-4 max-w-2xl mx-auto">
            <p className="text-sm lg:text-base font-bold text-gray-500 uppercase tracking-wide">
              Top Vendor Suggestions
            </p>
            <div className="space-y-3 lg:space-y-4">
              {topVendorSuggestions.map((vendor) => (
                <div
                  key={vendor.name}
                  className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-base lg:text-lg text-gray-900">{vendor.name}</p>
                    <p className="text-sm lg:text-base text-gray-500">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm lg:text-base font-medium">{vendor.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 lg:space-y-4 max-w-2xl mx-auto">
            <Button
              onClick={() => {
                resetFormData();
                navigate("/my-wedding");
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
            >
              Explore My Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/vendors")}
              className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg"
            >
              View Suggested Vendors
            </Button>
            <button
              onClick={() => navigate("/")}
              className="w-full text-sm lg:text-base font-medium text-gray-600 hover:text-rose-600 p-3"
            >
              Invite Partner to Collaborate
            </button>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6 max-w-2xl mx-auto">
            <p className="text-sm lg:text-base text-blue-900">
              <span className="font-semibold">💡 Pro Tip:</span> Start by
              booking your venue first—it's the foundation of your wedding
              planning!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
