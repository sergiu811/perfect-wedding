import React, { useMemo } from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Link } from "~/components/common";
import { Badge } from "~/components/ui/badge";
import { NAV_ITEMS } from "~/constants";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import { Briefcase, LayoutDashboard, MessageSquare, BookOpen } from "lucide-react";

export const Navigation = () => {
  const { currentPath } = useRouter();
  const { profile, user } = useAuth();

  // Hide navigation on auth/login/signup pages
  const hideOnRoutes = ["/auth", "/login", "/signup"];
  if (hideOnRoutes.some((route) => currentPath.startsWith(route))) {
    return null;
  }

  // Hide navigation if vendor hasn't completed profile
  if (profile?.role === "vendor" && !profile?.profile_completed) {
    return null;
  }

  // Hide navigation on chat page (it has its own header/footer)
  if (currentPath.startsWith("/chat/")) {
    return null;
  }

  // Customize navigation items based on user role
  const navItems = useMemo(() => {
    if (profile?.role === "vendor") {
      return [
        { path: "/vendor-dashboard", icon: Briefcase, label: "My Business" },
        { path: "/vendors", icon: NAV_ITEMS[1].icon, label: "Vendors" },
        { path: "/messages", icon: MessageSquare, label: "Messages" },
        { path: "/my-bookings", icon: BookOpen, label: "My Bookings" },
        { path: "/more", icon: NAV_ITEMS[5].icon, label: "More" },
      ];
    }
    // Default for couples
    return NAV_ITEMS;
  }, [profile?.role]);

  // Unread messages count
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;

    const supabase = getSupabaseBrowserClient();
    let subscription: any = null;

    const fetchUnreadCount = async () => {
      const { count, error } = await (supabase as any)
        .from("messages")
        .select("*", { count: "exact", head: true })
        .is("read_at", null)
        .neq("sender_id", user.id);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    // Subscribe to message changes
    subscription = supabase
      .channel("global-messages-count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          // Refetch on any message change (insert, update, delete)
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user]);

  return (
    <>
      {/* Mobile Navigation - Fixed Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-rose-600/20 bg-pink-50/95 backdrop-blur-md pt-2 pb-3 shadow-lg z-50"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-around items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            // Short labels for mobile to prevent text overflow
            const getShortLabel = (label: string) => {
              const shortLabels: Record<string, string> = {
                "Home": "Home",
                "Vendors": "Vendors",
                "My Wedding": "Wedding",
                "Messages": "Messages",
                "My Bookings": "Bookings",
                "More": "More",
                "My Business": "Business",
              };
              return shortLabels[label] || label;
            };

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-lg transition-all duration-200 flex-1 min-w-0 relative",
                  isActive
                    ? "text-rose-600 bg-rose-50"
                    : "text-rose-600/70 active:text-rose-600 active:bg-rose-50"
                )}
              >
                <div className="relative">
                  <Icon
                    className="h-5 w-5 flex-shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.path === "/messages" && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium leading-tight text-center",
                    isActive && "font-semibold"
                  )}
                  style={{
                    lineHeight: "1.1",
                    wordBreak: "break-word",
                    hyphens: "auto"
                  }}
                >
                  {getShortLabel(item.label)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation - Fixed Sidebar */}
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
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "bg-rose-600 text-white shadow-lg"
                    : "text-rose-600/70 hover:text-rose-600 hover:bg-rose-50"
                )}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                  {item.path === "/messages" && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </div>
                <p
                  className={cn(
                    "text-base font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </p>
                {item.path === "/messages" && unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold"
                  >
                    {unreadCount}
                  </Badge>
                )}
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
