import { useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { useRouter } from "~/contexts/router-context";

interface CoupleOnlyRouteProps {
  children: React.ReactNode;
}

export const CoupleOnlyRoute = ({ children }: CoupleOnlyRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        navigate("/login");
      } else if (profile?.role === "vendor") {
        // Vendor trying to access couple page - redirect to vendor dashboard
        navigate("/vendor-dashboard");
      }
    }
  }, [user, profile, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized
  if (!user || profile?.role === "vendor") {
    return null;
  }

  return <>{children}</>;
};
