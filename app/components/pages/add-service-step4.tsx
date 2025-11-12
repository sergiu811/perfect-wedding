import React, { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  CheckCircle,
  MapPin,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";

export const AddServiceStep4 = () => {
  const { navigate } = useRouter();
  const {
    formData,
    resetFormData,
    isEditing,
    editingServiceId,
    startNewService,
  } = useServiceForm();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<
    "created" | "updated" | null
  >(null);

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const endpoint =
        isEditing && editingServiceId
          ? `/api/services/${editingServiceId}`
          : "/api/services";

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          priceMin: formData.priceMin,
          priceMax: formData.priceMax,
          location: formData.location,
          contactMethod: formData.contactMethod,
          tags: formData.tags,
          videoLink: formData.videoLink,
          availableDays: formData.availableDays,
          packages: formData.packages || [],
          specificFields: formData.specificFields || {},
          serviceRegion: formData.serviceRegion ?? formData.location,
          images: formData.images || [],
          leadTime: formData.leadTime,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save service");
      }

      setPublishResult(isEditing ? "updated" : "created");
      startNewService();
    } catch (error) {
      console.error("Error publishing service:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to publish service. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddAnother = () => {
    startNewService();
    navigate("/add-service/step-1");
  };

  const handleGoToDashboard = () => {
    resetFormData();
    navigate("/vendor-dashboard");
  };

  if (publishResult) {
    return (
      <div className="min-h-screen flex flex-col bg-pink-50 justify-center items-center p-4">
        <div className="max-w-2xl mx-auto w-full flex flex-col justify-center items-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center w-full max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {publishResult === "created"
                ? "Service Published!"
                : "Service Updated!"}
            </h2>
            <p className="text-gray-600 mb-8">
              {publishResult === "created"
                ? "Your service has been successfully submitted and is now live. Couples can now discover and contact you!"
                : "Your service changes have been saved. Couples will now see the updated details!"}
            </p>
            <div className="space-y-3">
              {publishResult === "created" ? (
                <>
                  <Button
                    onClick={handleAddAnother}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-12"
                  >
                    Add Another Service
                  </Button>
                  <Button
                    onClick={handleGoToDashboard}
                    className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-full h-12"
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGoToDashboard}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-12"
                >
                  Back to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/add-service/step-3")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Review & Publish
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center font-medium">
          Step 4 of 4: Review & Publish
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto pb-32 lg:pb-40">
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-sm font-medium mb-2 opacity-90">PREVIEW</p>
          <h2 className="text-2xl font-bold mb-2">
            {formData.title || "Your Service Title"}
          </h2>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>{formData.location || "Location"}</span>
          </div>
          {formData.priceMin && formData.priceMax && (
            <div className="mt-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-lg font-bold">
                ${formData.priceMin} - ${formData.priceMax}
              </span>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Basic Information
            </h3>
            <button
              onClick={() => navigate("/add-service/step-1")}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Title
              </p>
              <p className="text-gray-900 font-medium">
                {formData.title || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Category
              </p>
              <p className="text-gray-900 font-medium">
                {formData.category
                  ? formData.category.charAt(0).toUpperCase() +
                    formData.category.slice(1).replace("-", " & ")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Description
              </p>
              <p className="text-gray-900">{formData.description || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Price Range
              </p>
              <p className="text-gray-900 font-medium">
                {formData.priceMin && formData.priceMax
                  ? `$${formData.priceMin} - $${formData.priceMax}`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Location
              </p>
              <p className="text-gray-900">{formData.location || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Contact Method
              </p>
              <p className="text-gray-900">{formData.contactMethod || "—"}</p>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category-Specific Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Category Details
            </h3>
            <button
              onClick={() => navigate("/add-service/step-2")}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">
              All category-specific details have been saved and will appear in
              your listing.
            </p>
          </div>
        </div>

        {/* Media & Availability */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Media & Availability
            </h3>
            <button
              onClick={() => navigate("/add-service/step-3")}
              className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">
                Service Region
              </p>
              <p className="text-gray-900">
                {formData.serviceRegion || formData.location || "—"}
              </p>
            </div>
            {formData.availableDays && formData.availableDays.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-2">
                  Available Days
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.availableDays.map((day: string) => (
                    <span
                      key={day}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {formData.videoLink && (
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Video Link
                </p>
                <a
                  href={formData.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline text-sm"
                >
                  {formData.videoLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded text-rose-600 mt-0.5 flex-shrink-0"
              required
            />
            <span className="text-sm text-blue-900">
              I agree to the{" "}
              <a href="#" className="underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline font-medium">
                Privacy Policy
              </a>
              . I confirm that all information provided is accurate and that I
              have the right to offer this service.
            </span>
          </label>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 mb-16 lg:mb-0 lg:left-64 xl:left-72">
        <Button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Publishing...
            </span>
          ) : (
            "Publish Service"
          )}
        </Button>
        <button
          onClick={() => navigate("/add-service/step-3")}
          disabled={isPublishing}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600 disabled:opacity-50"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
