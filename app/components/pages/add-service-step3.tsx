import { ArrowLeft, Package, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";
import { useAuth } from "~/contexts/auth-context";
import { useSupabase } from "~/lib/supabase.client";

interface ServicePackage {
  id: string;
  name: string;
  price: string;
  description: string;
}

export const AddServiceStep3 = () => {
  const { navigate } = useRouter();
  const { updateFormData, formData } = useServiceForm();
  const { user } = useAuth();
  const supabase = useSupabase();
  const [selectedDays, setSelectedDays] = useState<string[]>(
    formData.availableDays || []
  );
  const [packages, setPackages] = useState<ServicePackage[]>(
    formData.packages || []
  );
  const [leadTime, setLeadTime] = useState(formData.leadTime || "");
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; path: string }[]
  >(
    (formData.images || []).map((url) => ({
      url,
      path: extractStoragePath(url),
    }))
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removingImagePath, setRemovingImagePath] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<{ gallery?: string; days?: string }>({});
  const galleryRef = useRef<HTMLDivElement>(null);
  const availableDaysRef = useRef<HTMLDivElement>(null);

  const clearError = (field: keyof typeof errors) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    setUploadedImages(
      (formData.images || []).map((url) => ({
        url,
        path: extractStoragePath(url),
      }))
    );
  }, [formData.images]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (!user) {
      setUploadError("You need to be signed in to upload images.");
      return;
    }

    setIsUploadingImages(true);
    setUploadError(null);

    const newImages: { url: string; path: string }[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          setUploadError("Each image must be smaller than 10MB.");
          continue;
        }

        const extension = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${extension}`;
        const filePath = `${user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from("service-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (error) {
          console.error("Image upload error:", error);
          setUploadError(error.message);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("service-images").getPublicUrl(filePath);

        newImages.push({ url: publicUrl, path: filePath });
      }

      if (newImages.length > 0) {
        setUploadedImages((prev) => {
          const updated = [...prev, ...newImages];
          updateFormData({ images: updated.map((image) => image.url) });
          return updated;
        });
        clearError("gallery");
      }
    } catch (error) {
      console.error("Unexpected image upload error:", error);
      setUploadError(
        "There was a problem uploading your images. Please try again."
      );
    } finally {
      setIsUploadingImages(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = async (path: string) => {
    setRemovingImagePath(path);
    try {
      await supabase.storage.from("service-images").remove([path]);
    } catch (error) {
      console.error("Error removing image from storage:", error);
    } finally {
      setUploadedImages((prev) => {
        const updated = prev.filter((image) => image.path !== path);
        updateFormData({ images: updated.map((image) => image.url) });
        return updated;
      });
      setRemovingImagePath(null);
    }
  };

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);
    const videoLink = (formDataObj.get("videoLink") as string) || "";
    const leadTimeValue = leadTime || (formDataObj.get("leadTime") as string);

    if (uploadedImages.length === 0) {
      setErrors((prev) => ({
        ...prev,
        gallery: "Please upload at least one photo before continuing.",
      }));
      if (galleryRef.current) {
        galleryRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    clearError("gallery");

    if (selectedDays.length === 0) {
      setErrors((prev) => ({
        ...prev,
        days: "Select at least one day you are available.",
      }));
      if (availableDaysRef.current) {
        availableDaysRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    clearError("days");

    updateFormData({
      videoLink,
      availableDays: selectedDays,
      packages: packages,
      leadTime: leadTimeValue || "",
      images: uploadedImages.map((image) => image.url),
    });

    navigate("/add-service/step-4");
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    clearError("days");
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

  const updatePackage = (
    id: string,
    field: keyof ServicePackage,
    value: string
  ) => {
    setPackages(
      packages.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg))
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
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/add-service/step-2")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Media & Availability
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center font-medium">
          Step 3 of 4: Media & Availability
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto pb-32 lg:pb-40">
        <form className="space-y-6">
          {/* Photo Gallery Upload */}
          <div
            ref={galleryRef}
            className="bg-white rounded-xl p-4 shadow-sm space-y-3"
          >
            <label className="text-base font-bold text-gray-900">
              Photo Gallery *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                errors.gallery
                  ? "border-red-400 hover:border-red-500"
                  : "border-gray-300 hover:border-rose-400"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photoUpload"
                onChange={handleImageUpload}
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
            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}
            {errors.gallery && (
              <p className="text-xs text-red-600">{errors.gallery}</p>
            )}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {uploadedImages.map((image) => (
                  <div
                    key={image.path}
                    className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={image.url}
                      alt="Service"
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.path)}
                      disabled={removingImagePath === image.path}
                      className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-white disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      {removingImagePath === image.path
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isUploadingImages && (
              <p className="text-xs text-gray-600">Uploading images...</p>
            )}
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
              Offer different packages at various price points to give couples
              more options
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
          <div
            ref={availableDaysRef}
            className="bg-white rounded-xl p-4 shadow-sm space-y-3"
          >
            <label className="text-base font-bold text-gray-900">
              Available Days *
            </label>
            <p className="text-sm text-gray-600">
              Select the days you typically offer your service
            </p>
            <div
              className={`space-y-2 ${
                errors.days ? "rounded-lg border border-red-400 p-3" : ""
              }`}
            >
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
            {errors.days && (
              <p className="text-xs text-red-600">{errors.days}</p>
            )}
          </div>

          {/* Booking Lead Time */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Minimum Booking Lead Time
            </label>
            <select
              name="leadTime"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
            >
              <option value="">Select lead time</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
              <option value="60">2 months</option>
              <option value="90">3 months</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
            </select>
            <p className="text-xs text-gray-500">
              How far in advance should couples book?
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 mb-16 lg:mb-0 lg:left-64 xl:left-72">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
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

function extractStoragePath(url: string): string {
  const delimiter = "/object/public/service-images/";
  const index = url.indexOf(delimiter);
  if (index === -1) {
    return url;
  }
  return url.slice(index + delimiter.length);
}
