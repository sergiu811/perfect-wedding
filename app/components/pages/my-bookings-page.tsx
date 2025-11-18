import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Button } from "~/components/ui/button";

interface Booking {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorImage: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  price: string;
  location: string;
  depositPaid: boolean;
  depositAmount?: string;
  conversationId?: string;
}

interface BookingsSummary {
  totalBookings: number;
  totalSpent?: string;
  totalRevenue?: string;
  confirmed: number;
  pending: number;
}

export const MyBookingsPage = () => {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const isVendor = profile?.role === "vendor";
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<BookingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings");

        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }

        const data = await response.json();

        setBookings(data.bookings || []);
        setSummary(data.summary || null);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return booking.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Pending</span>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Confirmed</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 lg:p-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-white/90 text-sm lg:text-base">
          {isVendor
            ? "Manage your bookings and clients"
            : "Manage your confirmed vendors"}
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Completed", value: "completed" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === filter.value
                  ? "bg-white text-rose-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 lg:px-8 xl:px-12 py-6 lg:py-8 max-w-7xl mx-auto w-full">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">
                Total Bookings
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                {summary.totalBookings}
              </p>
            </div>
            {isVendor ? (
              <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">
                  {summary.totalRevenue || "$0"}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
                <p className="text-xs lg:text-sm text-gray-500 mb-1">
                  Total Spent
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">
                  {summary.totalSpent || "$0"}
                </p>
              </div>
            )}
            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Confirmed</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                {summary.confirmed}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <p className="text-xs lg:text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-2xl lg:text-3xl font-bold text-amber-600">
                {summary.pending}
              </p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No bookings yet</p>
            <p className="text-sm text-gray-500 mt-1">
              {isVendor
                ? "Your bookings will appear here when couples accept your offers"
                : "Start browsing vendors to book your services"}
            </p>
            {!isVendor && (
              <Button
                onClick={() => navigate("/vendors")}
                className="mt-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-11 px-6"
              >
                Browse Vendors
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Header */}
                <div
                  className="h-32 lg:h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${booking.vendorImage})` }}
                >
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-5 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {booking.vendorCategory}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {booking.vendorName}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span className="truncate">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span className="font-semibold">{booking.price}</span>
                      {booking.depositPaid && booking.depositAmount && (
                        <span className="text-xs text-green-600">
                          • Deposit paid ({booking.depositAmount})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        // Find conversation for this vendor
                        navigate(`/messages`);
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg h-10 font-medium flex items-center justify-center gap-2 text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Button>
                    <Button
                      onClick={() => navigate(`/booking-details/${booking.id}`)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-10 font-medium flex items-center justify-center gap-2 text-xs"
                    >
                      <FileText className="w-4 h-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
