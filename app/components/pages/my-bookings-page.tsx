import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
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
}

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "1",
    vendorId: "1",
    vendorName: "The Grand Ballroom",
    vendorCategory: "Venue",
    vendorImage:
      "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80",
    status: "confirmed",
    date: "July 12, 2026",
    price: "$15,000",
    location: "Bucharest, Romania",
    depositPaid: true,
    depositAmount: "$3,000",
  },
  {
    id: "2",
    vendorId: "2",
    vendorName: "Elegant Moments Photography",
    vendorCategory: "Photo & Video",
    vendorImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
    status: "pending",
    date: "July 12, 2026",
    price: "$3,500",
    location: "Bucharest, Romania",
    depositPaid: false,
  },
];

export const MyBookingsPage = () => {
  const { navigate } = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings = SAMPLE_BOOKINGS.filter((booking) => {
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
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-white/90 text-sm">
          Manage your confirmed vendors
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

      <main className="flex-1 px-4 py-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {SAMPLE_BOOKINGS.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-green-600">$18,500</p>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No bookings yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start browsing vendors to book your services
            </p>
            <Button
              onClick={() => navigate("/vendors")}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-11 px-6"
            >
              Browse Vendors
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {/* Image Header */}
                <div
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${booking.vendorImage})` }}
                >
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {booking.vendorCategory}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.vendorName}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-rose-600" />
                      <span className="font-semibold">{booking.price}</span>
                      {booking.depositPaid && (
                        <span className="text-xs text-green-600">
                          • Deposit paid ({booking.depositAmount})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => navigate(`/chat/${booking.vendorId}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg h-10 font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </Button>
                    <Button
                      onClick={() =>
                        navigate(`/booking-details/${booking.id}`)
                      }
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-10 font-medium flex items-center justify-center gap-2"
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
