import React, { useState } from "react";
import { ArrowLeft, Upload, X, Calendar, Plus, Trash2, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";

interface ServicePackage {
  id: string;
  name: string;
  price: string;
  description: string;
}

export const AddServiceStep3 = () => {
  const { navigate } = useRouter();
  const { updateFormData, formData } = useServiceForm();
  const [selectedDays, setSelectedDays] = useState<string[]>(
    formData.availableDays || []
  );
  const [packages, setPackages] = useState<ServicePackage[]>(
    formData.packages || []
  );

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    updateFormData({
      serviceRegion: formDataObj.get("serviceRegion") as string,
      videoLink: formDataObj.get("videoLink") as string,
      availableDays: selectedDays,
      packages: packages,
    });

    navigate("/add-service/step-4");
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const addPackage = () => {
    const newPackage: ServicePackage = {
      id: Date.now().toString(),
      name: "",
      price: "",
      description: "",
    };
    setPackages([...packages, newPackage]);
  };

  const removePackage = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const updatePackage = (id: string, field: keyof ServicePackage, value: string) => {
    setPackages(
      packages.map((pkg) =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate("/add-service/step-2")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-6">
          Media & Availability
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center font-medium">
          Step 3 of 4: Media & Availability
        </p>
      </div>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <form className="space-y-6">
          {/* Photo Gallery Upload */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Photo Gallery *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photoUpload"
              />
              <label
                htmlFor="photoUpload"
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    Upload Photos
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Upload at least 5 high-quality photos showcasing your work
            </p>
          </div>

          {/* Video Upload or Link */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Video (Optional)
            </label>
            <Input
              name="videoLink"
              defaultValue={formData.videoLink}
              type="url"
              placeholder="YouTube or Vimeo link"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
            />
            <div className="text-center text-sm text-gray-500">or</div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="videoUpload"
              />
              <label
                htmlFor="videoUpload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Upload Video File
                </p>
                <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
              </label>
            </div>
          </div>

          {/* Service Packages */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-rose-600" />
                <label className="text-base font-bold text-gray-900">
                  Service Packages (Optional)
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Offer different packages at various price points to give couples more options
            </p>

            {packages.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">
                  No packages added yet
                </p>
                <Button
                  type="button"
                  onClick={addPackage}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg h-10 px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Package
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <div
                    key={pkg.id}
                    className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-rose-600">
                        Package {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePackage(pkg.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Package Name *
                      </label>
                      <Input
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(pkg.id, "name", e.target.value)
                        }
                        placeholder="e.g., Basic Package, Premium Package"
                        className="w-full bg-white border border-gray-200 rounded-lg h-11 px-3 focus:ring-2 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          value={pkg.price}
                          onChange={(e) =>
                            updatePackage(pkg.id, "price", e.target.value)
                          }
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full bg-white border border-gray-200 rounded-lg h-11 pl-7 pr-3 focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        Description *
                      </label>
                      <textarea
                        value={pkg.description}
                        onChange={(e) =>
                          updatePackage(pkg.id, "description", e.target.value)
                        }
                        placeholder="Describe what's included in this package..."
                        className="w-full bg-white border border-gray-200 rounded-lg min-h-[80px] p-3 focus:ring-2 focus:ring-rose-600 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addPackage}
                  variant="outline"
                  className="w-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Package
                </Button>
              </div>
            )}
          </div>

          {/* Availability Calendar */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Available Days *
            </label>
            <p className="text-sm text-gray-600">
              Select the days you typically offer your service
            </p>
            <div className="space-y-2">
              {weekDays.map((day) => (
                <label
                  key={day}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{day}</span>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-2 focus:ring-rose-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Booking Lead Time */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Minimum Booking Lead Time
            </label>
            <select
              name="leadTime"
              defaultValue={formData.leadTime || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
            >
              <option value="">Select lead time</option>
              <option value="1-week">1 week</option>
              <option value="2-weeks">2 weeks</option>
              <option value="1-month">1 month</option>
              <option value="2-months">2 months</option>
              <option value="3-months">3 months</option>
              <option value="6-months">6 months</option>
              <option value="1-year">1 year</option>
            </select>
            <p className="text-xs text-gray-500">
              How far in advance should couples book?
            </p>
          </div>

          {/* Service Region */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Service Region / Travel Area *
            </label>
            <Input
              name="serviceRegion"
              defaultValue={formData.serviceRegion}
              placeholder="e.g., New York City and surrounding areas"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              required
            />
            <p className="text-xs text-gray-500">
              Where do you provide your service?
            </p>
          </div>

          {/* Travel Options */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Travel Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="localOnly"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Local area only</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="regionalTravel"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Regional travel available</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="nationalTravel"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>National travel available</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="internationalTravel"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>International travel available</span>
              </label>
            </div>
          </div>

          {/* Seasonal Availability */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Seasonal Availability
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="seasonSpring"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Spring</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="seasonSummer"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Summer</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="seasonFall"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Fall</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="seasonWinter"
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Winter</span>
              </label>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 space-y-3 bg-white border-t border-gray-200">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base shadow-lg"
        >
          Continue to Review & Publish
        </Button>
        <button
          onClick={() => navigate("/add-service/step-2")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
