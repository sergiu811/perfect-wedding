import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, Trash2, Cake, Music, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";

interface SampleOffering {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface AudioSample {
  id: string;
  name: string;
  file?: File;
  url?: string;
}

export const AddServiceStep2 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = useServiceForm();
  const category = formData.category || "venue";
  const specificFields = (formData.specificFields as Record<string, any>) || {};
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sampleErrors, setSampleErrors] = useState<
    Record<string, { name?: string; price?: string; description?: string }>
  >({});
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const normalizeSampleOfferings = (offerings: any): SampleOffering[] => {
    if (!Array.isArray(offerings)) return [];
    return offerings.map((item, index) => ({
      id:
        typeof item?.id === "string" && item.id.length > 0
          ? item.id
          : `sample-${index}-${Date.now()}`,
      name: item?.name ?? "",
      price:
        typeof item?.price === "number"
          ? item.price.toString()
          : (item?.price ?? ""),
      description: item?.description ?? "",
    }));
  };

  const normalizeAudioSamples = (samples: any): AudioSample[] => {
    if (!Array.isArray(samples)) return [];
    return samples.map((item, index) => ({
      id:
        typeof item?.id === "string" && item.id.length > 0
          ? item.id
          : `audio-${index}-${Date.now()}`,
      name: item?.name ?? "",
      url: item?.url,
    }));
  };

  const [sampleOfferings, setSampleOfferings] = useState<SampleOffering[]>(
    normalizeSampleOfferings(specificFields.sampleOfferings)
  );
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>(
    normalizeAudioSamples(specificFields.audioSamples)
  );

  const getFieldValue = (key: string, fallback: any = "") =>
    specificFields[key] ?? fallback;

  const getBooleanValue = (key: string) => {
    const value = specificFields[key];
    if (typeof value === "string") {
      return value === "true" || value === "on" || value === "1";
    }
    return Boolean(value);
  };

  const checkboxFieldMap: Record<string, string[]> = {
    venue: [
      "cateringInHouse",
      "cateringExternal",
      "cateringNone",
      "parking",
      "accommodation",
    ],
    photo_video: [
      "drone",
      "formatUSB",
      "formatOnline",
      "formatAlbum",
      "travel",
    ],
    music_dj: [
      "serviceDJ",
      "serviceBand",
      "serviceMC",
      "serviceSinger",
      "equipSound",
      "equipLighting",
      "equipMics",
      "playlistCustom",
    ],
    decorations: [
      "decorFloral",
      "decorLighting",
      "decorTable",
      "decorStage",
      "setupIncluded",
    ],
    invitations: [
      "typePrinted",
      "typeDigital",
      "typeHandmade",
      "designIncluded",
    ],
    sweets: [
      "sweetCake",
      "sweetCandyBar",
      "sweetCupcakes",
      "sweetMacarons",
      "tasting",
      "dietVegan",
      "dietGluten",
      "dietSugar",
      "deliveryIncluded",
    ],
  };

  useEffect(() => {
    setSampleOfferings(
      normalizeSampleOfferings(specificFields.sampleOfferings)
    );
    setAudioSamples(normalizeAudioSamples(specificFields.audioSamples));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.specificFields]);

  const requiredFieldsByCategory: Record<
    string,
    { name: string; label: string }[]
  > = {
    venue: [
      { name: "venueType", label: "Venue Type" },
      { name: "capacity", label: "Capacity" },
      { name: "locationType", label: "Location Type" },
    ],
    photo_video: [
      { name: "duration", label: "Coverage Duration" },
      { name: "teamSize", label: "Number of Photographers/Videographers" },
      { name: "deliveryTime", label: "Editing & Delivery Time" },
    ],
    music_dj: [
      { name: "genres", label: "Genres Played" },
      { name: "performanceDuration", label: "Performance Duration" },
    ],
    decorations: [{ name: "themeStyles", label: "Theme Styles" }],
    invitations: [
      { name: "minOrder", label: "Minimum Order Quantity" },
      { name: "deliveryDays", label: "Delivery Time" },
    ],
    sweets: [{ name: "flavors", label: "Flavors Offered" }],
  };

  const registerInputRef =
    (fieldName: string) => (element: HTMLInputElement | null) => {
      if (element) {
        fieldRefs.current[fieldName] = element;
      }
    };

  const registerSelectRef =
    (fieldName: string) => (element: HTMLSelectElement | null) => {
      if (element) {
        fieldRefs.current[fieldName] = element;
      }
    };

  const clearError = (fieldName: string) => {
    if (!errors[fieldName]) return;
    setErrors((prev) => {
      const { [fieldName]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const clearSampleError = (
    sampleId: string,
    key: keyof (typeof sampleErrors)[string]
  ) => {
    setSampleErrors((prev) => {
      const current = prev[sampleId];
      if (!current || !current[key]) return prev;
      const updated = { ...current };
      delete updated[key];
      const next = { ...prev, [sampleId]: updated };
      if (Object.keys(updated).length === 0) {
        delete next[sampleId];
      }
      return next;
    });
  };

  const getFieldClasses = (fieldName: string, baseClasses: string) =>
    `${baseClasses} ${
      errors[fieldName] ? "border-red-500 focus:ring-red-500" : ""
    }`;

  const handleContinue = () => {
    const form = document.querySelector("form") as HTMLFormElement | null;
    if (!form) return;

    const formDataObj = new FormData(form);
    const requiredFields = requiredFieldsByCategory[category] || [];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(({ name, label }) => {
      const value = formDataObj.get(name);
      if (!value || (typeof value === "string" && value.trim() === "")) {
        newErrors[name] = `${label} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSampleErrors({});
      const firstFieldName = Object.keys(newErrors)[0];
      const target = fieldRefs.current[firstFieldName];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if ("focus" in target && typeof target.focus === "function") {
          target.focus();
        }
      }
      return;
    }

    setErrors({});

    if (category === "sweets") {
      const nextSampleErrors: Record<
        string,
        { name?: string; price?: string; description?: string }
      > = {};

      sampleOfferings.forEach((sample) => {
        const sampleError: {
          name?: string;
          price?: string;
          description?: string;
        } = {};
        if (!sample.name.trim()) {
          sampleError.name = "Sample name is required.";
        }
        if (!sample.price.toString().trim()) {
          sampleError.price = "Sample price is required.";
        }
        if (!sample.description.trim()) {
          sampleError.description = "Sample description is required.";
        }
        if (Object.keys(sampleError).length > 0) {
          nextSampleErrors[sample.id] = sampleError;
        }
      });

      if (Object.keys(nextSampleErrors).length > 0) {
        setSampleErrors(nextSampleErrors);
        const firstSampleId = Object.keys(nextSampleErrors)[0];
        const target = document.getElementById(`sample-${firstSampleId}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      setSampleErrors({});
    } else {
      setSampleErrors({});
    }

    // Collect all form data into specificFields
    const categoryData: any = {};
    formDataObj.forEach((value, key) => {
      categoryData[key] = value;
    });

    const booleanFields =
      checkboxFieldMap[category as keyof typeof checkboxFieldMap] || [];
    booleanFields.forEach((field) => {
      categoryData[field] = formDataObj.has(field);
    });

    // Add sample offerings if in sweets category
    if (category === "sweets") {
      categoryData.sampleOfferings = sampleOfferings.map((sample) => ({
        id: sample.id,
        name: sample.name,
        price: sample.price,
        description: sample.description,
      }));
    }

    // Add audio samples if in music_dj category
    if (category === "music_dj") {
      categoryData.audioSamples = audioSamples.map((sample) => ({
        id: sample.id,
        name: sample.name,
        url: sample.url ?? null,
      }));
    }

    // Store all category-specific data in specificFields
    updateFormData({
      specificFields: categoryData,
    });

    navigate("/add-service/step-3");
  };

  const addSampleOffering = () => {
    const newSample: SampleOffering = {
      id: Date.now().toString(),
      name: "",
      price: "",
      description: "",
    };
    setSampleOfferings([...sampleOfferings, newSample]);
  };

  const removeSampleOffering = (id: string) => {
    setSampleOfferings(sampleOfferings.filter((sample) => sample.id !== id));
  };

  const updateSampleOffering = (
    id: string,
    field: keyof SampleOffering,
    value: string
  ) => {
    setSampleOfferings(
      sampleOfferings.map((sample) =>
        sample.id === id ? { ...sample, [field]: value } : sample
      )
    );
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newSamples: AudioSample[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      file: file,
    }));

    setAudioSamples([...audioSamples, ...newSamples]);
  };

  const removeAudioSample = (id: string) => {
    setAudioSamples(audioSamples.filter((sample) => sample.id !== id));
  };

  const updateAudioSampleName = (id: string, name: string) => {
    setAudioSamples(
      audioSamples.map((sample) =>
        sample.id === id ? { ...sample, name } : sample
      )
    );
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
                ref={registerSelectRef("venueType")}
                name="venueType"
                defaultValue={getFieldValue("venueType", "")}
                onChange={() => clearError("venueType")}
                className={getFieldClasses(
                  "venueType",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
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
              {errors.venueType && (
                <p className="text-xs text-red-600">{errors.venueType}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Capacity *
              </label>
              <Input
                ref={registerInputRef("capacity")}
                name="capacity"
                type="number"
                min="1"
                placeholder="Number of guests"
                defaultValue={getFieldValue("capacity", "")}
                onChange={() => clearError("capacity")}
                className={getFieldClasses(
                  "capacity",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.capacity && (
                <p className="text-xs text-red-600">{errors.capacity}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Location Type *
              </label>
              <div
                ref={(el) => {
                  if (el) {
                    fieldRefs.current["locationType"] = el;
                  }
                }}
                className={`space-y-2 ${
                  errors.locationType
                    ? "rounded-lg border border-red-500 p-3"
                    : ""
                }`}
              >
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="locationType"
                    value="indoor"
                    defaultChecked={getFieldValue("locationType") === "indoor"}
                    onChange={() => clearError("locationType")}
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
                    defaultChecked={getFieldValue("locationType") === "outdoor"}
                    onChange={() => clearError("locationType")}
                    className="w-5 h-5 text-rose-600"
                  />
                  <span>Outdoor</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="locationType"
                    value="both"
                    defaultChecked={getFieldValue("locationType") === "both"}
                    onChange={() => clearError("locationType")}
                    className="w-5 h-5 text-rose-600"
                  />
                  <span>Both</span>
                </label>
              </div>
              {errors.locationType && (
                <p className="text-xs text-red-600">{errors.locationType}</p>
              )}
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
                    defaultChecked={getBooleanValue("cateringInHouse")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>In-house catering</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="cateringExternal"
                    defaultChecked={getBooleanValue("cateringExternal")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>External catering allowed</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="cateringNone"
                    defaultChecked={getBooleanValue("cateringNone")}
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
                  defaultChecked={getBooleanValue("parking")}
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
                  defaultChecked={getBooleanValue("accommodation")}
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
                defaultValue={getFieldValue("menuPrice", "")}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>
        );

      case "photo_video":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Coverage Duration (hours) *
              </label>
              <Input
                ref={registerInputRef("duration")}
                name="duration"
                type="number"
                min="1"
                placeholder="e.g., 8"
                defaultValue={getFieldValue("duration", "")}
                onChange={() => clearError("duration")}
                className={getFieldClasses(
                  "duration",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.duration && (
                <p className="text-xs text-red-600">{errors.duration}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Number of Photographers/Videographers *
              </label>
              <Input
                ref={registerInputRef("teamSize")}
                name="teamSize"
                type="number"
                min="1"
                placeholder="e.g., 2"
                defaultValue={getFieldValue("teamSize", "")}
                onChange={() => clearError("teamSize")}
                className={getFieldClasses(
                  "teamSize",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.teamSize && (
                <p className="text-xs text-red-600">{errors.teamSize}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Drone Option Available
                </span>
                <input
                  type="checkbox"
                  name="drone"
                  defaultChecked={getBooleanValue("drone")}
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Editing & Delivery Time *
              </label>
              <Input
                ref={registerInputRef("deliveryTime")}
                name="deliveryTime"
                placeholder="e.g., 4-6 weeks"
                defaultValue={getFieldValue("deliveryTime", "")}
                onChange={() => clearError("deliveryTime")}
                className={getFieldClasses(
                  "deliveryTime",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.deliveryTime && (
                <p className="text-xs text-red-600">{errors.deliveryTime}</p>
              )}
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
                    defaultChecked={getBooleanValue("formatUSB")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>USB Drive</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="formatOnline"
                    defaultChecked={getBooleanValue("formatOnline")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Online Gallery</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="formatAlbum"
                    defaultChecked={getBooleanValue("formatAlbum")}
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
                  defaultChecked={getBooleanValue("travel")}
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>
          </div>
        );

      case "music_dj":
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
                    defaultChecked={getBooleanValue("serviceDJ")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>DJ</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceBand"
                    defaultChecked={getBooleanValue("serviceBand")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Live Band</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceMC"
                    defaultChecked={getBooleanValue("serviceMC")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>MC Services</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="serviceSinger"
                    defaultChecked={getBooleanValue("serviceSinger")}
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
                ref={registerInputRef("genres")}
                name="genres"
                placeholder="e.g., Pop, Rock, Jazz, Electronic"
                defaultValue={getFieldValue("genres", "")}
                onChange={() => clearError("genres")}
                className={getFieldClasses(
                  "genres",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.genres && (
                <p className="text-xs text-red-600">{errors.genres}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Performance Duration (hours) *
              </label>
              <Input
                ref={registerInputRef("performanceDuration")}
                name="performanceDuration"
                type="number"
                min="1"
                placeholder="e.g., 4"
                defaultValue={getFieldValue("performanceDuration", "")}
                onChange={() => clearError("performanceDuration")}
                className={getFieldClasses(
                  "performanceDuration",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.performanceDuration && (
                <p className="text-xs text-red-600">
                  {errors.performanceDuration}
                </p>
              )}
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
                    defaultChecked={getBooleanValue("equipSound")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Sound System</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="equipLighting"
                    defaultChecked={getBooleanValue("equipLighting")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Lighting</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="equipMics"
                    defaultChecked={getBooleanValue("equipMics")}
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
                defaultValue={getFieldValue("setupTime", "")}
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
                  defaultChecked={getBooleanValue("playlistCustom")}
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            {/* Audio Samples */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-600" />
                <label className="text-base font-bold text-gray-900">
                  Audio Samples (Optional)
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Upload audio samples of your work to showcase your style
              </p>

              {audioSamples.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    className="hidden"
                    id="audioUpload"
                    onChange={handleAudioUpload}
                  />
                  <label
                    htmlFor="audioUpload"
                    className="flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        Upload Audio Files
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        MP3, WAV, AAC up to 10MB each
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  {audioSamples.map((sample, index) => (
                    <div
                      key={sample.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={sample.name}
                          onChange={(e) =>
                            updateAudioSampleName(sample.id, e.target.value)
                          }
                          placeholder="Sample name"
                          className="w-full bg-white border border-gray-200 rounded-lg h-9 px-3 text-sm focus:ring-2 focus:ring-rose-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {sample.file
                            ? `${(sample.file.size / 1024 / 1024).toFixed(2)} MB`
                            : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAudioSample(sample.id)}
                        className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-rose-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="audio/*"
                      className="hidden"
                      id="audioUploadMore"
                      onChange={handleAudioUpload}
                    />
                    <label
                      htmlFor="audioUploadMore"
                      className="flex items-center justify-center gap-2 cursor-pointer text-sm font-medium text-rose-600 hover:text-rose-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add More Audio Samples
                    </label>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Tip: Upload 3-5 samples showcasing different styles or events
              </p>
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
                    defaultChecked={getBooleanValue("decorFloral")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Floral Arrangements</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorLighting"
                    defaultChecked={getBooleanValue("decorLighting")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Lighting</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorTable"
                    defaultChecked={getBooleanValue("decorTable")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Table Design</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="decorStage"
                    defaultChecked={getBooleanValue("decorStage")}
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
                ref={registerInputRef("themeStyles")}
                name="themeStyles"
                placeholder="e.g., Rustic, Glam, Minimal"
                defaultValue={getFieldValue("themeStyles", "")}
                onChange={() => clearError("themeStyles")}
                className={getFieldClasses(
                  "themeStyles",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.themeStyles && (
                <p className="text-xs text-red-600">{errors.themeStyles}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Setup & Teardown Included
                </span>
                <input
                  type="checkbox"
                  name="setupIncluded"
                  defaultChecked={getBooleanValue("setupIncluded")}
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
                defaultValue={getFieldValue("setupTimeHours", "")}
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
                    defaultChecked={getBooleanValue("typePrinted")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Printed</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="typeDigital"
                    defaultChecked={getBooleanValue("typeDigital")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Digital</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="typeHandmade"
                    defaultChecked={getBooleanValue("typeHandmade")}
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
                defaultValue={getFieldValue("materials", "")}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Minimum Order Quantity *
              </label>
              <Input
                ref={registerInputRef("minOrder")}
                name="minOrder"
                type="number"
                min="1"
                placeholder="e.g., 50"
                defaultValue={getFieldValue("minOrder", "")}
                onChange={() => clearError("minOrder")}
                className={getFieldClasses(
                  "minOrder",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.minOrder && (
                <p className="text-xs text-red-600">{errors.minOrder}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="text-base font-bold text-gray-900">
                Delivery Time (days) *
              </label>
              <Input
                ref={registerInputRef("deliveryDays")}
                name="deliveryDays"
                type="number"
                min="1"
                placeholder="e.g., 14"
                defaultValue={getFieldValue("deliveryDays", "")}
                onChange={() => clearError("deliveryDays")}
                className={getFieldClasses(
                  "deliveryDays",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.deliveryDays && (
                <p className="text-xs text-red-600">{errors.deliveryDays}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Design Service Included
                </span>
                <input
                  type="checkbox"
                  name="designIncluded"
                  defaultChecked={getBooleanValue("designIncluded")}
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
                    defaultChecked={getBooleanValue("sweetCake")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Wedding Cake</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetCandyBar"
                    defaultChecked={getBooleanValue("sweetCandyBar")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Candy Bar</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetCupcakes"
                    defaultChecked={getBooleanValue("sweetCupcakes")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Cupcakes</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sweetMacarons"
                    defaultChecked={getBooleanValue("sweetMacarons")}
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
                ref={registerInputRef("flavors")}
                name="flavors"
                placeholder="e.g., Vanilla, Chocolate, Red Velvet"
                defaultValue={getFieldValue("flavors", "")}
                onChange={() => clearError("flavors")}
                className={getFieldClasses(
                  "flavors",
                  "w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                )}
                required
              />
              {errors.flavors && (
                <p className="text-xs text-red-600">{errors.flavors}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">
                  Tasting Available
                </span>
                <input
                  type="checkbox"
                  name="tasting"
                  defaultChecked={getBooleanValue("tasting")}
                  className="w-6 h-6 rounded text-rose-600"
                />
              </label>
            </div>

            {/* Sample Offerings */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cake className="w-5 h-5 text-rose-600" />
                  <label className="text-base font-bold text-gray-900">
                    Sample Offerings (Optional)
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Offer sample packages to help couples decide before booking
              </p>

              {sampleOfferings.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Cake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">
                    No sample offerings added yet
                  </p>
                  <Button
                    type="button"
                    onClick={addSampleOffering}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg h-10 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sample Offering
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sampleOfferings.map((sample, index) => {
                    const sampleError = sampleErrors[sample.id] || {};
                    return (
                      <div
                        id={`sample-${sample.id}`}
                        key={sample.id}
                        className={`border-2 rounded-xl p-4 space-y-3 bg-gray-50 ${
                          Object.keys(sampleError).length > 0
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-rose-600">
                            Sample {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSampleOffering(sample.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">
                            Sample Name *
                          </label>
                          <Input
                            value={sample.name}
                            onChange={(e) => {
                              updateSampleOffering(
                                sample.id,
                                "name",
                                e.target.value
                              );
                              clearSampleError(sample.id, "name");
                            }}
                            placeholder="e.g., Tasting Box, Mini Cupcake Set"
                            className={`w-full bg-white border border-gray-200 rounded-lg h-11 px-3 focus:ring-2 focus:ring-rose-600 ${
                              sampleError.name
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          {sampleError.name && (
                            <p className="mt-1 text-xs text-red-600">
                              {sampleError.name}
                            </p>
                          )}
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
                              value={sample.price}
                              onChange={(e) => {
                                updateSampleOffering(
                                  sample.id,
                                  "price",
                                  e.target.value
                                );
                                clearSampleError(sample.id, "price");
                              }}
                              type="number"
                              min="0"
                              placeholder="0 (or enter 'Free')"
                              className={`w-full bg-white border border-gray-200 rounded-lg h-11 pl-7 pr-3 focus:ring-2 focus:ring-rose-600 ${
                                sampleError.price
                                  ? "border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                          </div>
                          {sampleError.price && (
                            <p className="mt-1 text-xs text-red-600">
                              {sampleError.price}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">
                            Description *
                          </label>
                          <textarea
                            value={sample.description}
                            onChange={(e) => {
                              updateSampleOffering(
                                sample.id,
                                "description",
                                e.target.value
                              );
                              clearSampleError(sample.id, "description");
                            }}
                            placeholder="Describe what's included (e.g., 6 mini cupcakes in assorted flavors)..."
                            className={`w-full bg-white border border-gray-200 rounded-lg min-h-[80px] p-3 focus:ring-2 focus:ring-rose-600 focus:border-transparent text-sm ${
                              sampleError.description
                                ? "border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          {sampleError.description && (
                            <p className="mt-1 text-xs text-red-600">
                              {sampleError.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    onClick={addSampleOffering}
                    variant="outline"
                    className="w-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Sample
                  </Button>
                </div>
              )}
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
                    defaultChecked={getBooleanValue("dietVegan")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Vegan</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dietGluten"
                    defaultChecked={getBooleanValue("dietGluten")}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>Gluten-free</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dietSugar"
                    defaultChecked={getBooleanValue("dietSugar")}
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
                  defaultChecked={getBooleanValue("deliveryIncluded")}
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
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/add-service/step-1")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Service Details
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center font-medium">
          Step 2 of 4: Category-Specific Details
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto pb-32 lg:pb-40">
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
      <footer className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 mb-16 lg:mb-0 lg:left-64 xl:left-72">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
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
