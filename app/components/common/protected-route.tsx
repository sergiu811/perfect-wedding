import { useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { useRouter } from "~/contexts/router-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "couple" | "vendor" | "admin";
}

export const ProtectedRoute = ({
  children,
  requireRole,
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login page
      if (!user) {
        navigate("/login");
        return;
      }

      // Check if vendor needs to complete profile setup
      if (profile?.role === "vendor" && !profile?.profile_completed) {
        // Don't redirect if already on join-vendor pages
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/join-vendor")) {
          navigate("/join-vendor");
          return;
        }
      }

      // Check role requirement
      if (requireRole && profile?.role !== requireRole) {
        // Redirect based on actual role
        if (profile?.role === "vendor") {
          navigate("/vendor-dashboard");
        } else {
          navigate("/");
        }
      }
    }
  }, [user, profile, loading, requireRole, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Wrong role
  if (requireRole && profile?.role !== requireRole) {
    return null;
  }

  // Authenticated and authorized
  return <>{children}</>;
};
