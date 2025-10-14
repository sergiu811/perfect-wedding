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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";

export const VendorDashboard = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Header */}
      <header className="flex items-center bg-pink-50 p-4 pb-2 justify-between sticky top-0 z-10">
        <button onClick={() => navigate("/")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 leading-tight flex-1 text-center pr-6">
          Vendor Dashboard
        </h1>
      </header>

      <main className="p-4 space-y-4 flex-1">
          {/* Header Card */}
          <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="text-rose-600 text-sm font-semibold uppercase tracking-wide">
                  Wedding Planner
                </p>
                <p className="text-gray-900 text-xl font-bold leading-tight">
                  Elegant Events Co.
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Specializing in luxury weddings, Elegant Events Co. offers
                  bespoke planning services.
                </p>
              </div>
              <div
                className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-5167758481-83f29da8fd36?w=400&q=80")',
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/vendor-dashboard/public-profile")}
                variant="outline"
                className="flex items-center justify-center gap-2 border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11"
              >
                <Eye className="w-4 h-4" />
                <span>View Profile</span>
              </Button>
              <Button
                onClick={() => navigate("/vendor-dashboard/edit-profile")}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg h-11"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>

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
                {/* Quick Stats Section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                        Profile Views
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">
                      {stats.profileViews}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide">
                        Inquiries
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">
                      {stats.inquiries}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <p className="text-xs font-semibold text-pink-900 uppercase tracking-wide">
                        Saved
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-pink-900">
                      {stats.savedByCouples}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                      <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                        Rating
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-amber-900">
                      {stats.rating}
                      <span className="text-base font-normal text-amber-700">
                        /5
                      </span>
                    </p>
                  </div>
                </div>

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
