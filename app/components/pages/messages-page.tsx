import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  Clock,
  CheckCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { Input } from "~/components/ui/input";

interface Message {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: "pending" | "responded" | "offer-sent" | "booked";
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    vendorId: "1",
    vendorName: "The Grand Ballroom",
    vendorCategory: "Venue",
    vendorAvatar: "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=200&q=80",
    lastMessage: "We have availability for your date! Let me send you our package details.",
    timestamp: "2 hours ago",
    unread: true,
    status: "responded",
  },
  {
    id: "2",
    vendorId: "2",
    vendorName: "Elegant Moments Photography",
    vendorCategory: "Photo & Video",
    vendorAvatar: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&q=80",
    lastMessage: "Thank you for your inquiry! I'd love to discuss your vision.",
    timestamp: "1 day ago",
    unread: false,
    status: "responded",
  },
  {
    id: "3",
    vendorId: "3",
    vendorName: "Sweet Dreams Bakery",
    vendorCategory: "Sweets",
    vendorAvatar: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80",
    lastMessage: "You sent an inquiry",
    timestamp: "2 days ago",
    unread: false,
    status: "pending",
  },
];

export const MessagesPage = () => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredMessages = SAMPLE_MESSAGES.filter((msg) => {
    const matchesSearch = msg.vendorName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case "responded":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Responded
          </span>
        );
      case "offer-sent":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            Offer Sent
          </span>
        );
      case "booked":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Booked
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-white/90 text-sm">
          Chat with your vendors
        </p>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 border-0 shadow-md"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Responded", value: "responded" },
            { label: "Offers", value: "offer-sent" },
            { label: "Booked", value: "booked" },
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

      <main className="flex-1 px-4 py-6">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start by contacting vendors you're interested in
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => navigate(`/chat/${message.vendorId}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${message.vendorAvatar})` }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {message.vendorName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {message.vendorCategory}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {message.timestamp}
                        </p>
                        {message.unread && (
                          <div className="w-2 h-2 bg-rose-600 rounded-full" />
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-sm ${
                        message.unread
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      } truncate mb-2`}
                    >
                      {message.lastMessage}
                    </p>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(message.status)}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
