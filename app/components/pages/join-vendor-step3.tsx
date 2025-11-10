import React, { useState } from "react";
import { ArrowLeft, MapPin, DollarSign, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useVendorOnboarding } from "~/contexts/vendor-onboarding-context";

export const JoinVendorStep3 = () => {
  const { navigate } = useRouter();
  const { data, updateStep3 } = useVendorOnboarding();
  
  const [serviceLocation, setServiceLocation] = useState(data.serviceLocation);
  const [serviceAreas, setServiceAreas] = useState(data.serviceAreas);
  const [priceMin, setPriceMin] = useState(data.priceMin);
  const [priceMax, setPriceMax] = useState(data.priceMax);
  const [leadTime, setLeadTime] = useState(data.leadTime);
  const [selectedDays, setSelectedDays] = useState<string[]>(data.availableDays);
  const [allWeek, setAllWeek] = useState(data.availableDays.length === 7);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    // Uncheck "All Week" if manually deselecting a day
    if (allWeek && selectedDays.includes(day)) {
      setAllWeek(false);
    }
  };

  const toggleAllWeek = () => {
    if (!allWeek) {
      setSelectedDays(days);
      setAllWeek(true);
    } else {
      setSelectedDays([]);
      setAllWeek(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Step 3 - Submitting data:", {
      serviceLocation,
      serviceAreas,
      priceMin,
      priceMax,
      availableDays: selectedDays,
      leadTime,
    });
    
    updateStep3({
      serviceLocation,
      serviceAreas,
      priceMin,
      priceMax,
      availableDays: selectedDays,
      leadTime,
    });
    
    // Small delay to ensure context update completes
    setTimeout(() => {
      navigate("/join-vendor/step-4");
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8 lg:-ml-64 xl:-ml-72">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/join-vendor/step-2")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Service Details
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
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center">
          Step 3 of 4: Pricing & Availability
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Location */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              Primary Business Location
            </label>
            <Input
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
              placeholder="e.g., Bucharest, Romania"
              type="text"
              value={serviceLocation}
              onChange={(e) => setServiceLocation(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Where is your business located?
            </p>
          </div>

          {/* Service Areas */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              Service Areas
            </label>
            <Input
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
              placeholder="e.g., Bucharest, Ilfov, Prahova"
              type="text"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Areas where you provide services (comma separated)
            </p>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-rose-600" />
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                  placeholder="Min price"
                  type="number"
                  min="0"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                  placeholder="Max price"
                  type="number"
                  min="0"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  required
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Starting price range for your services (in RON)
            </p>
          </div>

          {/* Available Days */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              Available Days
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Select the days you typically work
            </p>
            
            {/* All Week Checkbox */}
            <button
              type="button"
              onClick={toggleAllWeek}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 mb-3 ${
                allWeek
                  ? "bg-rose-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border-2 border-rose-200"
              }`}
            >
              All Week
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    selectedDays.includes(day)
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Lead Time */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Booking Lead Time
            </label>
            <div className="relative">
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="e.g., 30"
                type="number"
                min="0"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                days
              </span>
            </div>
            <p className="text-sm text-gray-500">
              How many days in advance do you need to be booked?
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleSubmit}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg tracking-wide shadow-lg"
        >
          Complete Setup
        </Button>
        <button
          onClick={() => navigate("/join-vendor/step-2")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
