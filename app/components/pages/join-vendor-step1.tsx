import React, { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useVendorOnboarding } from "~/contexts/vendor-onboarding-context";

export const JoinVendorStep1 = () => {
  const { navigate } = useRouter();
  const { data, updateStep1 } = useVendorOnboarding();

  const [vendorName, setVendorName] = useState(data.vendorName);
  const [contactPerson, setContactPerson] = useState(data.contactPerson);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [businessDescription, setBusinessDescription] = useState(
    data.businessDescription
  );

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    updateStep1({
      vendorName,
      contactPerson,
      phoneNumber,
      businessDescription,
    });

    setTimeout(() => {
      navigate("/join-vendor/step-2");
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8 lg:-ml-64 xl:-ml-72">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button onClick={() => navigate("/")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Join as a Vendor
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
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center">
          Step 1 of 4: Vendor Identity
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6">
        {/* Upload Profile Picture */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 border-2 border-dashed border-rose-600/50 rounded-xl bg-rose-600/10 text-center cursor-pointer hover:bg-rose-600/20 transition-colors">
          <Camera className="w-12 h-12 lg:w-16 lg:h-16 mb-3 text-rose-600" />
          <p className="font-semibold text-gray-900 lg:text-lg">
            Upload Profile Picture/Logo
          </p>
          <p className="text-sm text-gray-600 mt-1">Tap to upload</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleContinue} className="space-y-4">
          <Input
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Vendor Name"
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            required
          />
          <Input
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Contact Person"
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
          <Input
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <textarea
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Brief Business Description"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            required
          />
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg tracking-wide shadow-lg"
        >
          Continue
        </Button>
      </footer>
    </div>
  );
};
