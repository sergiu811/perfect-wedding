import React, { useState } from "react";
import {
  ArrowLeft,
  Users,
  Camera,
  Music,
  Flower2,
  Mail,
  Cake,
  Utensils,
  Calendar,
  Scissors,
  Shirt,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";
import { Input } from "~/components/ui/input";

const VENDOR_CATEGORIES = [
  { id: "venue", name: "Venue", icon: Users },
  { id: "photo-video", name: "Photo & Video", icon: Camera },
  { id: "music-dj", name: "Music & DJ", icon: Music },
  { id: "decorations", name: "Decorations", icon: Flower2 },
  { id: "invitations", name: "Invitations", icon: Mail },
  { id: "sweets", name: "Sweets & Cake", icon: Cake },
  { id: "catering", name: "Catering", icon: Utensils },
  { id: "planner", name: "Wedding Planner", icon: Calendar },
  { id: "florist", name: "Florist", icon: Flower2 },
  { id: "makeup", name: "Makeup & Hair", icon: Scissors },
  { id: "attire", name: "Attire", icon: Shirt },
];

export const PlanningStep3 = () => {
  const { navigate } = useRouter();
  const { formData, updateFormData } = usePlanning();
  const [selectedVendors, setSelectedVendors] = useState<string[]>(
    formData.vendorCategories || []
  );
  const [priorities, setPriorities] = useState<Record<string, number>>(
    formData.vendorPriorities || {}
  );
  const [hasBooked, setHasBooked] = useState(
    formData.hasBookedVendors || false
  );

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    updateFormData({
      vendorCategories: selectedVendors,
      vendorPriorities: priorities,
      hasBookedVendors: hasBooked,
      bookedVendorsDetails: formDataObj.get("bookedVendorsDetails") as string,
      preferredContactMethod: formDataObj.get(
        "preferredContactMethod"
      ) as string,
    });

    navigate("/planning/step-4");
  };

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) => {
      if (prev.includes(vendorId)) {
        const newPriorities = { ...priorities };
        delete newPriorities[vendorId];
        setPriorities(newPriorities);
        return prev.filter((id) => id !== vendorId);
      } else {
        setPriorities({ ...priorities, [vendorId]: 3 });
        return [...prev, vendorId];
      }
    });
  };

  const setPriority = (vendorId: string, value: number) => {
    setPriorities({ ...priorities, [vendorId]: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/planning/step-2")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Vendor Needs
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
          Step 3 of 4: Vendor Requirements
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto pb-24">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What Do You Need Help With?
          </h2>
          <p className="text-gray-600">
            Select vendors you're looking for and set their priority
          </p>
        </div>

        <form className="space-y-6">
          {/* Vendor Categories */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <label className="text-base font-bold text-gray-900">
              Vendor Categories
            </label>
            <p className="text-sm text-gray-500">
              You can always change these later
            </p>
            <div className="space-y-3">
              {VENDOR_CATEGORIES.map((vendor) => {
                const Icon = vendor.icon;
                const isSelected = selectedVendors.includes(vendor.id);
                return (
                  <div key={vendor.id} className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleVendor(vendor.id)}
                        className="w-5 h-5 rounded text-rose-600"
                      />
                      <Icon className="w-5 h-5 text-rose-600" />
                      <span className="flex-1 font-medium">{vendor.name}</span>
                    </label>

                    {isSelected && (
                      <div className="ml-8 pl-4 border-l-2 border-rose-200">
                        <label className="text-sm text-gray-700 mb-2 block">
                          Priority Level
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">Low</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={priorities[vendor.id] || 3}
                            onChange={(e) =>
                              setPriority(vendor.id, parseInt(e.target.value))
                            }
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                          />
                          <span className="text-xs text-gray-500">High</span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                            {priorities[vendor.id] === 1 && "Not urgent"}
                            {priorities[vendor.id] === 2 && "Could help"}
                            {priorities[vendor.id] === 3 && "Important"}
                            {priorities[vendor.id] === 4 && "High priority"}
                            {priorities[vendor.id] === 5 && "Must have!"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Already Booked */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">
                Already booked any vendors?
              </span>
              <button
                type="button"
                onClick={() => setHasBooked(!hasBooked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasBooked ? "bg-rose-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasBooked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            {hasBooked && (
              <Input
                name="bookedVendorsDetails"
                defaultValue={formData.bookedVendorsDetails}
                placeholder="e.g., Venue and photographer"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              />
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Preferred Communication Method *
            </label>
            <select
              name="preferredContactMethod"
              defaultValue={formData.preferredContactMethod || ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
              required
            >
              <option value="" disabled>
                Select contact method
              </option>
              <option value="chat">In-App Chat</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 -mx-4 lg:-mx-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
        >
          Next: Timeline Setup
        </Button>
        <button
          onClick={() => navigate("/planning/step-2")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
