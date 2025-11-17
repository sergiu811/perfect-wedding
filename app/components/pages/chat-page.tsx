import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  CheckCheck,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface ChatPageProps {
  conversationId: string;
}

interface ChatMessage {
  id: string;
  sender: "couple" | "vendor";
  message: string;
  timestamp: string;
  type: "text" | "offer" | "booking";
  offerDetails?: {
    price: string;
    services: string[];
    date: string;
    status?: "pending" | "accepted" | "rejected" | "negotiated";
  };
}

export const ChatPage = ({ conversationId }: ChatPageProps) => {
  const { navigate } = useRouter();
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationInfo, setConversationInfo] = useState<{
    vendorName: string;
    vendorAvatar: string;
    vendorCategory: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Offer form state
  const [offerData, setOfferData] = useState({
    price: "",
    date: "",
    services: [""],
  });

  const isVendor = profile?.role === "vendor";

  // Fetch messages and conversation info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messagesRes, conversationsRes] = await Promise.all([
          fetch(`/api/messages?conversationId=${conversationId}`),
          fetch("/api/conversations"),
        ]);

        if (!messagesRes.ok) {
          const error = await messagesRes.json();
          console.error("Messages API error:", error);
          throw new Error(error.error || "Failed to load messages");
        }

        if (!conversationsRes.ok) {
          const error = await conversationsRes.json();
          console.error("Conversations API error:", error);
          throw new Error(error.error || "Failed to load conversations");
        }

        const messagesData = await messagesRes.json();
        const conversationsData = await conversationsRes.json();

        setMessages(messagesData.messages || []);

        // Find conversation info
        const conv = conversationsData.conversations?.find(
          (c: any) => c.id === conversationId
        );

        if (conv) {
          // Determine what to show based on user role
          const isVendorView = profile?.role === "vendor";

          setConversationInfo({
            vendorName: isVendorView
              ? conv.coupleName || "Couple"
              : conv.vendorName,
            vendorAvatar: isVendorView
              ? conv.coupleAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.coupleName || "Couple")}`
              : conv.vendorAvatar,
            vendorCategory: isVendorView
              ? "Wedding Couple"
              : conv.vendorCategory,
          });
        } else {
          console.warn("Conversation not found in list");
        }
      } catch (error: any) {
        console.error("Error fetching chat data:", error);
        alert(`Error loading chat: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchData();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: newMessage.trim(),
          messageType: "text",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleAcceptOffer = async (messageId: string, offerDetails: any) => {
    try {
      const response = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          status: "accepted",
          bookingData: {
            date: offerDetails.date,
            price: offerDetails.price,
            deposit: null,
            notes: null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept offer");
      }

      // Update message in local state
      setMessages(
        messages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                offerDetails: {
                  ...msg.offerDetails!,
                  status: "accepted",
                },
              }
            : msg
        )
      );

      navigate("/my-bookings");
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleRejectOffer = async (messageId: string) => {
    try {
      const response = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          status: "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject offer");
      }

      // Update message in local state
      setMessages(
        messages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                offerDetails: {
                  ...msg.offerDetails!,
                  status: "rejected",
                },
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error rejecting offer:", error);
      alert("Failed to reject offer. Please try again.");
    }
  };

  const addService = () => {
    setOfferData({
      ...offerData,
      services: [...offerData.services, ""],
    });
  };

  const updateService = (index: number, value: string) => {
    const newServices = [...offerData.services];
    newServices[index] = value;
    setOfferData({ ...offerData, services: newServices });
  };

  const removeService = (index: number) => {
    const newServices = offerData.services.filter((_, i) => i !== index);
    setOfferData({ ...offerData, services: newServices });
  };

  const handleSendOffer = async () => {
    if (
      !offerData.price ||
      !offerData.date ||
      !offerData.services.some((s) => s.trim())
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSending(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messageType: "offer",
          offerData: {
            price: offerData.price,
            date: offerData.date,
            services: offerData.services.filter((s) => s.trim() !== ""),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send offer");
      }

      const data = await response.json();
      setMessages([...messages, data.message]);
      setShowOfferForm(false);
      setOfferData({ price: "", date: "", services: [""] });
    } catch (error) {
      console.error("Error sending offer:", error);
      alert("Failed to send offer. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const vendorName = conversationInfo?.vendorName || "Vendor";
  const vendorAvatar = conversationInfo?.vendorAvatar || "";
  const vendorCategory = conversationInfo?.vendorCategory || "Service";

  return (
    <div className="w-full min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate("/messages")}
            className="text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${vendorAvatar})` }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate">
              {vendorName}
            </h1>
            <p className="text-xs lg:text-sm text-gray-500">{vendorCategory}</p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === (isVendor ? "vendor" : "couple")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.type === "offer" ? (
                // Offer Card
                <div className="max-w-[85%] lg:max-w-[70%] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 lg:p-5 border-2 border-purple-200 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Booking Offer</p>
                      <p className="text-xs text-gray-500">{msg.timestamp}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {msg.offerDetails?.price}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-2">Event Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {msg.offerDetails?.date}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Included Services
                      </p>
                      <ul className="space-y-1.5">
                        {msg.offerDetails?.services.map((service, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-700 flex items-start gap-2"
                          >
                            <CheckCheck className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {msg.offerDetails?.status === "accepted" ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-green-700">
                          ✓ Offer Accepted
                        </p>
                      </div>
                    ) : msg.offerDetails?.status === "rejected" ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-red-700">
                          Offer Rejected
                        </p>
                      </div>
                    ) : !isVendor && msg.offerDetails?.status === "pending" ? (
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() =>
                            handleAcceptOffer(msg.id, msg.offerDetails)
                          }
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-10 font-semibold"
                        >
                          Accept Offer
                        </Button>
                        <Button
                          onClick={() => handleRejectOffer(msg.id)}
                          className="flex-1 bg-white hover:bg-gray-100 text-gray-900 rounded-lg h-10 font-semibold border border-gray-300"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                // Regular Message
                <div
                  className={`max-w-[75%] lg:max-w-[60%] ${
                    msg.sender === (isVendor ? "vendor" : "couple")
                      ? "bg-rose-600 text-white"
                      : "bg-white text-gray-900"
                  } rounded-2xl px-4 py-3 shadow-sm`}
                >
                  <p className="text-sm lg:text-base leading-relaxed">
                    {msg.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === (isVendor ? "vendor" : "couple")
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Create Booking Offer
              </h3>
              <button
                onClick={() => setShowOfferForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Price */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Total Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={offerData.price}
                    onChange={(e) =>
                      setOfferData({ ...offerData, price: e.target.value })
                    }
                    placeholder="15,000"
                    className="w-full pl-10 h-12 border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Event Date *
                </label>
                <Input
                  type="date"
                  value={offerData.date}
                  onChange={(e) =>
                    setOfferData({ ...offerData, date: e.target.value })
                  }
                  className="w-full h-12 border-gray-300 rounded-lg"
                />
              </div>

              {/* Services */}
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Included Services *
                </label>
                <div className="space-y-2">
                  {offerData.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={service}
                        onChange={(e) => updateService(index, e.target.value)}
                        placeholder="e.g., Venue rental for 8 hours"
                        className="flex-1 h-10 border-gray-300 rounded-lg text-sm"
                      />
                      {offerData.services.length > 1 && (
                        <button
                          onClick={() => removeService(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addService}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowOfferForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl h-12 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendOffer}
                  disabled={sending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-semibold disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Offer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
        {isVendor && (
          <div className="mb-3">
            <button
              onClick={() => setShowOfferForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-11 font-semibold flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Send Booking Offer
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Type a message..."
              className="w-full bg-gray-100 border-0 rounded-xl h-11 px-4"
              disabled={sending}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
