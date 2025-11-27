import React, { useState, useRef, useEffect, useCallback } from "react";
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
  ChevronDown,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import { encryptMessage, decryptMessage, isEncrypted } from "~/lib/encryption";

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
    serviceId?: string;
    serviceName?: string;
    serviceCategory?: string;
    price: string;
    services: string[];
    date: string;
    selectedPackages?: string[];
    packageDetails?: Array<{
      id?: string;
      name: string;
      price?: string | number;
      description?: string;
    }>;
    status?: "pending" | "accepted" | "rejected" | "negotiated";
  };
}

export const ChatPage = ({ conversationId }: ChatPageProps) => {
  const { navigate } = useRouter();
  const { profile, user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  // Scroll button state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [conversationInfo, setConversationInfo] = useState<{
    vendorName: string;
    vendorAvatar: string;
    vendorCategory: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
        inline: "nearest",
      });
      // Reset unread count when scrolling to bottom
      setUnreadCount(0);
    } else {
      // Fallback: scroll the main container directly
      const mainEl = document.querySelector(
        "[data-chat-messages]"
      ) as HTMLElement;
      if (mainEl) {
        mainEl.scrollTop = mainEl.scrollHeight + 150;
        setUnreadCount(0);
      }
    }
  }, []);

  // Handle scroll event to show/hide button
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 150;

    setShowScrollButton(!isNearBottom);

    // If user scrolls to bottom manually, reset unread count
    if (isNearBottom) {
      setUnreadCount(0);
    }
  }, []);

  // Scroll to bottom only on initial load
  const hasScrolledRef = useRef(false);
  useEffect(() => {
    if (messages.length > 0 && !hasScrolledRef.current) {
      // Initial scroll
      const timeoutId = setTimeout(() => {
        scrollToBottom(false);
        hasScrolledRef.current = true;
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, scrollToBottom]);

  const isVendor = profile?.role === "vendor";

  // Offer form state
  const [offerData, setOfferData] = useState({
    serviceId: "",
    serviceName: "",
    serviceCategory: "",
    price: "",
    date: "",
    services: [""],
    selectedPackages: [] as string[], // Array of package IDs
  });

  // Vendor's services (for offer form)
  const [vendorServices, setVendorServices] = useState<any[]>([]);

  // Fetch messages + conversation info and setup realtime
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let subscription: any = null;
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const fetchPromises = [
          fetch(`/api/messages?conversationId=${conversationId}`),
          fetch("/api/conversations"),
        ];

        // If vendor, also fetch their services for the offer form
        if (isVendor && user?.id) {
          fetchPromises.push(fetch(`/api/services?vendorId=${user.id}`));
        }

        const responses = await Promise.all(fetchPromises);
        const messagesRes = responses[0];
        const conversationsRes = responses[1];
        const servicesRes = isVendor ? responses[2] : null;

        const messagesData = await messagesRes.json();
        const conversationsData = await conversationsRes.json();
        const servicesData = servicesRes ? await servicesRes.json() : null;

        if (!isMounted) return;

        const fetchedMessages = messagesData.messages || [];

        // Decrypt messages
        const decryptedMessages = await Promise.all(
          fetchedMessages.map(async (msg: any) => {
            if (
              msg.type === "text" &&
              msg.message &&
              isEncrypted(msg.message)
            ) {
              try {
                const decrypted = await decryptMessage(
                  msg.message,
                  conversationId
                );
                return { ...msg, message: decrypted };
              } catch (error) {
                console.error("Failed to decrypt message:", error);
                return msg;
              }
            }
            return msg;
          })
        );

        setMessages(decryptedMessages);

        // Set vendor services if available
        if (servicesData) {
          setVendorServices(servicesData.services || []);
        }

        const conv = conversationsData.conversations?.find(
          (c: any) => c.id === conversationId
        );

        if (conv) {
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
        }

        // Scroll to bottom after loading messages
        if (fetchedMessages.length > 0 && isMounted) {
          setTimeout(() => {
            if (isMounted) scrollToBottom(false);
          }, 200);
        }

        // Setup realtime subscription for new messages
        subscription = supabase
          .channel(`messages:${conversationId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            async (payload) => {
              if (!isMounted) return;

              const newMessageId = (payload.new as any).id;
              const senderId = (payload.new as any).sender_id;

              // Fetch formatted message from server-side API
              try {
                const response = await fetch(
                  `/api/messages?conversationId=${conversationId}&messageId=${newMessageId}`
                );
                if (response.ok && isMounted) {
                  const data = await response.json();
                  let formattedMessage = data.message as ChatMessage;

                  // Decrypt message if it's encrypted text
                  if (
                    formattedMessage.type === "text" &&
                    formattedMessage.message &&
                    isEncrypted(formattedMessage.message)
                  ) {
                    try {
                      const decrypted = await decryptMessage(
                        formattedMessage.message,
                        conversationId
                      );
                      formattedMessage = {
                        ...formattedMessage,
                        message: decrypted,
                      };
                    } catch (error) {
                      console.error(
                        "Failed to decrypt realtime message:",
                        error
                      );
                    }
                  }

                  // Note: Notifications are now handled globally by NotificationProvider
                  // This local check is kept for backward compatibility but global provider takes precedence

                  // Add new message to state (avoid duplicates)
                  setMessages((prev) => {
                    // Check if message already exists
                    if (prev.some((msg) => msg.id === formattedMessage.id)) {
                      // Update existing message with decrypted content
                      return prev.map((msg) =>
                        msg.id === formattedMessage.id ? formattedMessage : msg
                      );
                    }
                    return [...prev, formattedMessage];
                  });

                  // Scroll to bottom when new message arrives
                  if (isMounted) {
                    const isOnChatPage =
                      typeof window !== "undefined" &&
                      window.location.pathname === `/chat/${conversationId}`;

                    if (isOnChatPage) {
                      // Check if we should auto-scroll or show unread badge
                      const container = document.querySelector("[data-chat-messages]");
                      const isNearBottom = container
                        ? container.scrollHeight - container.scrollTop - container.clientHeight < 150
                        : true;

                      if (isNearBottom || formattedMessage.sender === (isVendor ? "vendor" : "couple")) {
                        // Auto-scroll if near bottom OR if I sent the message
                        setTimeout(() => {
                          if (isMounted) scrollToBottom(true);
                        }, 100);
                      } else {
                        // User is scrolled up, increment unread count
                        setUnreadCount(prev => prev + 1);
                      }
                    }
                  }
                }
              } catch (err) {
                console.error("Error fetching formatted message:", err);
                if (!isMounted) return;

                // Fallback: refetch all messages from server
                const response = await fetch(
                  `/api/messages?conversationId=${conversationId}`
                );
                if (response.ok && isMounted) {
                  const data = await response.json();
                  setMessages(data.messages || []);
                }
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            async (payload) => {
              if (!isMounted) return;

              const updatedMessageId = (payload.new as any).id;

              // Fetch updated formatted message from server-side API
              try {
                const response = await fetch(
                  `/api/messages?conversationId=${conversationId}&messageId=${updatedMessageId}`
                );
                if (response.ok && isMounted) {
                  const data = await response.json();
                  let formattedMessage = data.message as ChatMessage;

                  // Decrypt message if it's encrypted text
                  if (
                    formattedMessage.type === "text" &&
                    formattedMessage.message &&
                    isEncrypted(formattedMessage.message)
                  ) {
                    try {
                      const decrypted = await decryptMessage(
                        formattedMessage.message,
                        conversationId
                      );
                      formattedMessage = {
                        ...formattedMessage,
                        message: decrypted,
                      };
                    } catch (error) {
                      console.error(
                        "Failed to decrypt realtime update message:",
                        error
                      );
                    }
                  }

                  // Update message in state (for offer status changes)
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === formattedMessage.id ? formattedMessage : msg
                    )
                  );
                }
              } catch (err) {
                console.error("Error fetching updated message:", err);
                if (!isMounted) return;

                // Fallback: refetch all messages from server
                const response = await fetch(
                  `/api/messages?conversationId=${conversationId}`
                );
                if (response.ok && isMounted) {
                  const data = await response.json();
                  setMessages(data.messages || []);
                }
              }
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log(
                "Realtime subscription active for conversation:",
                conversationId
              );
            }
          });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchData();
    }

    // Cleanup subscription on unmount or conversation change
    return () => {
      isMounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [conversationId]); // Only re-subscribe when conversation changes

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);

      // Encrypt the message before sending
      const encryptedMessage = await encryptMessage(
        newMessage.trim(),
        conversationId
      );

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: encryptedMessage,
          messageType: "text",
        }),
      });

      const data = await response.json();

      // Decrypt the message if it's encrypted text
      let formattedMessage = data.message;
      if (
        formattedMessage.type === "text" &&
        formattedMessage.message &&
        isEncrypted(formattedMessage.message)
      ) {
        try {
          const decrypted = await decryptMessage(
            formattedMessage.message,
            conversationId
          );
          formattedMessage = { ...formattedMessage, message: decrypted };
          console.log("✅ Message decrypted successfully:", decrypted);
        } catch (error) {
          console.error("❌ Failed to decrypt sent message:", error);
          // Still add the message, but it will show encrypted
        }
      } else {
        console.log(
          "ℹ️ Message is not encrypted or not text type:",
          formattedMessage
        );
      }

      console.log("📤 Adding message to state:", formattedMessage);
      setMessages([...messages, formattedMessage]);
      setNewMessage("");

      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } catch (err) {
      console.error(err);
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
        const data = await response.json();
        throw new Error(data.error || "Failed to reject offer");
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
    } catch (error: any) {
      console.error("Error rejecting offer:", error);
      alert(error.message || "Failed to reject offer. Please try again.");
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
      !offerData.serviceId ||
      !offerData.price ||
      !offerData.date ||
      !offerData.services.some((s) => s.trim())
    ) {
      alert(
        "Please fill in all required fields (service, price, date, and details)"
      );
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
            serviceId: offerData.serviceId,
            serviceName: offerData.serviceName,
            serviceCategory: offerData.serviceCategory,
            price: offerData.price,
            date: offerData.date,
            services: offerData.services.filter((s) => s.trim() !== ""),
            selectedPackages: offerData.selectedPackages,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send offer");
      }

      const data = await response.json();
      // Don't add message here - realtime will handle it
      setShowOfferForm(false);
      setOfferData({
        serviceId: "",
        serviceName: "",
        serviceCategory: "",
        price: "",
        date: "",
        services: [""],
        selectedPackages: [],
      });

      // Scroll will happen via realtime subscription
    } catch (error) {
      console.error("Error sending offer:", error);
      alert("Failed to send offer. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-pink-50">
        <p>Loading...</p>
      </div>
    );
  }

  const vendorName = conversationInfo?.vendorName || "Vendor";
  const vendorAvatar = conversationInfo?.vendorAvatar || "";
  const vendorCategory = conversationInfo?.vendorCategory || "Service";

  return (
    <div className="w-screen flex flex-col h-screen bg-pink-50 overflow-hidden">
      {/* FIXED HEADER */}
      <header
        className="flex-none bg-white border-b border-gray-200 z-30 p-4 flex items-center gap-3"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <button onClick={() => navigate("/messages")}>
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div
          className="w-10 h-10 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${vendorAvatar})` }}
        />

        <div>
          <h1 className="font-bold">{vendorName}</h1>
          <p className="text-xs text-gray-500">{vendorCategory}</p>
        </div>

        <div className="ml-auto">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </div>
      </header>

      {/* SCROLLABLE MESSAGES AREA */}
      <div className="flex-1 relative min-h-0">
        <main
          data-chat-messages
          className="absolute inset-0 overflow-y-auto p-4"
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto w-full space-y-4 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === (isVendor ? "vendor" : "couple")
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
                      {/* Service Info */}
                      {msg.offerDetails?.serviceName && (
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Service</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {msg.offerDetails.serviceName}
                            {msg.offerDetails.serviceCategory && (
                              <span className="ml-2 text-xs font-normal text-gray-500">
                                ({msg.offerDetails.serviceCategory})
                              </span>
                            )}
                          </p>
                        </div>
                      )}

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

                      {/* Selected Packages */}
                      {msg.offerDetails?.packageDetails &&
                        msg.offerDetails.packageDetails.length > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-2">
                              Selected Packages
                            </p>
                            <ul className="space-y-1.5">
                              {msg.offerDetails.packageDetails.map((pkg, idx) => (
                                <li
                                  key={pkg.id || idx}
                                  className="text-xs text-gray-700 flex items-start gap-2"
                                >
                                  <CheckCheck className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <span className="font-semibold">
                                      {pkg.name}
                                    </span>
                                    {pkg.price && (
                                      <span className="ml-2 text-purple-600">
                                        ($
                                        {parseFloat(
                                          String(pkg.price)
                                        ).toLocaleString()}
                                        )
                                      </span>
                                    )}
                                    {pkg.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {pkg.description}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Included Services (custom details) */}
                      {msg.offerDetails?.services &&
                        msg.offerDetails.services.length > 0 && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-2">
                              Included Services
                            </p>
                            <ul className="space-y-1.5">
                              {msg.offerDetails.services.map((service, idx) => (
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
                        )}

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
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === (isVendor ? "vendor" : "couple")
                      ? "bg-rose-600 text-white"
                      : "bg-white text-gray-900"
                      }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* SCROLL TO BOTTOM BUTTON */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute right-4 bottom-4 z-40 bg-white shadow-lg rounded-full p-3 border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-200 transition-all animate-in fade-in zoom-in duration-200"
          >
            <div className="relative">
              <ChevronDown className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-5 -left-6 bg-rose-600 text-white text-[10px] font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      {/* FIXED BOTTOM AREA */}
      <div
        className="flex-none bg-white border-t border-gray-200 p-4 z-30"
        style={{
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
        }}
      >
        {isVendor && (
          <div className="mb-3">
            <button
              onClick={() => setShowOfferForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl h-11 font-semibold"
            >
              <DollarSign className="w-5 h-5 mr-1 inline-block" />
              Send Booking Offer
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600">
            <ImageIcon className="w-5 h-5" />
          </button>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-0 rounded-xl h-11 px-4"
          />

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-rose-600 text-white rounded-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Offer Form Modal */}
      {
        showOfferForm && (
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
                {/* Service Selection */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">
                    Select Service *
                  </label>
                  <select
                    value={offerData.serviceId}
                    onChange={(e) => {
                      const selectedService = vendorServices.find(
                        (s) => s.id === e.target.value
                      );
                      setOfferData({
                        ...offerData,
                        serviceId: e.target.value,
                        serviceName: selectedService?.title || "",
                        serviceCategory: selectedService?.category || "",
                        selectedPackages: [], // Reset packages when service changes
                      });
                    }}
                    className="w-full h-12 border border-gray-300 rounded-lg px-3 bg-white text-gray-900"
                  >
                    <option value="">Choose a service...</option>
                    {vendorServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} - {service.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Package Selection */}
                {offerData.serviceId &&
                  (() => {
                    const selectedService = vendorServices.find(
                      (s) => s.id === offerData.serviceId
                    );
                    const servicePackages = selectedService?.packages || [];

                    if (servicePackages.length > 0) {
                      return (
                        <div>
                          <label className="text-sm font-bold text-gray-900 mb-2 block">
                            Select Packages (Optional)
                          </label>
                          <p className="text-xs text-gray-500 mb-3">
                            Choose packages from this service to include in the
                            offer
                          </p>
                          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                            {servicePackages.map((pkg: any) => {
                              const isSelected =
                                offerData.selectedPackages.includes(
                                  pkg.id || pkg.name
                                );
                              return (
                                <label
                                  key={pkg.id || pkg.name}
                                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${isSelected
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      const packageId = pkg.id || pkg.name;
                                      if (e.target.checked) {
                                        setOfferData({
                                          ...offerData,
                                          selectedPackages: [
                                            ...offerData.selectedPackages,
                                            packageId,
                                          ],
                                        });
                                      } else {
                                        setOfferData({
                                          ...offerData,
                                          selectedPackages:
                                            offerData.selectedPackages.filter(
                                              (id) => id !== packageId
                                            ),
                                        });
                                      }
                                    }}
                                    className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="font-semibold text-gray-900 text-sm">
                                        {pkg.name || "Unnamed Package"}
                                      </p>
                                      {pkg.price && (
                                        <p className="text-sm font-bold text-purple-600">
                                          $
                                          {parseFloat(
                                            String(pkg.price)
                                          ).toLocaleString()}
                                        </p>
                                      )}
                                    </div>
                                    {pkg.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {pkg.description}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

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

                {/* Package Details */}
                <div>
                  <label className="text-sm font-bold text-gray-900 mb-2 block">
                    Package Details / What's Included *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Specify what's included in this package
                  </p>
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
        )
      }
    </div >
  );
};
