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
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Switch } from "~/components/ui/switch";
import { Slider } from "~/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";
import { cn } from "~/lib/utils";

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

  const [preferredContactMethod, setPreferredContactMethod] = useState(
    formData.preferredContactMethod || ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (selectedVendors.length === 0) {
      newErrors.vendors = "Please select at least one vendor category";
    }
    if (!preferredContactMethod) {
      newErrors.preferredContactMethod = "Please select a preferred contact method";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors({});

    updateFormData({
      vendorCategories: selectedVendors,
      vendorPriorities: priorities,
      hasBookedVendors: hasBooked,
      bookedVendorsDetails: (document.querySelector('input[name="bookedVendorsDetails"]') as HTMLInputElement)?.value || "",
      preferredContactMethod,
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/planning/step-2")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
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
          <Card>
            <CardContent className="p-4 space-y-4">
              <Label className="text-base font-bold">Vendor Categories</Label>
              <p className="text-sm text-gray-500">
                You can always change these later
              </p>
              <div className="space-y-3">
                {VENDOR_CATEGORIES.map((vendor) => {
                  const Icon = vendor.icon;
                  const isSelected = selectedVendors.includes(vendor.id);
                  return (
                    <div key={vendor.id} className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                          id={vendor.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleVendor(vendor.id)}
                        />
                        <Icon className="w-5 h-5 text-rose-600" />
                        <Label htmlFor={vendor.id} className="flex-1 font-medium cursor-pointer">
                          {vendor.name}
                        </Label>
                      </div>

                      {isSelected && (
                        <div className="ml-8 pl-4 border-l-2 border-rose-200 space-y-2">
                          <Label className="text-sm text-gray-700">Priority Level</Label>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">Low</span>
                            <Slider
                              value={[priorities[vendor.id] || 3]}
                              onValueChange={(value) => setPriority(vendor.id, value[0])}
                              min={1}
                              max={5}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-500">High</span>
                          </div>
                          <div className="text-center">
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
              {errors.vendors && (
                <p className="text-sm text-red-600 mt-2">{errors.vendors}</p>
              )}
            </CardContent>
          </Card>

          {/* Already Booked */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold">Already booked any vendors?</Label>
                <Switch checked={hasBooked} onCheckedChange={setHasBooked} />
              </div>
              {hasBooked && (
                <Input
                  name="bookedVendorsDetails"
                  defaultValue={formData.bookedVendorsDetails}
                  placeholder="e.g., Venue and photographer"
                  className="w-full bg-gray-50 border-gray-200 h-12"
                />
              )}
            </CardContent>
          </Card>

          {/* Preferred Contact Method */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-bold">Preferred Communication Method *</Label>
              <Select value={preferredContactMethod} onValueChange={setPreferredContactMethod} required>
                <SelectTrigger className={cn(
                  "w-full bg-gray-50 h-12",
                  errors.preferredContactMethod && "border-red-500"
                )}>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chat">In-App Chat</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredContactMethod && (
                <p className="text-sm text-red-600">{errors.preferredContactMethod}</p>
              )}
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
          Next: Timeline Setup
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/planning/step-2")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600 h-auto"
        >
          Back
        </Button>
      </footer>
    </div>
  );
};
