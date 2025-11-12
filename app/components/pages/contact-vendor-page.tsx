import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { usePlanning } from "~/contexts/planning-context";
import { useRouter } from "~/contexts/router-context";

interface ContactVendorPageProps {
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
}

export const ContactVendorPage = ({
  vendorId,
  vendorName,
  vendorCategory,
}: ContactVendorPageProps) => {
  const { navigate } = useRouter();
  const { formData } = usePlanning();
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    weddingDate: formData.weddingDate || "",
    guestCount: formData.guestCount || "",
    budgetRange: "",
    location: formData.location || "",
    message: "",
    // Category-specific fields
    venueType: "",
    seatingCapacity: "",
    musicType: "",
    hoursNeeded: "",
    cakeSize: "",
    cakeTheme: "",
    cakeFlavors: "",
    coverageHours: "",
    photoVideoType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get serviceId from URL params if available
      const urlParams = new URLSearchParams(window.location.search);
      const serviceId = urlParams.get("serviceId");

      // Create a conversation with the vendor
      const conversationResponse = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId: vendorId,
          serviceId: serviceId || null,
          initialMessage: buildInquiryMessage(),
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
      if (formValues.seatingCapacity)
        message += `• Seating Capacity: ${formValues.seatingCapacity} guests\n`;
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
              <select
                name="venueType"
                value={formValues.venueType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              >
                <option value="">Select preference</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm space-y-3">
              <label className="text-sm lg:text-base font-bold text-gray-900">
                Seating Capacity Needed
              </label>
              <Input
                name="seatingCapacity"
                type="number"
                value={formValues.seatingCapacity}
                onChange={handleChange}
                placeholder="e.g., 150"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
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
              <select
                name="musicType"
                value={formValues.musicType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              >
                <option value="">Select type</option>
                <option value="dj">DJ</option>
                <option value="band">Live Band</option>
                <option value="both">Both</option>
              </select>
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
              <select
                name="photoVideoType"
                value={formValues.photoVideoType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              >
                <option value="">Select type</option>
                <option value="photo">Photography Only</option>
                <option value="video">Videography Only</option>
                <option value="both">Both</option>
              </select>
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
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                Wedding Date *
              </label>
              <Input
                name="weddingDate"
                type="date"
                value={formValues.weddingDate}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              />
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
              <select
                name="budgetRange"
                value={formValues.budgetRange}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 lg:h-14 px-4 text-base"
              >
                <option value="">Select budget range</option>
                <option value="under-5000">Under $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="20000-30000">$20,000 - $30,000</option>
                <option value="over-30000">Over $30,000</option>
              </select>
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
            <textarea
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
