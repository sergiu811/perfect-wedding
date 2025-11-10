import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useVendorOnboarding } from "~/contexts/vendor-onboarding-context";

export const JoinVendorStep4 = () => {
  const { navigate } = useRouter();
  const { data, updateStep4 } = useVendorOnboarding();
  
  const [instagram, setInstagram] = useState(data.instagram);
  const [facebook, setFacebook] = useState(data.facebook);
  const [pinterest, setPinterest] = useState(data.pinterest);
  const [businessHours, setBusinessHours] = useState(data.businessHours);
  const [specialties, setSpecialties] = useState<string[]>(data.specialties);
  const [currentSpecialty, setCurrentSpecialty] = useState("");

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !specialties.includes(currentSpecialty.trim())) {
      setSpecialties([...specialties, currentSpecialty.trim()]);
      setCurrentSpecialty("");
    }
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    setSpecialties(specialties.filter((s) => s !== specialtyToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Step 4 - Submitting data:", {
      instagram,
      facebook,
      pinterest,
      businessHours,
      specialties,
    });
    
    updateStep4({
      instagram,
      facebook,
      pinterest,
      businessHours,
      specialties,
    });
    
    setTimeout(() => {
      navigate("/join-vendor/success");
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8 lg:-ml-64 xl:-ml-72">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/join-vendor/step-3")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Additional Details
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
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center">
          Step 4 of 4: Social Media & More
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Social Media Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Social Media (Optional)
            </h2>
            <p className="text-sm text-gray-600">
              Help couples find you on social media
            </p>

            {/* Instagram */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-900">
                Instagram
              </label>
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="@yourbusiness"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-900">
                Facebook
              </label>
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="facebook.com/yourbusiness"
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>

            {/* Pinterest */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-900">
                Pinterest
              </label>
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="pinterest.com/yourbusiness"
                type="text"
                value={pinterest}
                onChange={(e) => setPinterest(e.target.value)}
              />
            </div>
          </div>

          {/* Specialties/Tags */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Specialties / Tags
            </label>
            <p className="text-sm text-gray-600">
              Help couples find you by adding relevant specialties
            </p>
            <div className="flex gap-2">
              <Input
                value={currentSpecialty}
                onChange={(e) => setCurrentSpecialty(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSpecialty();
                  }
                }}
                className="flex-1 bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="e.g., Luxury Weddings"
                type="text"
              />
              <Button
                type="button"
                onClick={addSpecialty}
                className="bg-rose-600 hover:bg-rose-700 text-white h-14 px-6 rounded-lg"
              >
                Add
              </Button>
            </div>
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="hover:bg-rose-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Business Hours */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Business Hours (Optional)
            </label>
            <textarea
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
              placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Let couples know when you're available
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
          onClick={() => navigate("/join-vendor/step-3")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Back
        </button>
      </footer>
    </div>
  );
};
