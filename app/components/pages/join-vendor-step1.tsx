import React from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";

export const JoinVendorStep1 = () => {
  const { navigate } = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/join-vendor/step-2");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4">
        <button onClick={() => navigate("/")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-6">
          Join as a Vendor
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Step 1 of 3: Vendor Identity
        </p>
      </div>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Upload Profile Picture */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-rose-600/50 rounded-xl bg-rose-600/10 text-center cursor-pointer hover:bg-rose-600/20 transition-colors">
          <Camera className="w-12 h-12 mb-3 text-rose-600" />
          <p className="font-semibold text-gray-900">
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
            required
          />
          <Input
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Contact Person"
            type="text"
            required
          />
          <Input
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Phone Number"
            type="tel"
            required
          />

          <textarea
            className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
            placeholder="Brief Business Description"
            required
          />
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 space-y-3 bg-pink-50 sticky bottom-0 border-t border-gray-200">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base tracking-wide shadow-lg"
        >
          Continue
        </Button>
        <p className="text-center">
          <a
            className="text-sm font-medium text-gray-600 hover:text-rose-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Already a Vendor? Log In
          </a>
        </p>
      </footer>
    </div>
  );
};
