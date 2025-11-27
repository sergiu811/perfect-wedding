import React, { useState } from "react";
import { ArrowLeft, Palette } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";
import { cn } from "~/lib/utils";

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
  const [formalityLevel, setFormalityLevel] = useState(formData.formalityLevel || "");
  const [venuePreference, setVenuePreference] = useState(formData.venuePreference || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (selectedThemes.length === 0) {
      newErrors.themes = "Please select at least one theme";
    }
    if (!venuePreference) {
      newErrors.venuePreference = "Please select a venue preference";
    }
    if (!formalityLevel) {
      newErrors.formalityLevel = "Please select a formality level";
    }
    if (selectedVenueTypes.length === 0) {
      newErrors.venueTypes = "Please select at least one venue type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top to see errors if needed, or just let the user find them
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});

    updateFormData({
      themes: selectedThemes,
      colorPalette: selectedPalette,
      venuePreference,
      formalityLevel,
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/planning/step-1")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
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
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">
                Wedding Theme (select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <Button
                    key={theme.id}
                    type="button"
                    variant="outline"
                    onClick={() => toggleTheme(theme.id)}
                    className={`p-4 h-auto ${selectedThemes.includes(theme.id)
                      ? "border-rose-600 bg-rose-50"
                      : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`text-4xl mb-2 ${theme.color} p-3 rounded-lg`}
                      >
                        {theme.image}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {theme.name}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
              {errors.themes && (
                <p className="text-sm text-red-600">{errors.themes}</p>
              )}
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Color Palette</Label>
              <div className="space-y-3">
                {COLOR_PALETTES.map((palette) => (
                  <Button
                    key={palette.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPalette(palette.colors)}
                    className={`w-full p-3 h-auto justify-between ${selectedPalette[0] === palette.colors[0]
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
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Venue Preference */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Outdoor or Indoor Preference *</Label>
              <RadioGroup value={venuePreference} onValueChange={setVenuePreference}>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <RadioGroupItem value="outdoor" id="outdoor" />
                  <Label htmlFor="outdoor" className="cursor-pointer">Outdoor</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <RadioGroupItem value="indoor" id="indoor" />
                  <Label htmlFor="indoor" className="cursor-pointer">Indoor</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="cursor-pointer">Both / Flexible</Label>
                </div>
              </RadioGroup>
              {errors.venuePreference && (
                <p className="text-sm text-red-600">{errors.venuePreference}</p>
              )}
            </CardContent>
          </Card>

          {/* Formality Level */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Formality Level *</Label>
              <Select value={formalityLevel} onValueChange={setFormalityLevel} required>
                <SelectTrigger className={cn(
                  "w-full bg-gray-50 h-12",
                  errors.formalityLevel && "border-red-500"
                )}>
                  <SelectValue placeholder="Select formality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="black-tie">Black Tie</SelectItem>
                </SelectContent>
              </Select>
              {errors.formalityLevel && (
                <p className="text-sm text-red-600">{errors.formalityLevel}</p>
              )}
            </CardContent>
          </Card>

          {/* Venue Types */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Venue Type Preferences</Label>
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
                  <div key={type} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`venue-${type}`}
                      checked={selectedVenueTypes.includes(type)}
                      onCheckedChange={() => toggleVenueType(type)}
                    />
                    <Label htmlFor={`venue-${type}`} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </div>
              {errors.venueTypes && (
                <p className="text-sm text-red-600">{errors.venueTypes}</p>
              )}
            </CardContent>
          </Card>

          {/* Music Style */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Music Style Preferences</Label>
              <div className="space-y-2">
                {[
                  "Jazz",
                  "Pop",
                  "Traditional",
                  "Classical",
                  "Live Band",
                  "DJ",
                ].map((style) => (
                  <div key={style} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`music-${style}`}
                      checked={selectedMusicStyles.includes(style)}
                      onCheckedChange={() => toggleMusicStyle(style)}
                    />
                    <Label htmlFor={`music-${style}`} className="cursor-pointer">{style}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
        <Button
          variant="ghost"
          onClick={() => navigate("/planning/step-1")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600 h-auto"
        >
          Back
        </Button>
      </footer>
    </div>
  );
};
