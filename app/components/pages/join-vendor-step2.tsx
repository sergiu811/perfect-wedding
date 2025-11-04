import React, { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";

export const JoinVendorStep2 = () => {
  const { navigate } = useRouter();
  const [selectedMembership, setSelectedMembership] = useState("basic");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/join-vendor/step-3");
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/join-vendor")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Business Details
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center">
          Step 2 of 3: Business Offering
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6">
        <form onSubmit={handleContinue} className="space-y-6">
          {/* Business Type Dropdown */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Business Type
            </label>
            <div className="relative">
              <select
                defaultValue=""
                className="appearance-none w-full bg-white text-gray-900 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
              >
                <option value="" disabled>
                  Select your business type
                </option>
                <option value="venue">Venue</option>
                <option value="photo_video">Photo &amp; Video</option>
                <option value="music_dj">Music/DJ</option>
                <option value="decorations">Decorations</option>
                <option value="invitations">Invitations</option>
                <option value="sweets">Sweets</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Membership Level */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Membership Level
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-start p-4 bg-white rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${
                  selectedMembership === "basic"
                    ? "ring-2 ring-rose-600"
                    : "hover:shadow-md"
                }`}
              >
                <input
                  checked={selectedMembership === "basic"}
                  onChange={() => setSelectedMembership("basic")}
                  className="mt-1 h-5 w-5 border-2 border-gray-400 text-rose-600 focus:ring-rose-600/50 flex-shrink-0"
                  name="membership"
                  type="radio"
                  value="basic"
                />
                <div className="ml-4">
                  <p className="font-bold text-gray-900">Basic</p>
                  <p className="text-sm text-gray-600 mt-1">
                    • Basic listing in vendor directory
                  </p>
                  <p className="text-sm text-gray-600">
                    • Direct messaging with clients
                  </p>
                  <p className="text-sm text-gray-600">
                    • Profile customization
                  </p>
                  <p className="text-lg font-bold text-rose-600 mt-2">Free</p>
                </div>
              </label>

              <label
                className={`flex items-start p-4 bg-white rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${
                  selectedMembership === "premium"
                    ? "ring-2 ring-rose-600 bg-rose-50"
                    : "hover:shadow-md"
                }`}
              >
                <input
                  checked={selectedMembership === "premium"}
                  onChange={() => setSelectedMembership("premium")}
                  className="mt-1 h-5 w-5 border-2 border-gray-400 text-rose-600 focus:ring-rose-600/50 flex-shrink-0"
                  name="membership"
                  type="radio"
                  value="premium"
                />
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">Premium</p>
                    <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    • Featured listing with priority placement
                  </p>
                  <p className="text-sm text-gray-600">
                    • Priority support and analytics
                  </p>
                  <p className="text-sm text-gray-600">
                    • Custom portfolio showcase
                  </p>
                  <p className="text-sm text-gray-600">• Verified badge</p>
                  <p className="text-lg font-bold text-rose-600 mt-2">
                    $29/month
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Discount Code Management */}
          <div className="space-y-2">
            <label
              className="text-base font-semibold text-gray-900"
              htmlFor="discount_code"
            >
              Discount Code Management
            </label>
            <p className="text-sm text-gray-600">
              Create a special discount code for couples booking through our
              platform
            </p>
            <div className="flex items-center bg-white rounded-lg h-14 px-4 shadow-sm focus-within:ring-2 focus-within:ring-rose-600/50 transition-all duration-300">
              <input
                className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 border-none focus:ring-0"
                id="discount_code"
                placeholder="e.g., NUNTA10 for 10% off"
                type="text"
              />
              <button
                type="button"
                className="text-rose-600 font-bold text-sm hover:text-rose-700"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg tracking-wide shadow-lg"
        >
          Continue
        </Button>
        <button
          onClick={() => navigate("/join-vendor")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
