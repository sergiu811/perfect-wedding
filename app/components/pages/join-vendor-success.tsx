import React, { useEffect } from "react";
import { CheckCircle, Sparkles, Calendar, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";

export const JoinVendorSuccess = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    // Confetti or celebration animation could go here
  }, []);

  const handleContinue = () => {
    navigate("/vendor-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <div className="max-w-2xl mx-auto w-full">
      <main className="flex-1 px-4 lg:px-6 py-12 lg:py-16 flex flex-col items-center justify-center space-y-8">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Aboard! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your vendor account has been created successfully!
          </p>
        </div>

        {/* Next Steps */}
        <div className="w-full space-y-4 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Next Steps</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Complete Your Profile
                </p>
                <p className="text-sm text-gray-600">
                  Add photos, services, and pricing information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Set Your Availability
                </p>
                <p className="text-sm text-gray-600">
                  Update your calendar to start receiving bookings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Start Connecting</p>
                <p className="text-sm text-gray-600">
                  Begin receiving inquiries from couples
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            📧 We've sent a confirmation email to verify your account. Please
            check your inbox.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-pink-50 sticky bottom-0 border-t border-gray-200">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 text-base tracking-wide shadow-lg"
        >
          Go to Dashboard
        </Button>
      </footer>
      </div>
    </div>
  );
};
