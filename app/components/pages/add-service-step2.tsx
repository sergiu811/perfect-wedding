import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";

export const AddServiceStep2 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = useServiceForm();
  const category = formData.category || "venue";

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    // Collect all form data
    const categoryData: any = {};
    formDataObj.forEach((value, key) => {
      categoryData[key] = value;
    });

    updateFormData(categoryData);
    navigate("/add-service/step-3");
  };

  // Render category-specific fields
  const renderCategoryFields = () => {
    switch (category) {
      case "venue":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Venue Type *
              </label>
              <select
                name="venueType"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              >
                <option value="">Select venue type</option>
                <option value="ballroom">Ballroom</option>
                <option value="garden">Garden</option>
                <option value="restaurant">Restaurant</option>
                <option value="terrace">Terrace</option>
                <option value="barn">Barn</option>
                <option value="hotel">Hotel</option>
                <option value="beach">Beach</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Capacity *
              </label>
              <Input
                name="capacity"
                type="number"
                min="1"
                placeholder="Number of guests"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Location Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="locationType"
                    value="indoor"
                    className="w-5 h-5 text-rose-600"
                    required
                  />
                  <span>Indoor</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="locationType"
                    value="outdoor"
                    className="w-5 h-5 text-rose-600"
                  />
                  <span>Outdoor</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="locationType"
                    value="both"
                    className="w-5 h-5 text-rose-600"
                  />
                  <span>Both</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Catering Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="cateringInHouse"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>In-house catering</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="cateringExternal"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>External catering allowed</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="cateringNone"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>No catering</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Parking Available
                </span>
                <input
                  type="checkbox"
                  name="parking"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Accommodation Available
                </span>
                <input
                  type="checkbox"
                  name="accommodation"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Menu Price per Person ($)
              </label>
              <Input
                name="menuPrice"
                type="number"
                min="0"
                placeholder="e.g., 75"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>
        );

      case "photo-video":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Package Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="packagePhoto"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Photography</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="packageVideo"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Videography</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="packageBoth"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Photography + Videography</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Coverage Duration (hours) *
              </label>
              <Input
                name="duration"
                type="number"
                min="1"
                placeholder="e.g., 8"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Number of Photographers/Videographers *
              </label>
              <Input
                name="teamSize"
                type="number"
                min="1"
                placeholder="e.g., 2"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Drone Option Available
                </span>
                <input
                  type="checkbox"
                  name="drone"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Editing & Delivery Time *
              </label>
              <Input
                name="deliveryTime"
                placeholder="e.g., 4-6 weeks"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Delivery Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="formatUSB"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>USB Drive</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="formatOnline"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Online Gallery</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="formatAlbum"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Printed Album</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Travel Available
                </span>
                <input
                  type="checkbox"
                  name="travel"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>
          </div>
        );

      case "music-dj":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Service Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceDJ"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>DJ</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceBand"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Live Band</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceMC"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>MC Services</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceSinger"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Singer</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Genres Played *
              </label>
              <Input
                name="genres"
                placeholder="e.g., Pop, Rock, Jazz, Electronic"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Performance Duration (hours) *
              </label>
              <Input
                name="performanceDuration"
                type="number"
                min="1"
                placeholder="e.g., 4"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Equipment Included
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="equipSound"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Sound System</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="equipLighting"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Lighting</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="equipMics"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Microphones</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Setup Time (hours)
              </label>
              <Input
                name="setupTime"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 2"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Playlist Customization
                </span>
                <input
                  type="checkbox"
                  name="playlistCustom"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>
          </div>
        );

      case "decorations":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Decoration Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorFloral"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Floral Arrangements</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorLighting"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Lighting</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorTable"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Table Design</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorStage"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Stage Setup</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Theme Styles *
              </label>
              <Input
                name="themeStyles"
                placeholder="e.g., Rustic, Glam, Minimal"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Setup & Teardown Included
                </span>
                <input
                  type="checkbox"
                  name="setupIncluded"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Average Setup Time (hours)
              </label>
              <Input
                name="setupTimeHours"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g., 3"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>
        );

      case "invitations":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Invitation Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="typePrinted"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Printed</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="typeDigital"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Digital</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="typeHandmade"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Handmade</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Printing Materials
              </label>
              <Input
                name="materials"
                placeholder="e.g., Cardstock, Shimmer, Kraft"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Minimum Order Quantity *
              </label>
              <Input
                name="minOrder"
                type="number"
                min="1"
                placeholder="e.g., 50"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Delivery Time (days) *
              </label>
              <Input
                name="deliveryDays"
                type="number"
                min="1"
                placeholder="e.g., 14"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Design Service Included
                </span>
                <input
                  type="checkbox"
                  name="designIncluded"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>
          </div>
        );

      case "sweets":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Service Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetCake"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Wedding Cake</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetCandyBar"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Candy Bar</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetCupcakes"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Cupcakes</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetMacarons"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Macarons</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Flavors Offered *
              </label>
              <Input
                name="flavors"
                placeholder="e.g., Vanilla, Chocolate, Red Velvet"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                required
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Tasting Available
                </span>
                <input
                  type="checkbox"
                  name="tasting"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Dietary Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dietVegan"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Vegan</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dietGluten"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Gluten-free</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dietSugar"
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Sugar-free</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Delivery Included
                </span>
                <input
                  type="checkbox"
                  name="deliveryIncluded"
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-900">
              Please select a category in Step 1
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate("/add-service/step-1")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-6">
          Service Details
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center font-medium">
          Step 2 of 4: Category-Specific Details
        </p>
      </div>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <p className="text-sm text-rose-900">
            <span className="font-semibold">Category:</span>{" "}
            {category.charAt(0).toUpperCase() +
              category.slice(1).replace("-", " & ")}
          </p>
        </div>

        <form className="space-y-6">{renderCategoryFields()}</form>
      </main>

      {/* Footer */}
      <footer className="p-4 space-y-3 bg-white border-t border-gray-200">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base shadow-lg"
        >
          Continue to Media & Availability
        </Button>
        <button
          onClick={() => navigate("/add-service/step-1")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
