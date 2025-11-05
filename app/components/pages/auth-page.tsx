import { useState } from "react";
import { Mail, Lock, User, Heart, Building2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/contexts/auth-context";
import { useRouter } from "~/contexts/router-context";

type AuthMode = "login" | "signup";
type UserRole = "couple" | "vendor";

export const AuthPage = () => {
  const { navigate } = useRouter();
  const { signIn, signUp } = useAuth();

  // Mode & Role
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<UserRole>("couple");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      // Signup validation
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setLoading(true);
      const { error } = await signUp(email, password, role);

      if (error) {
        setError(error.message || "Failed to create account");
        setLoading(false);
      } else {
        // Redirect based on role
        if (role === "couple") {
          navigate("/planning/step-1");
        } else {
          navigate("/add-service/step-1");
        }
      }
    } else {
      // Login
      setLoading(true);
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message || "Failed to sign in");
        setLoading(false);
      } else {
        navigate("/");
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setBusinessName("");
    setError("");
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-600 rounded-full mb-4">
            {mode === "signup" && role === "vendor" ? (
              <Building2 className="w-8 h-8 text-white" />
            ) : (
              <Heart className="w-8 h-8 text-white fill-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-gray-600">
            {mode === "login"
              ? "Sign in to continue planning your perfect wedding"
              : role === "couple"
                ? "Start planning your dream wedding today"
                : "Showcase your services to couples"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === "login"
                  ? "bg-white text-rose-600 shadow"
                  : "text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                mode === "signup"
                  ? "bg-white text-rose-600 shadow"
                  : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Toggle (Signup Only) */}
          {mode === "signup" && (
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("couple")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  role === "couple"
                    ? "bg-white text-rose-600 shadow"
                    : "text-gray-600"
                }`}
              >
                Couple
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  role === "vendor"
                    ? "bg-white text-purple-600 shadow"
                    : "text-gray-600"
                }`}
              >
                Vendor
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Fields (Signup Only) */}
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            {/* Business Name (Vendor Signup Only) */}
            {mode === "signup" && role === "vendor" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password (Signup Only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password (Login Only) */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 text-white font-semibold rounded-lg shadow-lg ${
                mode === "signup" && role === "vendor"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating Account..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-rose-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-rose-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
