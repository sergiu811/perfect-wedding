import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/contexts/auth-context";
import { usePlanning } from "~/contexts/planning-context";
import { useRouter } from "~/contexts/router-context";
import { useSupabase } from "~/lib/supabase.client";
import { createWedding, getWeddingByUserId, updateWedding } from "~/lib/wedding";

const HELP_TASKS = [
  "Budget Management",
  "Vendor Booking",
  "Guest List Management",
  "Invitations & RSVP",
  "Seating Plan",
  "Timeline Creation",
  "Checklist & Tasks",
  "Registry Setup",
];

export const PlanningStep4 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = usePlanning();
  const { user } = useAuth();
  const supabase = useSupabase();
  const [selectedTasks, setSelectedTasks] = useState<string[]>(
    formData.helpTasks || []
  );
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    formData.notifications || []
  );
  const [acceptedTerms, setAcceptedTerms] = useState(
    formData.acceptedTerms || false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const form = document.querySelector("form");
    
    // Validation checks with specific error messages
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    
    if (!user) {
      setError("You must be logged in to save your wedding plan. Please log in and try again.");
      return;
    }
    
    if (!form) {
      setError("Form not found. Please refresh the page and try again.");
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData(form);
    const currentStage = formDataObj.get("currentStage") as string;

    // Update context
    updateFormData({
      currentStage,
      helpTasks: selectedTasks,
      notifications: selectedNotifications,
      acceptedTerms,
    });

    // Save to Supabase
    try {
      // Check if wedding already exists
      const { data: existingWedding } = await getWeddingByUserId(supabase, user.id);

      const weddingData = {
        partner1_name: formData.partner1Name || "",
        partner2_name: formData.partner2Name || "",
        wedding_date: formData.weddingDate || "",
        guest_count: parseInt(formData.guestCount || "0"),
        budget_min: formData.budgetMin
          ? parseFloat(formData.budgetMin)
          : null,
        budget_max: formData.budgetMax
          ? parseFloat(formData.budgetMax)
          : null,
        location: formData.location || "",
        wedding_type: formData.weddingType || null,
        venue_types: formData.venueTypes || [],
        themes: formData.themes || [],
        color_palette: formData.colorPalette || [],
        music_styles: formData.musicStyles || [],
        venue_preference: formData.venuePreference || null,
        formality_level: formData.formalityLevel || null,
        vendor_categories: formData.vendorCategories || [],
        preferred_contact_method: formData.preferredContactMethod || null,
        current_stage: currentStage,
        help_tasks: selectedTasks,
        notifications: selectedNotifications,
        language: formData.language || "en",
        referral_source: formData.referralSource || null,
      };

      let data, saveError;

      if (existingWedding) {
        // Update existing wedding
        const result = await updateWedding(supabase, existingWedding.id, weddingData);
        data = result.data;
        saveError = result.error;
      } else {
        // Create new wedding
        const result = await createWedding(supabase, user.id, weddingData);
        data = result.data;
        saveError = result.error;
      }

      if (saveError) {
        console.error("Error saving wedding:", saveError);
        setError("Failed to save wedding plan. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Wedding saved successfully:", data);
      navigate("/planning/success");
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const toggleTask = (task: string) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  };

  const toggleNotification = (notification: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notification)
        ? prev.filter((n) => n !== notification)
        : [...prev, notification]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/planning/step-3")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Final Details
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
          Step 4 of 4: Preferences & Setup
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto pb-24">
        <div className="text-center mb-6">
          <Sparkles className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            We're Almost Done!
          </h2>
          <p className="text-gray-600">
            Let's set up your personalized planning experience
          </p>
        </div>

        {/* Auth Warning */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-900 font-medium">
              ⚠️ You're not logged in. Please{" "}
              <button
                onClick={() => navigate("/auth")}
                className="underline font-bold hover:text-yellow-700"
              >
                log in
              </button>{" "}
              to save your wedding plan.
            </p>
          </div>
        )}

        <form className="space-y-6">
          {/* Current Stage */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Current Planning Stage *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="currentStage"
                  value="just-engaged"
                  defaultChecked={formData.currentStage === "just-engaged"}
                  className="w-5 h-5 text-rose-600"
                  required
                />
                <span>Just Engaged 💍</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="currentStage"
                  value="6-12-months"
                  defaultChecked={formData.currentStage === "6-12-months"}
                  className="w-5 h-5 text-rose-600"
                />
                <span>6–12 months before wedding</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="currentStage"
                  value="3-6-months"
                  defaultChecked={formData.currentStage === "3-6-months"}
                  className="w-5 h-5 text-rose-600"
                />
                <span>3–6 months before</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="currentStage"
                  value="less-3-months"
                  defaultChecked={formData.currentStage === "less-3-months"}
                  className="w-5 h-5 text-rose-600"
                />
                <span>Less than 3 months ⏰</span>
              </label>
            </div>
          </div>

          {/* Tasks You Want Help With */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Tasks You Want Help With
            </label>
            <p className="text-sm text-gray-500">Select all that apply</p>
            <div className="space-y-2">
              {HELP_TASKS.map((task) => (
                <label
                  key={task}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task)}
                    onChange={() => toggleTask(task)}
                    className="w-5 h-5 rounded text-rose-600"
                  />
                  <span>{task}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Notification Preferences
            </label>
            <p className="text-sm text-gray-500">
              How would you like to receive updates?
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes("email")}
                  onChange={() => toggleNotification("email")}
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes("app")}
                  onChange={() => toggleNotification("app")}
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>App Notifications</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes("whatsapp")}
                  onChange={() => toggleNotification("whatsapp")}
                  className="w-5 h-5 rounded text-rose-600"
                />
                <span>WhatsApp Updates</span>
              </label>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm font-medium mb-2 opacity-90">
              YOUR PLAN SUMMARY
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Date:</span>
                <span className="font-semibold">
                  {formData.weddingDate || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Guests:</span>
                <span className="font-semibold">
                  {formData.guestCount || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Budget:</span>
                <span className="font-semibold">
                  {formData.budgetMin && formData.budgetMax
                    ? `$${formData.budgetMin} - $${formData.budgetMax}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Location:</span>
                <span className="font-semibold">
                  {formData.location || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 rounded text-rose-600 mt-0.5 flex-shrink-0"
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
              </span>
            </label>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 -mx-4 lg:-mx-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "✨ Generate My Plan"}
        </Button>
        <button
          onClick={() => navigate("/planning/step-3")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
          disabled={loading}
        >
          Back
        </button>
      </footer>
    </div>
  );
};
