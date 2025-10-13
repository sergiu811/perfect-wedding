import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

export const PlanningStep1 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = usePlanning();

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    updateFormData({
      partner1Name: formDataObj.get("partner1Name") as string,
      partner2Name: formDataObj.get("partner2Name") as string,
      weddingDate: formDataObj.get("weddingDate") as string,
      guestCount: formDataObj.get("guestCount") as string,
      budgetMin: formDataObj.get("budgetMin") as string,
      budgetMax: formDataObj.get("budgetMax") as string,
      location: formDataObj.get("location") as string,
      weddingType: formDataObj.get("weddingType") as string,
      language: formDataObj.get("language") as string,
      referralSource: formDataObj.get("referralSource") as string,
    });

    navigate("/planning/step-2");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => navigate("/")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-6">
          Start Planning
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center font-medium">
          Step 1 of 4: Wedding Overview
        </p>
      </div>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div className="text-center mb-6">
          <Heart className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Let's Start Your Journey
          </h2>
          <p className="text-gray-600">
            Tell us about your special day so we can create the perfect plan for
            you
          </p>
        </div>

        <form className="space-y-6">
          {/* Partner Names */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Partner Names *
            </label>
            <Input
              name="partner1Name"
              defaultValue={formData.partner1Name}
              placeholder="Partner 1 Name"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            />
            <Input
              name="partner2Name"
              defaultValue={formData.partner2Name}
              placeholder="Partner 2 Name"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            />
          </div>

          {/* Wedding Date */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Wedding Date *
            </label>
            <Input
              name="weddingDate"
              type="date"
              defaultValue={formData.weddingDate}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            />
          </div>

          {/* Guest Count */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Expected Guest Count *
            </label>
            <Input
              name="guestCount"
              type="number"
              min="1"
              defaultValue={formData.guestCount}
              placeholder="e.g., 100"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            />
            <p className="text-xs text-gray-500">
              You can adjust this later as plans evolve
            </p>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Estimated Budget ($) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  name="budgetMin"
                  type="number"
                  min="0"
                  defaultValue={formData.budgetMin}
                  placeholder="Min"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                  required
                />
              </div>
              <div>
                <Input
                  name="budgetMax"
                  type="number"
                  min="0"
                  defaultValue={formData.budgetMax}
                  placeholder="Max"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              This helps us recommend vendors in your price range
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Wedding Location *
            </label>
            <Input
              name="location"
              defaultValue={formData.location}
              placeholder="City or Region"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            />
          </div>

          {/* Wedding Type */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Wedding Type *
            </label>
            <select
              name="weddingType"
              defaultValue={formData.weddingType || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            >
              <option value="" disabled>
                Select wedding type
              </option>
              <option value="traditional">Traditional</option>
              <option value="destination">Destination</option>
              <option value="civil">Civil Ceremony</option>
              <option value="religious">Religious</option>
              <option value="elopement">Elopement</option>
              <option value="intimate">Intimate Gathering</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Preferred Language */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Preferred Language
            </label>
            <select
              name="language"
              defaultValue={formData.language || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="italian">Italian</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* How did you hear about us */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              How did you hear about us?
            </label>
            <select
              name="referralSource"
              defaultValue={formData.referralSource || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
            >
              <option value="">Select an option</option>
              <option value="social">Social Media</option>
              <option value="friend">Friend/Family</option>
              <option value="search">Search Engine</option>
              <option value="vendor">Vendor Recommendation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 space-y-3 bg-white border-t border-gray-200">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base shadow-lg"
        >
          Next: Style & Theme
        </Button>
        <button
          onClick={() => navigate("/")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Cancel
        </button>
      </footer>
    </div>
  );
};
