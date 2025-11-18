import React, { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Input } from "~/components/ui/input";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import { decryptMessage, isEncrypted } from "~/lib/encryption";

interface Message {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorAvatar: string;
  coupleName?: string;
  coupleAvatar?: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: "pending" | "responded" | "offer-sent" | "booked";
  conversationId: string;
}

export const MessagesPage = () => {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let subscription: any = null;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }

        const data = await response.json();
        const conversations = data.conversations || [];
        
          // Decrypt lastMessage for each conversation (skip if it's an offer message)
          const decryptedConversations = await Promise.all(
            conversations.map(async (conv: Message) => {
              // Skip decryption for offer messages or if hasPendingOffer
              if (conv.hasPendingOffer || conv.status === "offer-sent" || (conv.lastMessage && conv.lastMessage.startsWith("Booking Offer:"))) {
                return conv;
              }
              
              if (conv.lastMessage && isEncrypted(conv.lastMessage)) {
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
        
        setConversations(decryptedConversations);
      } catch (err: any) {
        console.error("Error fetching conversations:", err);
        setError(err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Set up realtime subscription for conversation updates
    subscription = supabase
      .channel("messages-page-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        async (payload) => {
          console.log("[MessagesPage] Conversation updated");
          const updatedConversation = payload.new as any;
          
          // Update the conversation in state without full refresh
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === updatedConversation.id);
            if (index === -1) {
              // New conversation, fetch it individually
              fetch("/api/conversations")
                .then((res) => res.json())
                .then(async (data) => {
                  const freshConv = data.conversations?.find(
                    (c: any) => c.id === updatedConversation.id
                  );
                  if (freshConv) {
                    // Decrypt lastMessage if encrypted
                    let decryptedConv = freshConv;
                    // Skip decryption for offer messages
                    if (!freshConv.hasPendingOffer && 
                        freshConv.status !== "offer-sent" && 
                        freshConv.lastMessage && 
                        !freshConv.lastMessage.startsWith("Booking Offer:") &&
                        isEncrypted(freshConv.lastMessage)) {
                      try {
                        const decrypted = await decryptMessage(
                          freshConv.lastMessage,
                          freshConv.conversationId
                        );
                        decryptedConv = { ...freshConv, lastMessage: decrypted };
                      } catch (error) {
                        console.error("Failed to decrypt last message:", error);
                      }
                    }
                    setConversations((current) => [decryptedConv, ...current]);
                  }
                });
              return prev;
            }
            
            // Update existing conversation directly from payload
            const updated = prev[index];
            const lastMessageText = updatedConversation.last_message_text || updated.lastMessage;
            const updatedConv = {
              ...updated,
              lastMessage: lastMessageText,
              timestamp: updatedConversation.last_message_at ? new Date(updatedConversation.last_message_at).toLocaleString() : updated.timestamp,
              unread: updatedConversation.couple_unread_count > 0 || updatedConversation.vendor_unread_count > 0,
            };
            
            // Decrypt lastMessage if encrypted (skip for offer messages)
            const isOfferMessage = lastMessageText && lastMessageText.startsWith("Booking Offer:");
            if (lastMessageText && !isOfferMessage && isEncrypted(lastMessageText)) {
              decryptMessage(lastMessageText, updatedConv.conversationId)
                .then((decrypted) => {
                  setConversations((current) => {
                    const filtered = current.filter(
                      (c) => c.id !== updatedConversation.id
                    );
                    return [{ ...updatedConv, lastMessage: decrypted }, ...filtered];
                  });
                })
                .catch((error) => {
                  console.error("Failed to decrypt last message:", error);
                  // Still update without decryption
                  const newConversations = [...prev];
                  newConversations[index] = updatedConv;
                  const [updatedItem] = newConversations.splice(index, 1);
                  setConversations([updatedItem, ...newConversations]);
                });
              return prev; // Return prev while decrypting
            }
            
            // No encryption, update directly
            const newConversations = [...prev];
            newConversations[index] = updatedConv;
            const [updatedItem] = newConversations.splice(index, 1);
            return [updatedItem, ...newConversations];
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[MessagesPage] Realtime subscription active");
        }
      });

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  const filteredMessages = conversations.filter((msg) => {
    const matchesSearch = msg.vendorName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || msg.status === filterStatus;
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

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      venue: "Venue",
      photo_video: "Photo & Video",
      music_dj: "Music/DJ",
      sweets: "Sweets",
      decorations: "Decorations",
      invitations: "Invitations",
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 lg:p-8 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Messages</h1>
        <p className="text-white/90 text-sm lg:text-base">
          {profile?.role === "vendor"
            ? "Chat with couples"
            : "Chat with your vendors"}
        </p>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 lg:h-14 pl-12 pr-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 border-0 shadow-md"
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

      <main className="flex-1 px-4 lg:px-6 xl:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">
              Loading conversations...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Try again
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.role === "vendor"
                ? "Couples will contact you through your services"
                : "Start by contacting vendors you're interested in"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {filteredMessages.map((message) => {
              // Determine what to display based on user role
              const isVendor = profile?.role === "vendor";
              const displayName = isVendor
                ? message.coupleName
                : message.vendorName;
              const displayAvatar = isVendor
                ? message.coupleAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(message.coupleName || "Couple")}`
                : message.vendorAvatar;
              const displayCategory = isVendor
                ? "Wedding Couple"
                : getCategoryLabel(message.vendorCategory);

              return (
                <button
                  key={message.id}
                  onClick={() => navigate(`/chat/${message.conversationId}`)}
                  className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-rose-200"
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-gray-100"
                      style={{ backgroundImage: `url(${displayAvatar})` }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate text-base lg:text-lg">
                            {displayName}
                          </h3>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {displayCategory}
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
                        className={`text-sm lg:text-base ${
                          message.unread
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        } line-clamp-2 mb-3`}
                      >
                        {message.lastMessage || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between">
                        {getStatusBadge(message.status)}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
