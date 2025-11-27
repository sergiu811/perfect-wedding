import React, { useState } from "react";
import { ArrowLeft, Heart, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";
import { cn } from "~/lib/utils";

export const PlanningStep1 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = usePlanning();

  // Local state for form fields
  const [date, setDate] = useState<Date | undefined>(
    formData.weddingDate ? new Date(formData.weddingDate) : undefined
  );
  const [weddingType, setWeddingType] = useState(formData.weddingType || "");
  const [language, setLanguage] = useState(formData.language || "");
  const [referralSource, setReferralSource] = useState(formData.referralSource || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;

    const formDataObj = new FormData(form);
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const partner1Name = formDataObj.get("partner1Name") as string;
    const partner2Name = formDataObj.get("partner2Name") as string;
    const guestCount = formDataObj.get("guestCount") as string;
    const budgetMin = formDataObj.get("budgetMin") as string;
    const budgetMax = formDataObj.get("budgetMax") as string;
    const location = formDataObj.get("location") as string;

    if (!partner1Name?.trim()) newErrors.partner1Name = "Partner 1 name is required";
    if (!partner2Name?.trim()) newErrors.partner2Name = "Partner 2 name is required";
    if (!date) newErrors.weddingDate = "Wedding date is required";
    if (!guestCount?.trim()) newErrors.guestCount = "Guest count is required";
    if (!budgetMin?.trim()) newErrors.budgetMin = "Minimum budget is required";
    if (!budgetMax?.trim()) newErrors.budgetMax = "Maximum budget is required";
    if (!location?.trim()) newErrors.location = "Location is required";
    if (!weddingType) newErrors.weddingType = "Wedding type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    updateFormData({
      partner1Name,
      partner2Name,
      weddingDate: date ? format(date, "yyyy-MM-dd") : "",
      guestCount,
      budgetMin,
      budgetMax,
      location,
      weddingType,
      language,
      referralSource,
    });

    navigate("/planning/step-2");
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Start Planning
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center font-medium">
          Step 1 of 4: Wedding Overview
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto">
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
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Partner Names *</Label>
              <div className="space-y-2">
                <Input
                  name="partner1Name"
                  defaultValue={formData.partner1Name}
                  placeholder="Partner 1 Name"
                  className={cn(
                    "w-full bg-gray-50 border-gray-200 h-12",
                    errors.partner1Name && "border-red-500"
                  )}
                  required
                />
                {errors.partner1Name && (
                  <p className="text-sm text-red-600">{errors.partner1Name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  name="partner2Name"
                  defaultValue={formData.partner2Name}
                  placeholder="Partner 2 Name"
                  className={cn(
                    "w-full bg-gray-50 border-gray-200 h-12",
                    errors.partner2Name && "border-red-500"
                  )}
                  required
                />
                {errors.partner2Name && (
                  <p className="text-sm text-red-600">{errors.partner2Name}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Wedding Date */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Wedding Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal bg-gray-50",
                      !date && "text-muted-foreground",
                      errors.weddingDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.weddingDate && (
                <p className="text-sm text-red-600">{errors.weddingDate}</p>
              )}
            </CardContent>
          </Card>

          {/* Guest Count */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Expected Guest Count *</Label>
              <Input
                name="guestCount"
                type="number"
                min="1"
                defaultValue={formData.guestCount}
                placeholder="e.g., 100"
                className={cn(
                  "w-full bg-gray-50 border-gray-200 h-12",
                  errors.guestCount && "border-red-500"
                )}
                required
              />
              {errors.guestCount && (
                <p className="text-sm text-red-600">{errors.guestCount}</p>
              )}
              <p className="text-xs text-gray-500">
                You can adjust this later as plans evolve
              </p>
            </CardContent>
          </Card>

          {/* Budget */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Estimated Budget ($) *</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Input
                    name="budgetMin"
                    type="number"
                    min="0"
                    defaultValue={formData.budgetMin}
                    placeholder="Min"
                    className={cn(
                      "w-full bg-gray-50 border-gray-200 h-12",
                      errors.budgetMin && "border-red-500"
                    )}
                    required
                  />
                  {errors.budgetMin && (
                    <p className="text-sm text-red-600">{errors.budgetMin}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    name="budgetMax"
                    type="number"
                    min="0"
                    defaultValue={formData.budgetMax}
                    placeholder="Max"
                    className={cn(
                      "w-full bg-gray-50 border-gray-200 h-12",
                      errors.budgetMax && "border-red-500"
                    )}
                    required
                  />
                  {errors.budgetMax && (
                    <p className="text-sm text-red-600">{errors.budgetMax}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                This helps us recommend vendors in your price range
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Wedding Location *</Label>
              <Input
                name="location"
                defaultValue={formData.location}
                placeholder="City, Region, or Venue"
                className={cn(
                  "w-full bg-gray-50 border-gray-200 h-12",
                  errors.location && "border-red-500"
                )}
                required
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </CardContent>
          </Card>

          {/* Wedding Type */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Wedding Type *</Label>
              <Select value={weddingType} onValueChange={setWeddingType} required>
                <SelectTrigger className={cn(
                  "w-full bg-gray-50 h-12",
                  errors.weddingType && "border-red-500"
                )}>
                  <SelectValue placeholder="Select wedding type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="destination">Destination</SelectItem>
                  <SelectItem value="intimate">Intimate / Elopement</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              {errors.weddingType && (
                <p className="text-sm text-red-600">{errors.weddingType}</p>
              )}
            </CardContent>
          </Card>

          {/* Preferred Language */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Preferred Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full bg-gray-50 h-12">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* How did you hear about us */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">How did you hear about us?</Label>
              <Select value={referralSource} onValueChange={setReferralSource}>
                <SelectTrigger className="w-full bg-gray-50 h-12">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="friend">Friend/Family</SelectItem>
                  <SelectItem value="search">Search Engine</SelectItem>
                  <SelectItem value="vendor">Vendor Recommendation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
          Next: Style & Theme
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600 h-auto"
        >
          Cancel
        </Button>
      </footer>
    </div>
  );
};
