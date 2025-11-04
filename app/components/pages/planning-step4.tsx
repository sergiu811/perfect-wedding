import React, { useState } from "react";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

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
  const [selectedTasks, setSelectedTasks] = useState<string[]>(
    formData.helpTasks || []
  );
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    formData.notifications || []
  );
  const [acceptedTerms, setAcceptedTerms] = useState(
    formData.acceptedTerms || false
  );

  const handleGenerate = () => {
    const form = document.querySelector("form");
    if (!form || !acceptedTerms) return;

    const formDataObj = new FormData(form);

    updateFormData({
      currentStage: formDataObj.get("currentStage") as string,
      helpTasks: selectedTasks,
      notifications: selectedNotifications,
      acceptedTerms,
    });

    navigate("/planning/success");
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
        <Button
          onClick={handleGenerate}
          disabled={!acceptedTerms}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ✨ Generate My Plan
        </Button>
        <button
          onClick={() => navigate("/planning/step-3")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
