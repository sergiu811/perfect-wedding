import React, { useState } from "react";
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

export const VendorDashboard = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  // Sample data
  const stats = {
    profileViews: 340,
    inquiries: 12,
    savedByCouples: 25,
    rating: 4.9,
  };

  const upcomingBookings = [
    {
      id: 1,
      coupleNames: "Andrei & Maria",
      date: "Oct 22, 2025",
      status: "Confirmed",
    },
    {
      id: 2,
      coupleNames: "Elena & Victor",
      date: "Nov 15, 2025",
      status: "Pending",
    },
    {
      id: 3,
      coupleNames: "Sofia & Alex",
      date: "Dec 5, 2025",
      status: "Confirmed",
    },
  ];

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

  const listings = [
    {
      id: 1,
      name: "Full Wedding Package",
      price: "$5,000",
      description: "Complete wedding planning from start to finish",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80",
      status: "Active",
      views: 120,
      favorites: 8,
      inquiries: 2,
    },
    {
      id: 2,
      name: "Day-of Coordination",
      price: "$1,500",
      description: "Professional coordination on your wedding day",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
      status: "Active",
      views: 85,
      favorites: 5,
      inquiries: 1,
    },
    {
      id: 3,
      name: "Venue Selection",
      price: "$800",
      description: "Expert assistance in finding the perfect venue",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
      status: "Active",
      views: 62,
      favorites: 3,
      inquiries: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-pink-50">
      {/* Header & Summary Banner */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              Elegant Events Co. 💼
            </h1>
            <p className="text-white/90 text-sm">
              Wedding Planner
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
                className={`w-4 h-4 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
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
          {/* Add Service Button */}
          <Button
            onClick={() => navigate("/add-service/step-1")}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-base font-bold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Service</span>
          </Button>

          {/* Tab Navigation */}
          <div className="flex border-b-2 border-rose-600/20 bg-white rounded-t-xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-3 text-center text-sm font-bold transition-all ${
                activeTab === "dashboard"
                  ? "text-rose-600 border-b-2 border-rose-600"
                  : "text-rose-600/70"
              }`}
            >
              🩷 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex-1 py-3 text-center text-sm font-bold transition-all ${
                activeTab === "listings"
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
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-600" />
                    Upcoming Bookings
                  </h3>
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-pink-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {booking.coupleNames}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        coupleName: "Sarah & John",
                        service: "Full Wedding Package",
                        message: "We're interested in booking for July 2026",
                        time: "1h ago",
                        unread: true,
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                      },
                      {
                        id: 2,
                        coupleName: "Emma & Michael",
                        service: "Day-of Coordination",
                        message: "Can you provide more details about...",
                        time: "3h ago",
                        unread: true,
                        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                      },
                      {
                        id: 3,
                        coupleName: "Lisa & David",
                        service: "Consultation Package",
                        message: "Thank you for the quick response!",
                        time: "1d ago",
                        unread: false,
                        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                      },
                    ].map((inquiry) => (
                      <button
                        key={inquiry.id}
                        onClick={() => navigate(`/chat/${inquiry.id}`)}
                        className="w-full flex items-start gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors text-left"
                      >
                        <div
                          className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${inquiry.avatar})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {inquiry.coupleName}
                              </p>
                              <p className="text-xs text-rose-600">{inquiry.service}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <p className="text-xs text-gray-500">{inquiry.time}</p>
                              {inquiry.unread && (
                                <div className="w-2 h-2 bg-rose-600 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className={`text-xs ${inquiry.unread ? 'text-gray-900 font-medium' : 'text-gray-600'} truncate`}>
                            {inquiry.message}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
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
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div
                          className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url('${listing.image}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-base font-bold text-gray-900 truncate">
                              {listing.name}
                            </h4>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">
                              {listing.status}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-rose-600 mb-1">
                            {listing.price}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {listing.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {listing.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {listing.favorites}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {listing.inquiries}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 text-xs font-bold bg-rose-600/10 text-rose-600 rounded-lg hover:bg-rose-600/20 transition-colors flex items-center justify-center gap-1">
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button className="flex-1 px-3 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
    </div>
  );
};
