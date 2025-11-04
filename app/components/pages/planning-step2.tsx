import React, { useState } from "react";
import { ArrowLeft, Palette } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

const THEMES = [
  { id: "rustic", name: "Rustic", image: "🌾", color: "bg-amber-100" },
  { id: "classic", name: "Classic", image: "👑", color: "bg-blue-100" },
  { id: "glam", name: "Glam", image: "✨", color: "bg-purple-100" },
  { id: "boho", name: "Boho", image: "🌸", color: "bg-pink-100" },
  { id: "minimal", name: "Minimal", image: "⚪", color: "bg-gray-100" },
  { id: "vintage", name: "Vintage", image: "📷", color: "bg-yellow-100" },
  { id: "romantic", name: "Romantic", image: "💕", color: "bg-rose-100" },
  { id: "modern", name: "Modern", image: "🔷", color: "bg-indigo-100" },
];

const COLOR_PALETTES = [
  {
    id: "blush",
    colors: ["#FFE5E5", "#FFC2C2", "#FF9E9E"],
    name: "Blush & Rose",
  },
  {
    id: "navy",
    colors: ["#1F3A5F", "#4D648D", "#ACC2EF"],
    name: "Navy & Gold",
  },
  { id: "sage", colors: ["#B8C5B0", "#8FA582", "#6B8E68"], name: "Sage Green" },
  {
    id: "lavender",
    colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD"],
    name: "Lavender Dreams",
  },
  {
    id: "burgundy",
    colors: ["#800020", "#A0522D", "#DEB887"],
    name: "Burgundy & Gold",
  },
  {
    id: "bluewhite",
    colors: ["#E0F2F7", "#B0D4DE", "#7FB3D5"],
    name: "Dusty Blue",
  },
];

export const PlanningStep2 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = usePlanning();
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    formData.themes || []
  );
  const [selectedPalette, setSelectedPalette] = useState<string[]>(
    formData.colorPalette || []
  );
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>(
    formData.venueTypes || []
  );
  const [selectedMusicStyles, setSelectedMusicStyles] = useState<string[]>(
    formData.musicStyles || []
  );

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    updateFormData({
      themes: selectedThemes,
      colorPalette: selectedPalette,
      venuePreference: formDataObj.get("venuePreference") as string,
      formalityLevel: formDataObj.get("formalityLevel") as string,
      venueTypes: selectedVenueTypes,
      musicStyles: selectedMusicStyles,
    });

    navigate("/planning/step-3");
  };

  const toggleTheme = (themeId: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeId)
        ? prev.filter((id) => id !== themeId)
        : [...prev, themeId]
    );
  };

  const toggleVenueType = (type: string) => {
    setSelectedVenueTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleMusicStyle = (style: string) => {
    setSelectedMusicStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/planning/step-1")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Style & Theme
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
          Step 2 of 4: Style & Theme Preferences
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto">
        <div className="text-center mb-6">
          <Palette className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose What Inspires You
          </h2>
          <p className="text-gray-600">
            Select styles and themes that reflect your vision
          </p>
        </div>

        <form className="space-y-6">
          {/* Wedding Theme */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Wedding Theme (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => toggleTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedThemes.includes(theme.id)
                      ? "border-rose-600 bg-rose-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-4xl mb-2 ${theme.color} p-3 rounded-lg inline-block`}
                  >
                    {theme.image}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Color Palette
            </label>
            <div className="space-y-3">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setSelectedPalette(palette.colors)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                    selectedPalette[0] === palette.colors[0]
                      ? "border-rose-600 bg-rose-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {palette.colors.map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {palette.name}
                    </span>
                  </div>
                  {selectedPalette[0] === palette.colors[0] && (
                    <span className="text-rose-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Preference */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Outdoor or Indoor Preference *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="venuePreference"
                  value="outdoor"
                  defaultChecked={formData.venuePreference === "outdoor"}
                  className="w-5 h-5 text-rose-600"
                  required
                />
                <span>Outdoor</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="venuePreference"
                  value="indoor"
                  defaultChecked={formData.venuePreference === "indoor"}
                  className="w-5 h-5 text-rose-600"
                />
                <span>Indoor</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="venuePreference"
                  value="both"
                  defaultChecked={formData.venuePreference === "both"}
                  className="w-5 h-5 text-rose-600"
                />
                <span>Both / Flexible</span>
              </label>
            </div>
          </div>

          {/* Formality Level */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Formality Level *
            </label>
            <select
              name="formalityLevel"
              defaultValue={formData.formalityLevel || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            >
              <option value="" disabled>
                Select formality level
              </option>
              <option value="casual">Casual</option>
              <option value="semi-formal">Semi-Formal</option>
              <option value="formal">Formal</option>
              <option value="black-tie">Black Tie</option>
            </select>
          </div>

          {/* Venue Types */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Venue Type Preferences
            </label>
            <div className="space-y-2">
              {[
                "Ballroom",
                "Garden",
                "Beach",
                "Vineyard",
                "Castle",
                "Restaurant",
                "Barn",
              ].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedVenueTypes.includes(type)}
                    onChange={() => toggleVenueType(type)}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Music Style */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Music Style Preferences
            </label>
            <div className="space-y-2">
              {[
                "Jazz",
                "Pop",
                "Traditional",
                "Classical",
                "Live Band",
                "DJ",
              ].map((style) => (
                <label
                  key={style}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMusicStyles.includes(style)}
                    onChange={() => toggleMusicStyle(style)}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>{style}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 -mx-4 lg:-mx-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
        >
          Next: Vendor Needs
        </Button>
        <button
          onClick={() => navigate("/planning/step-1")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
