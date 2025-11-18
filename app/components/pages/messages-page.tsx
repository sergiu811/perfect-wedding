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
  conversationId: string;
}

export const MessagesPage = () => {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
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
            // Skip decryption for offer messages
            if (conv.lastMessage?.startsWith("Booking Offer:")) {
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

          // Refetch conversations to get updated data
          fetch("/api/conversations")
            .then((res) => res.json())
            .then(async (data) => {
              const conversations = data.conversations || [];

              // Decrypt lastMessage for each conversation (skip if it's an offer message)
              const decryptedConversations = await Promise.all(
                conversations.map(async (conv: Message) => {
                  // Skip decryption for offer messages
                  if (conv.lastMessage?.startsWith("Booking Offer:")) {
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
            })
            .catch((error) => {
              console.error("Error refetching conversations:", error);
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
    return matchesSearch;
  });

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
                        } line-clamp-2 mb-2`}
                      >
                        {message.lastMessage || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-end">
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
