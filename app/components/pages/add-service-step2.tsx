import React, { useState } from "react";
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
  const [sampleOfferings, setSampleOfferings] = useState<SampleOffering[]>(
    formData.sampleOfferings || []
  );
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>(
    formData.audioSamples || []
  );

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    // Collect all form data
    const categoryData: any = {};
    formDataObj.forEach((value, key) => {
      categoryData[key] = value;
    });

    // Add sample offerings if in sweets category
    if (category === "sweets") {
      categoryData.sampleOfferings = sampleOfferings;
    }

    // Add audio samples if in music-dj category
    if (category === "music-dj") {
      categoryData.audioSamples = audioSamples;
    }

    updateFormData(categoryData);
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
                          {sample.file ? `${(sample.file.size / 1024 / 1024).toFixed(2)} MB` : ""}
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
                  {sampleOfferings.map((sample, index) => (
                    <div
                      key={sample.id}
                      className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50"
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
                          onChange={(e) =>
                            updateSampleOffering(sample.id, "name", e.target.value)
                          }
                          placeholder="e.g., Tasting Box, Mini Cupcake Set"
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
                            value={sample.price}
                            onChange={(e) =>
                              updateSampleOffering(sample.id, "price", e.target.value)
                            }
                            type="number"
                            min="0"
                            placeholder="0 (or enter 'Free')"
                            className="w-full bg-white border border-gray-200 rounded-lg h-11 pl-7 pr-3 focus:ring-2 focus:ring-rose-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">
                          Description *
                        </label>
                        <textarea
                          value={sample.description}
                          onChange={(e) =>
                            updateSampleOffering(
                              sample.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe what's included (e.g., 6 mini cupcakes in assorted flavors)..."
                          className="w-full bg-white border border-gray-200 rounded-lg min-h-[80px] p-3 focus:ring-2 focus:ring-rose-600 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  ))}

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
