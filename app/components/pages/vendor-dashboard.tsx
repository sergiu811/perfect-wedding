import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  MessageCircle,
  Heart,
  Star,
  Calendar,
  Clock,
  Bell,
  Edit,
  Plus,
  Search,
  ChevronDown,
  Trash2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { useServiceForm } from "~/contexts/service-context";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import { decryptMessage, isEncrypted } from "~/lib/encryption";

export const VendorDashboard = () => {
  const { navigate } = useRouter();
  const { user, profile } = useAuth();
  const { startEditingService, startNewService } = useServiceForm();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Fetch services when listings tab is clicked
  useEffect(() => {
    if (activeTab === "listings" && user?.id) {
      fetchServices();
    }
  }, [activeTab, user?.id]);

  // Fetch dashboard data when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard" && user?.id) {
      fetchDashboardData();
    }
  }, [activeTab, user?.id]);

  // Set up realtime subscription for conversation updates
  useEffect(() => {
    if (activeTab !== "dashboard" || !user?.id) return;

    const supabase = getSupabaseBrowserClient();
    let subscription: any = null;

    subscription = supabase
      .channel("vendor-dashboard-conversations")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        async (payload) => {
          console.log("[VendorDashboard] Conversation updated");
          const updatedConversation = payload.new as any;

          // Update the inquiry in state
          setRecentInquiries((prev) => {
            const index = prev.findIndex(
              (c) => c.id === updatedConversation.id || c.conversationId === updatedConversation.id
            );

            if (index === -1) {
              // New conversation, fetch fresh data
              fetchDashboardData();
              return prev;
            }

            // Update existing conversation
            const updated = prev[index];
            const lastMessageText =
              updatedConversation.last_message_text || updated.lastMessage;
            const updatedConv = {
              ...updated,
              lastMessage: lastMessageText,
              timestamp: updatedConversation.last_message_at
                ? new Date(updatedConversation.last_message_at).toLocaleString()
                : updated.timestamp,
              unread:
                updatedConversation.vendor_unread_count > 0 ||
                updated.unread,
            };

            // Decrypt lastMessage if encrypted (skip for offer messages)
            const isOfferMessage =
              lastMessageText && lastMessageText.startsWith("Booking Offer:");
            if (
              lastMessageText &&
              !isOfferMessage &&
              isEncrypted(lastMessageText) &&
              updatedConv.conversationId
            ) {
              decryptMessage(lastMessageText, updatedConv.conversationId)
                .then((decrypted) => {
                  setRecentInquiries((current) => {
                    const newInquiries = [...current];
                    const currentIndex = newInquiries.findIndex(
                      (c) =>
                        c.id === updatedConversation.id ||
                        c.conversationId === updatedConversation.id
                    );
                    if (currentIndex !== -1) {
                      newInquiries[currentIndex] = {
                        ...updatedConv,
                        lastMessage: decrypted,
                      };
                      // Sort by timestamp to keep most recent first
                      return newInquiries.sort((a, b) => {
                        const timeA = new Date(a.timestamp || 0).getTime();
                        const timeB = new Date(b.timestamp || 0).getTime();
                        return timeB - timeA;
                      });
                    }
                    return current;
                  });
                })
                .catch((error) => {
                  console.error("Failed to decrypt last message:", error);
                  // Still update without decryption
                  const newInquiries = [...prev];
                  newInquiries[index] = updatedConv;
                  return newInquiries.sort((a, b) => {
                    const timeA = new Date(a.timestamp || 0).getTime();
                    const timeB = new Date(b.timestamp || 0).getTime();
                    return timeB - timeA;
                  });
                });
              return prev; // Return prev while decrypting
            }

            // No encryption, update directly
            const newInquiries = [...prev];
            newInquiries[index] = updatedConv;
            // Sort by timestamp to keep most recent first
            return newInquiries.sort((a, b) => {
              const timeA = new Date(a.timestamp || 0).getTime();
              const timeB = new Date(b.timestamp || 0).getTime();
              return timeB - timeA;
            });
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[VendorDashboard] Realtime subscription active");
        }
      });

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [activeTab, user?.id]);

  const fetchServices = async () => {
    if (!user?.id) return;

    setLoadingServices(true);
    try {
      const response = await fetch(`/api/services?vendorId=${user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    setLoadingDashboard(true);
    try {
      // Fetch conversations and bookings in parallel
      const [conversationsRes, bookingsRes] = await Promise.all([
        fetch("/api/conversations"),
        fetch("/api/bookings"),
      ]);

      if (!conversationsRes.ok || !bookingsRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const conversationsData = await conversationsRes.json();
      const bookingsData = await bookingsRes.json();

      // Get the 3 most recent conversations
      const recent = (conversationsData.conversations || []).slice(0, 3);

      // Decrypt lastMessage for each conversation (skip if it's an offer message)
      const decryptedInquiries = await Promise.all(
        recent.map(async (conv: any) => {
          // Skip decryption for offer messages or if hasPendingOffer
          if (
            conv.hasPendingOffer ||
            conv.status === "offer-sent" ||
            (conv.lastMessage && conv.lastMessage.startsWith("Booking Offer:"))
          ) {
            return conv;
          }

          if (conv.lastMessage && isEncrypted(conv.lastMessage) && conv.conversationId) {
            try {
              const decrypted = await decryptMessage(
                conv.lastMessage,
                conv.conversationId
              );
              return { ...conv, lastMessage: decrypted };
            } catch (error) {
              console.error("Failed to decrypt last message:", error);
              return conv;
            }
          }
          return conv;
        })
      );

      setRecentInquiries(decryptedInquiries);

      // Get upcoming bookings - show all bookings, sorted by event date
      const allBookings = bookingsData.bookings || [];

      // Filter and sort bookings
      const upcoming = allBookings
        .filter((b: any) => {
          // Show confirmed, pending, or if date is in the future
          const isFutureDate =
            b.eventDate && new Date(b.eventDate) > new Date();
          const isRelevantStatus = ["confirmed", "pending"].includes(b.status);
          return isFutureDate || isRelevantStatus;
        })
        .sort((a: any, b: any) => {
          if (!a.eventDate || !b.eventDate) return 0;
          return (
            new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
          );
        })
        .slice(0, 3);

      setUpcomingBookings(upcoming);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setRecentInquiries([]);
      setUpcomingBookings([]);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleDeleteService = async (
    serviceId: string,
    serviceName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${serviceName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      // Refresh the services list
      await fetchServices();

      alert("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleToggleActive = async (
    serviceId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service status");
      }

      // Refresh the services list
      await fetchServices();
    } catch (error) {
      console.error("Error updating service status:", error);
      alert("Failed to update service status. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setShowUserMenu(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  // Sample data for stats (would need additional API endpoints for real data)
  const stats = {
    profileViews: 340,
    inquiries: recentInquiries.length,
    savedByCouples: 25,
    rating: 4.9,
  };

  const notifications = [
    {
      id: 1,
      text: "You received a new inquiry for Day-of Coordination.",
      time: "2 hours ago",
      icon: MessageCircle,
    },
    {
      id: 2,
      text: "Your Full Wedding Package received a 5-star review.",
      time: "5 hours ago",
      icon: Star,
    },
    {
      id: 3,
      text: "Andrei & Maria confirmed their booking.",
      time: "1 day ago",
      icon: Calendar,
    },
    {
      id: 4,
      text: "Your profile was saved by 3 new couples.",
      time: "2 days ago",
      icon: Heart,
    },
  ];

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-pink-50">
      {/* Header & Summary Banner */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {profile?.business_name || "Your Business"} 💼
            </h1>
            <p className="text-white/90 text-sm">
              {profile?.location || "Location not set"}
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-full backdrop-blur-sm transition-all"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-rose-600" />
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-white/80" />
                <p className="text-white/90 text-xs">Views</p>
              </div>
              <p className="text-2xl font-bold">{stats.profileViews}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="w-4 h-4 text-white/80" />
                <p className="text-white/90 text-xs">Inquiries</p>
              </div>
              <p className="text-2xl font-bold">{stats.inquiries}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-white/80" />
                <p className="text-white/90 text-xs">Saved</p>
              </div>
              <p className="text-2xl font-bold">{stats.savedByCouples}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-white/80" />
                <p className="text-white/90 text-xs">Rating</p>
              </div>
              <p className="text-2xl font-bold">
                {stats.rating}
                <span className="text-sm font-normal text-white/80">/5</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            onClick={() => navigate("/vendor-dashboard/public-profile")}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 font-semibold rounded-lg h-11"
          >
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
          <Button
            onClick={() => navigate("/vendor-dashboard/edit-profile")}
            className="flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-rose-600 font-semibold rounded-lg h-11"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      <main className="p-4 space-y-4 flex-1">
        {/* Profile Details Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Business Profile
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Business Name
              </p>
              <p className="text-sm text-gray-900">
                {profile?.business_name || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Contact Person
              </p>
              <p className="text-sm text-gray-900">
                {profile?.first_name || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Phone Number
              </p>
              <p className="text-sm text-gray-900">
                {profile?.phone || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Service Location
              </p>
              <p className="text-sm text-gray-900">
                {profile?.location || "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Business Description
              </p>
              <p className="text-sm text-gray-900">
                {profile?.bio || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Add Service Button */}
        <Button
          onClick={() => {
            startNewService();
            navigate("/add-service/step-1");
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-base font-bold shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Service</span>
        </Button>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-rose-600/20 bg-white rounded-t-xl">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-all ${activeTab === "dashboard"
              ? "text-rose-600 border-b-2 border-rose-600"
              : "text-rose-600/70"
              }`}
          >
            🩷 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-all ${activeTab === "listings"
              ? "text-rose-600 border-b-2 border-rose-600"
              : "text-rose-600/70"
              }`}
          >
            💼 My Listings
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "dashboard" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Upcoming Bookings Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-600" />
                    Upcoming Bookings
                  </h3>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    View All
                  </button>
                </div>
                {loadingDashboard ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading bookings...
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => navigate("/my-bookings")}
                        className="w-full flex flex-col gap-2 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                              style={{
                                backgroundImage: booking.coupleAvatar
                                  ? `url(${booking.coupleAvatar})`
                                  : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(booking.coupleName || "Couple")})`,
                              }}
                            />
                            <div className="text-left">
                              <p className="font-bold text-gray-900">
                                {booking.coupleName || "Couple"}
                              </p>
                              {booking.serviceTitle && (
                                <p className="text-xs text-rose-600 truncate">
                                  {booking.serviceTitle}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(booking.eventDate)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {capitalizeStatus(booking.status)}
                          </span>
                        </div>

                        {/* Display selected packages if available */}
                        {(() => {
                          const packages = Array.isArray(booking.selectedPackages)
                            ? booking.selectedPackages
                            : booking.selectedPackages
                              ? [booking.selectedPackages]
                              : [];

                          if (packages.length === 0) return null;

                          return (
                            <div className="w-full mt-1 pt-2 border-t border-pink-200/50">
                              <div className="flex flex-wrap gap-1.5">
                                {packages.map((pkg: any, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white/60 text-rose-700 border border-rose-100"
                                  >
                                    {pkg.name || pkg.title || `Package ${idx + 1}`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Inquiries & Messages */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-rose-600" />
                    Recent Inquiries
                  </h3>
                  <button
                    onClick={() => navigate("/messages")}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    View All
                  </button>
                </div>
                {loadingDashboard ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading messages...
                  </div>
                ) : recentInquiries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent inquiries</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentInquiries.map((inquiry: any) => (
                      <button
                        key={inquiry.conversationId}
                        onClick={() =>
                          navigate(`/chat/${inquiry.conversationId}`)
                        }
                        className="w-full flex items-start gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors text-left"
                      >
                        <div
                          className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: inquiry.coupleAvatar
                              ? `url(${inquiry.coupleAvatar})`
                              : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(inquiry.coupleName || "Couple")})`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {inquiry.coupleName || "Couple"}
                              </p>
                              <p className="text-xs text-rose-600 truncate">
                                {inquiry.serviceTitle || "General Inquiry"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <p className="text-xs text-gray-500">
                                {inquiry.timestamp}
                              </p>
                              {inquiry.unread && (
                                <div className="w-2 h-2 bg-rose-600 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-xs ${inquiry.unread ? "text-gray-900 font-medium" : "text-gray-600"} truncate`}
                          >
                            {inquiry.lastMessage || "New conversation"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Feed */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-3 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {notification.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Header Controls */}
              <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your listings..."
                    className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select className="appearance-none w-full h-10 px-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-rose-600 focus:border-transparent">
                      <option>All Categories</option>
                      <option>Venue</option>
                      <option>Photo & Video</option>
                      <option>Music/DJ</option>
                      <option>Decorations</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="appearance-none w-full h-10 px-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-rose-600 focus:border-transparent">
                      <option>Sort: Newest</option>
                      <option>Sort: Price</option>
                      <option>Sort: Popularity</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="space-y-3">
                {loadingServices ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <p className="text-gray-600">Loading your services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <p className="text-gray-600 mb-4">
                      You haven't added any services yet.
                    </p>
                    <Button
                      onClick={() => navigate("/add-service/step-1")}
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div
                          className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0 bg-gray-200"
                          style={{
                            backgroundImage: service.images?.[0]
                              ? `url('${service.images[0]}')`
                              : undefined,
                          }}
                        >
                          {!service.images?.[0] && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Eye className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-base font-bold text-gray-900 truncate">
                              {service.title}
                            </h4>
                            <button
                              onClick={() =>
                                handleToggleActive(
                                  service.id,
                                  service.is_active
                                )
                              }
                              className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${service.is_active
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              title="Click to toggle active status"
                            >
                              {service.is_active ? "Active" : "Inactive"}
                            </button>
                          </div>
                          <p className="text-lg font-bold text-rose-600 mb-1">
                            {service.price_min && service.price_max
                              ? `$${service.price_min} - $${service.price_max}`
                              : service.price_min
                                ? `From $${service.price_min}`
                                : "Price on request"}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {service.view_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />0
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {service.booking_count || 0}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                startEditingService(service);
                                navigate("/add-service/step-1");
                              }}
                              className="flex-1 px-3 py-2 text-xs font-bold bg-rose-600/10 text-rose-600 rounded-lg hover:bg-rose-600/20 transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteService(service.id, service.title)
                              }
                              className="flex-1 px-3 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
