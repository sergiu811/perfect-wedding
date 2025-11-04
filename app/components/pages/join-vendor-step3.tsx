import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";

export const JoinVendorStep3 = () => {
  const { navigate } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/join-vendor/success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/join-vendor/step-2")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Account Setup
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center">
          Step 3 of 3: Account Credentials
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Email Address
            </label>
            <Input
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
              placeholder="your@email.com"
              type="email"
              required
            />
            <p className="text-sm text-gray-500">
              This will be your login email
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Password
            </label>
            <div className="relative">
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 pr-12 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-base font-semibold text-gray-900">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-none rounded-lg h-14 px-4 pr-12 focus:ring-2 focus:ring-rose-600/50 transition-all duration-300 shadow-sm"
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-600/50"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a className="text-rose-600 font-medium hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a className="text-rose-600 font-medium hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-600/50"
              />
              <span className="text-sm text-gray-700">
                Send me updates about new features and vendor tips
              </span>
            </label>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleSubmit}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg tracking-wide shadow-lg"
        >
          Create Account
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
