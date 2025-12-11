import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle,
  DollarSign,
  MapPin,
  Send,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { usePlanning } from "~/contexts/planning-context";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { useSupabase } from "~/lib/supabase.client";
import { getWeddingByUserId } from "~/lib/wedding";

interface ContactVendorPageProps {
  vendorId?: string;
  vendorName?: string;
  vendorCategory?: string;
}

export const ContactVendorPage = ({
  vendorId: propsVendorId,
  vendorName: propsVendorName,
  vendorCategory: propsVendorCategory,
}: ContactVendorPageProps) => {
  const { navigate } = useRouter();
  const { formData } = usePlanning();
  const { user } = useAuth();
  const supabase = useSupabase();

  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const pathMatch = window.location.pathname.match(/\/contact-vendor\/([^/?]+)/);
  const urlVendorId = pathMatch ? pathMatch[1] : null;

  const vendorId = propsVendorId || urlVendorId || "";
  const vendorName = propsVendorName || urlParams.get("name") || "Vendor";
  const vendorCategory = propsVendorCategory || urlParams.get("category") || "service";

  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    weddingDate: formData.weddingDate || "",
    guestCount: formData.guestCount || "",
    budgetRange: "",
    location: formData.location || "",
    message: "",
    // Category-specific fields
    venueType: "",
    musicType: "",
    hoursNeeded: "",
    cakeSize: "",
    cakeTheme: "",
    cakeFlavors: "",
    coverageHours: "",
    photoVideoType: "",
  });

  const [availabilityStatus, setAvailabilityStatus] = useState<"available" | "unavailable" | null>(null);

  // Check availability when date changes
  React.useEffect(() => {
    const checkAvailability = async () => {
      // Need both date and serviceId (from URL) to check
      const urlParams = new URLSearchParams(window.location.search);
      const serviceId = urlParams.get("serviceId");

      if (!formValues.weddingDate || !serviceId) {
        setAvailabilityStatus(null);
        return;
      }

      try {
        const response = await fetch(
          `/api/availability?serviceId=${serviceId}&startDate=${formValues.weddingDate}&endDate=${formValues.weddingDate}`
        );

        if (response.ok) {
          const data = await response.json();
          const availability = data.availability || [];
          const dateStatus = availability.find((a: any) => a.date === formValues.weddingDate);

          if (dateStatus && (dateStatus.status === "booked" || dateStatus.status === "unavailable")) {
            setAvailabilityStatus("unavailable");
          } else {
            setAvailabilityStatus("available");
          }
        }
      } catch (error) {
        console.error("Error checking availability:", error);
      }
    };

    checkAvailability();
  }, [formValues.weddingDate]);

  // Fetch wedding details from database to pre-fill form
  React.useEffect(() => {
    const fetchWeddingDetails = async () => {
      if (!user) return;

      const { data: wedding, error } = await getWeddingByUserId(supabase, user.id);

      if (wedding) {
        setFormValues((prev) => ({
          ...prev,
          weddingDate: wedding.wedding_date || prev.weddingDate,
          guestCount: wedding.guest_count?.toString() || prev.guestCount,
          location: wedding.location || prev.location,
          // Map budget if possible, otherwise keep default
          budgetRange: mapBudgetToRange(wedding.budget_max) || prev.budgetRange,
        }));
      }
    };

    fetchWeddingDetails();
  }, [user, supabase]);

  // Helper to map numeric budget to range string
  const mapBudgetToRange = (budgetMax: number | null | undefined) => {
    if (!budgetMax) return "";
    if (budgetMax < 5000) return "under-5000";
    if (budgetMax <= 10000) return "5000-10000";
    if (budgetMax <= 20000) return "10000-20000";
    if (budgetMax <= 30000) return "20000-30000";
    return "over-30000";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get serviceId from URL params if available
      const urlParams = new URLSearchParams(window.location.search);
      const serviceId = urlParams.get("serviceId");

      // Build inquiry details object
      const inquiryDetails = {
        weddingDate: formValues.weddingDate,
        guestCount: formValues.guestCount,
        budgetRange: formValues.budgetRange,
        location: formValues.location,
        message: formValues.message,
        vendorCategory: vendorCategory,
        // Category-specific fields
        ...(vendorCategory === "venue" && {
          venueType: formValues.venueType,
        }),
        ...(vendorCategory === "music-dj" && {
          musicType: formValues.musicType,
          hoursNeeded: formValues.hoursNeeded,
        }),
        ...(vendorCategory === "sweets" && {
          cakeSize: formValues.cakeSize,
          cakeTheme: formValues.cakeTheme,
          cakeFlavors: formValues.cakeFlavors,
        }),
        ...((vendorCategory === "photo-video" || vendorCategory === "photo_video") && {
          photoVideoType: formValues.photoVideoType,
          coverageHours: formValues.coverageHours,
        }),
      };

      // Create a conversation with the vendor
      const conversationResponse = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: vendorId,
          serviceId: serviceId || null,
          initialMessage: buildInquiryMessage(),
          inquiryDetails: inquiryDetails,
        }),
      });

      if (!conversationResponse.ok) {
        throw new Error("Failed to create conversation");
      }

      const conversationData = await conversationResponse.json();

      // Optionally send a more detailed message
      if (formValues.message) {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationData.conversationId,
            message: formValues.message,
            messageType: "text",
          }),
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  const buildInquiryMessage = () => {
    let message = "";

    // Category-specific greeting and inquiry
    switch (vendorCategory) {
      case "venue":
        message = `Hi ${vendorName}! 🏛️\n\nI'm reaching out to inquire about your venue for our wedding. We were impressed by your space and would love to learn more about availability and packages.\n\n`;
        break;
      case "photo-video":
      case "photo_video":
        message = `Hi ${vendorName}! 📸\n\nWe're looking for a talented photographer/videographer to capture our special day. Your portfolio caught our eye and we'd love to discuss your services.\n\n`;
        break;
      case "music-dj":
      case "music_dj":
        message = `Hi ${vendorName}! 🎵\n\nWe're searching for entertainment for our wedding and your services look perfect! We'd love to discuss how you can help make our celebration unforgettable.\n\n`;
        break;
      case "sweets":
        message = `Hi ${vendorName}! 🍰\n\nWe're interested in your dessert services for our wedding. Your creations look absolutely stunning! We'd love to discuss flavors and design options.\n\n`;
        break;
      case "decorations":
        message = `Hi ${vendorName}! 🌸\n\nWe're planning our wedding decor and your style is exactly what we're looking for! We'd love to discuss how you can help bring our vision to life.\n\n`;
        break;
      case "invitations":
        message = `Hi ${vendorName}! 💌\n\nWe're looking for wedding invitations and your designs are beautiful! We'd love to discuss customization options and timelines.\n\n`;
        break;
      default:
        message = `Hi ${vendorName}! 💍\n\nWe're interested in your services for our wedding. Your work looks amazing and we'd love to learn more!\n\n`;
    }

    message += `📋 Event Details:\n`;
    message += `• Wedding Date: ${formValues.weddingDate}\n`;
    message += `• Number of Guests: ${formValues.guestCount}\n`;
    message += `• Budget Range: ${formValues.budgetRange}\n`;
    if (formValues.location) {
      message += `• Location: ${formValues.location}\n`;
    }

    // Add category-specific details with better formatting
    if (vendorCategory === "venue") {
      message += `\n🏛️ Venue Preferences:\n`;
      if (formValues.venueType)
        message += `• Venue Type: ${formValues.venueType}\n`;
    } else if (vendorCategory === "music-dj" || vendorCategory === "music_dj") {
      message += `\n🎵 Music Preferences:\n`;
      if (formValues.musicType) message += `• Type: ${formValues.musicType}\n`;
      if (formValues.hoursNeeded)
        message += `• Hours Needed: ${formValues.hoursNeeded} hours\n`;
    } else if (vendorCategory === "sweets") {
      message += `\n🍰 Dessert Details:\n`;
      if (formValues.cakeSize)
        message += `• Servings: ${formValues.cakeSize} guests\n`;
      if (formValues.cakeTheme)
        message += `• Style/Theme: ${formValues.cakeTheme}\n`;
      if (formValues.cakeFlavors)
        message += `• Flavor Preferences: ${formValues.cakeFlavors}\n`;
    } else if (
      vendorCategory === "photo-video" ||
      vendorCategory === "photo_video"
    ) {
      message += `\n📸 Photography/Videography Needs:\n`;
      if (formValues.photoVideoType)
        message += `• Service Type: ${formValues.photoVideoType}\n`;
      if (formValues.coverageHours)
        message += `• Coverage Hours: ${formValues.coverageHours} hours\n`;
    }

    if (formValues.message) {
      message += `\n💭 Additional Notes:\n${formValues.message}\n`;
    }

    message += `\nLooking forward to hearing from you! 💕`;

    return message;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Category-specific fields renderer
  const renderCategoryFields = () => {
    switch (vendorCategory) {
      case "venue":
        return (
          <>
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Venue Type Preference
              </label>
              <Select
                value={formValues.venueType}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, venueType: value })
                }
              >
                <SelectTrigger className="w-full h-12 lg:h-14 text-base">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "music-dj":
        return (
          <>
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Music Type
              </label>
              <Select
                value={formValues.musicType}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, musicType: value })
                }
              >
                <SelectTrigger className="w-full h-12 lg:h-14 text-base">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dj">DJ</SelectItem>
                  <SelectItem value="band">Live Band</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Hours Needed
              </label>
              <Input
                name="hoursNeeded"
                type="number"
                value={formValues.hoursNeeded}
                onChange={handleChange}
                placeholder="e.g., 5"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>
          </>
        );

      case "sweets":
        return (
          <>
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Cake Size (servings)
              </label>
              <Input
                name="cakeSize"
                type="number"
                value={formValues.cakeSize}
                onChange={handleChange}
                placeholder="e.g., 100"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Theme/Style
              </label>
              <Input
                name="cakeTheme"
                value={formValues.cakeTheme}
                onChange={handleChange}
                placeholder="e.g., Rustic, Modern, Classic"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Flavor Preferences
              </label>
              <Input
                name="cakeFlavors"
                value={formValues.cakeFlavors}
                onChange={handleChange}
                placeholder="e.g., Vanilla, Chocolate"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>
          </>
        );

      case "photo-video":
        return (
          <>
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Service Type
              </label>
              <Select
                value={formValues.photoVideoType}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, photoVideoType: value })
                }
              >
                <SelectTrigger className="w-full h-12 lg:h-14 text-base">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photography Only</SelectItem>
                  <SelectItem value="video">Videography Only</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Coverage Hours
              </label>
              <Input
                name="coverageHours"
                type="number"
                value={formValues.coverageHours}
                onChange={handleChange}
                placeholder="e.g., 8"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-pink-50">
        <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200">
          <button
            onClick={() => navigate("/vendors")}
            className="text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
            Inquiry Sent
          </h1>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-6 lg:space-y-8">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
                Inquiry Sent Successfully!
              </h2>
              <p className="text-base lg:text-lg text-gray-600">
                {vendorName} will receive your inquiry and respond soon.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 lg:p-8 shadow-md space-y-3 lg:space-y-4 text-left">
              <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
                What's Next?
              </h3>
              <ul className="space-y-2 lg:space-y-3 text-sm lg:text-base text-gray-600">
                <li className="flex items-start gap-2 lg:gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0" />
                  <span>The vendor will review your inquiry</span>
                </li>
                <li className="flex items-start gap-2 lg:gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0" />
                  <span>You'll receive a notification when they respond</span>
                </li>
                <li className="flex items-start gap-2 lg:gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0" />
                  <span>Continue the conversation in Messages</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 lg:space-y-4 max-w-md mx-auto w-full">
              <Button
                onClick={() => navigate("/messages")}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 lg:h-14 text-base lg:text-lg font-semibold"
              >
                Go to Messages
              </Button>
              <Button
                onClick={() => navigate("/vendors")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl h-12 lg:h-14 text-base lg:text-lg font-semibold"
              >
                Browse More Vendors
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button onClick={() => navigate("/vendors")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Contact Vendor
        </h1>
      </header>

      <div className="flex-1 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl px-4 lg:px-8 py-6 lg:py-10 space-y-4 lg:space-y-6 pb-24"
        >
          {/* Vendor Info */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 lg:p-8 text-white shadow-lg">
            <p className="text-sm lg:text-base opacity-90 mb-1">
              Sending inquiry to
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold">{vendorName}</h2>
            <p className="text-sm lg:text-base opacity-90 mt-1 capitalize">
              {vendorCategory.replace("-", " & ")}
            </p>
          </div>

          {/* Common Fields */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
              Event Details
            </h3>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                Wedding Date *
              </label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-12 lg:h-14 justify-start text-left font-normal text-base",
                        !formValues.weddingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formValues.weddingDate ? (
                        format(new Date(formValues.weddingDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formValues.weddingDate ? new Date(formValues.weddingDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          // Format to YYYY-MM-DD for consistency with existing logic
                          const dateString = format(date, "yyyy-MM-dd");
                          setFormValues({ ...formValues, weddingDate: dateString });
                        }
                      }}
                      initialFocus
                      captionLayout="dropdown"
                      defaultMonth={formValues.weddingDate ? new Date(formValues.weddingDate) : undefined}
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 5}
                    />
                  </PopoverContent>
                </Popover>

                {availabilityStatus && (
                  <div className={`flex items-center gap-2 text-sm font-medium ${availabilityStatus === "available" ? "text-green-600" : "text-red-600"
                    }`}>
                    {availabilityStatus === "available" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Available on this date</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Not available on this date</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                Number of Guests *
              </label>
              <Input
                name="guestCount"
                type="number"
                value={formValues.guestCount}
                onChange={handleChange}
                placeholder="e.g., 150"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                Budget Range *
              </label>
              <Select
                value={formValues.budgetRange}
                onValueChange={(value) =>
                  setFormValues({ ...formValues, budgetRange: value })
                }
                required
              >
                <SelectTrigger className="w-full h-12 lg:h-14 text-base">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5000">Under $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                  <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                  <SelectItem value="over-30000">Over $30,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                Event Location
              </label>
              <Input
                name="location"
                value={formValues.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
            </div>
          </div>

          {/* Category-Specific Fields */}
          {renderCategoryFields() && (
            <div className="space-y-4 lg:space-y-6">
              <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
                Additional Details
              </h3>
              {renderCategoryFields()}
            </div>
          )}

          {/* Message */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
            <label className="text-sm lg:text-base font-bold text-gray-900">
              Message to Vendor
            </label>
            <Textarea
              name="message"
              value={formValues.message}
              onChange={handleChange}
              placeholder={`Hi ${vendorName}, we're interested in your services for our wedding...`}
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-base resize-none focus:ring-2 focus:ring-rose-600 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-pink-50 pt-4 pb-6 -mx-4 lg:-mx-8 px-4 lg:px-8 border-t border-gray-200">
            <Button
              type="submit"
              className="w-full max-w-md mx-auto block bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-14 lg:h-16 font-bold text-lg lg:text-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 lg:w-6 lg:h-6" />
              Send Inquiry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
