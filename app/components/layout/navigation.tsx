import React, { useMemo } from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Link } from "~/components/common";
import { NAV_ITEMS } from "~/constants";
import { Briefcase, LayoutDashboard, MessageSquare } from "lucide-react";

export const Navigation = () => {
  const { currentPath } = useRouter();
  const { profile } = useAuth();
  
  // Customize navigation items based on user role
  const navItems = useMemo(() => {
    if (profile?.role === 'vendor') {
      return [
        { path: "/vendor-dashboard", icon: Briefcase, label: "My Business" },
        { path: "/vendors", icon: NAV_ITEMS[1].icon, label: "Vendors" },
        { path: "/messages", icon: MessageSquare, label: "Messages" },
        { path: "/more", icon: NAV_ITEMS[3].icon, label: "More" },
      ];
    }
    // Default for couples
    return NAV_ITEMS;
  }, [profile?.role]);

  return (
    <>
      {/* Mobile Navigation - Bottom Bar */}
      <nav className="lg:hidden sticky bottom-0 border-t border-rose-600/20 bg-pink-50/95 backdrop-blur-md pt-2 pb-4 shadow-lg z-50">
        <div className="flex justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                  isActive
                    ? "text-rose-600"
                    : "text-rose-600/70 hover:text-rose-600 hover:bg-rose-50"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                <p
                  className={cn(
                    "text-xs font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation - Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 border-r border-rose-600/20 bg-pink-50/95 backdrop-blur-md shadow-lg flex-col py-8 px-4 z-50">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold text-rose-600">Perfect Wedding</h1>
          <p className="text-sm text-gray-600 mt-1">Plan your dream day</p>
        </div>
        
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-rose-600 text-white shadow-lg"
                    : "text-rose-600/70 hover:text-rose-600 hover:bg-rose-50"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                <p
                  className={cn(
                    "text-base font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-rose-600/20">
          <div className="px-4 py-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white">
            <p className="text-sm font-semibold mb-1">Need Help?</p>
            <p className="text-xs opacity-90">Contact our support team</p>
          </div>
        </div>
      </nav>
    </>
  );
};
