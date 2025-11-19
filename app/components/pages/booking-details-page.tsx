import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    DollarSign,
    CheckCircle,
    Clock,
    User,
    FileText,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

interface BookingDetailsPageProps {
    bookingId: string;
}

export const BookingDetailsPage = ({ bookingId }: BookingDetailsPageProps) => {
    const { navigate } = useRouter();
    const { profile } = useAuth();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isVendor = profile?.role === "vendor";

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/bookings/${bookingId}`);

                if (!response.ok) {
                    throw new Error("Failed to load booking details");
                }

                const data = await response.json();
                setBooking(data.booking);
            } catch (err: any) {
                console.error("Error fetching booking details:", err);
                setError(err.message || "Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Pending</span>
                    </div>
                );
            case "confirmed":
                return (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Confirmed</span>
                    </div>
                );
            case "completed":
                return (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Completed</span>
                    </div>
                );
            case "cancelled":
                return (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Cancelled</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const formatPrice = (price: number | null) => {
        if (price === null || price === undefined) return "$0";
        return `$${price.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Date not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-2">Booking Not Found</p>
                    <p className="text-gray-600 text-sm mb-4">{error || "This booking could not be found"}</p>
                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="text-rose-600 hover:text-rose-700 font-medium"
                    >
                        ← Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
                <button
                    onClick={() => navigate("/my-bookings")}
                    className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Bookings</span>
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1">Booking Details</h1>
                        <p className="text-white/90 text-sm">{booking.serviceTitle}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                </div>
            </div>

            <main className="px-4 py-6 max-w-4xl mx-auto space-y-4">
                {/* Service Image */}
                {booking.serviceImage && (
                    <div
                        className="h-48 bg-cover bg-center rounded-2xl shadow-md"
                        style={{ backgroundImage: `url(${booking.serviceImage})` }}
                    />
                )}

                {/* Other Party Info */}
                <div className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage: booking.otherPartyAvatar
                                    ? `url(${booking.otherPartyAvatar})`
                                    : `url(https://ui-avatars.com/api/?name=${encodeURIComponent(booking.otherPartyName)})`,
                            }}
                        />
                        <div>
                            <p className="text-xs text-gray-500 mb-1">
                                {isVendor ? "Client" : "Vendor"}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                                {booking.otherPartyName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Event Details</h2>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Event Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatDate(booking.eventDate)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {booking.location || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Total Price</p>
                                <p className="text-xl font-bold text-rose-600">
                                    {formatPrice(booking.totalPrice)}
                                </p>
                                {booking.depositPaid && (
                                    <p className="text-xs text-green-600 mt-1">
                                        ✓ Deposit paid: {formatPrice(booking.depositPaid)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offer Details */}
                {booking.offerDetails && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 shadow-md space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Offer Details</h2>

                        {/* Selected Packages */}
                        {booking.offerDetails.packageDetails &&
                            booking.offerDetails.packageDetails.length > 0 && (
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">
                                        Selected Packages
                                    </p>
                                    <div className="space-y-3">
                                        {booking.offerDetails.packageDetails.map((pkg: any, idx: number) => (
                                            <div key={pkg.id || idx} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-gray-900">{pkg.name}</p>
                                                        {pkg.price && (
                                                            <p className="text-sm font-bold text-purple-600">
                                                                ${typeof pkg.price === "number"
                                                                    ? pkg.price.toLocaleString()
                                                                    : pkg.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {pkg.description && (
                                                        <p className="text-sm text-gray-600">{pkg.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Included Services */}
                        {booking.offerDetails.services &&
                            booking.offerDetails.services.length > 0 && (
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">
                                        Included Services
                                    </p>
                                    <div className="space-y-2">
                                        {booking.offerDetails.services.map((service: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-700">{service}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                {/* Notes */}
                {booking.notes && (
                    <div className="bg-white rounded-2xl p-5 shadow-md">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Notes</h2>
                        <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                )}
            </main>
        </div>
    );
};
