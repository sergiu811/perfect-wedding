import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "./auth-context";
import { useRouter } from "./router-context";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import { Toast, ToastContainer } from "~/components/ui/toast";
import { decryptMessage, isEncrypted } from "~/lib/encryption";

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  avatar?: string;
  conversationId: string;
}

interface NotificationContextType {
  notificationPermission: NotificationPermission;
  requestPermission: () => Promise<void>;
  showInAppNotification: (notification: Omit<InAppNotification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { profile, user } = useAuth();
  const { navigate } = useRouter();
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);
  const subscriptionRef = useRef<any>(null);
  const conversationsCacheRef = useRef<Map<string, { name: string; avatar: string }>>(new Map());

  // Request notification permission
  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // Show in-app notification
  const showInAppNotification = useCallback((notification: Omit<InAppNotification, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setInAppNotifications((prev) => [...prev, { ...notification, id }]);
  }, []);

  // Remove in-app notification
  const removeInAppNotification = useCallback((id: string) => {
    setInAppNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback((conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  }, [navigate]);

  // Initialize notification permission and request if needed
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      
      // Auto-request permission when user is logged in and permission is default
      if (user && Notification.permission === "default") {
        // Small delay to avoid blocking the UI
        setTimeout(() => {
          Notification.requestPermission().then((permission) => {
            setNotificationPermission(permission);
          });
        }, 2000);
      }
    }
  }, [user]);

  // Set up global message subscription
  useEffect(() => {
    if (!user || !profile || typeof window === "undefined") return;

    const supabase = getSupabaseBrowserClient();
    let isMounted = true;

    // Fetch conversations to get names/avatars for notifications
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (response.ok) {
          const data = await response.json();
          const conversations = data.conversations || [];
          
          // Cache conversation info for notifications
          conversations.forEach((conv: any) => {
            const isVendorView = profile.role === "vendor";
            conversationsCacheRef.current.set(conv.id, {
              name: isVendorView
                ? conv.coupleName || "Couple"
                : conv.vendorName || "Vendor",
              avatar: isVendorView
                ? conv.coupleAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.coupleName || "Couple")}`
                : conv.vendorAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.vendorName || "Vendor")}`,
            });
          });
        }
      } catch (err) {
        console.error("Error fetching conversations for notifications:", err);
      }
    };

    fetchConversations();

    // Set up subscription to all messages
    // We'll filter by user's conversations in the handler
    const channel = supabase
      .channel("global-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          if (!isMounted) return;

          const newMessage = payload.new as any;
          const conversationId = newMessage.conversation_id;
          const senderId = newMessage.sender_id;

          console.log("[Notification] New message received:", {
            conversationId,
            senderId,
            userId: user.id,
            userRole: profile?.role
          });

          // Only process if message is from another user
          if (senderId === user.id) {
            console.log("[Notification] Message from self, ignoring");
            return;
          }

          // Check if user is currently on this chat page
          const isOnChatPage =
            typeof window !== "undefined" &&
            window.location.pathname === `/chat/${conversationId}`;

          // Don't show notification if user is on the chat page
          if (isOnChatPage) {
            console.log("[Notification] User on chat page, ignoring");
            return;
          }

          // Verify this conversation belongs to the user
          try {
            console.log("[Notification] Fetching conversations...");
            const response = await fetch("/api/conversations");
            if (response.ok) {
              const data = await response.json();
              const conversations = data.conversations || [];
              console.log("[Notification] User has", conversations.length, "conversations");
              
              const conversation = conversations.find(
                (c: any) => c.id === conversationId
              );

              if (!conversation) {
                console.log("[Notification] Conversation not found in user's conversations");
                return; // User doesn't have access to this conversation
              }

              console.log("[Notification] Conversation found:", conversation);

              // Get conversation info from cache or fetch
              let convInfo = conversationsCacheRef.current.get(conversationId);
              if (!convInfo) {
                const isVendorView = profile.role === "vendor";
                convInfo = {
                  name: isVendorView
                    ? conversation.coupleName || "Couple"
                    : conversation.vendorName || "Vendor",
                  avatar: isVendorView
                    ? conversation.coupleAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.coupleName || "Couple")}`
                    : conversation.vendorAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.vendorName || "Vendor")}`,
                };
                conversationsCacheRef.current.set(conversationId, convInfo);
              }

              // Fetch formatted message to get type and content
              console.log("[Notification] Fetching formatted message...");
              const messageResponse = await fetch(
                `/api/messages?conversationId=${conversationId}&messageId=${newMessage.id}`
              );

              if (messageResponse.ok) {
                const messageData = await messageResponse.json();
                let formattedMessage = messageData.message;

                // Decrypt message if it's encrypted text
                if (formattedMessage.type === "text" && formattedMessage.message && isEncrypted(formattedMessage.message)) {
                  try {
                    const decrypted = await decryptMessage(
                      formattedMessage.message,
                      conversationId
                    );
                    formattedMessage = { ...formattedMessage, message: decrypted };
                  } catch (error) {
                    console.error("Failed to decrypt notification message:", error);
                  }
                }

                // Create notification preview
                const messagePreview =
                  formattedMessage.type === "offer"
                    ? "sent you a booking offer"
                    : formattedMessage.message.length > 50
                      ? formattedMessage.message.substring(0, 50) + "..."
                      : formattedMessage.message;

                console.log("[Notification] Showing in-app notification");
                // Show in-app notification (ALWAYS show, regardless of browser permission)
                showInAppNotification({
                  title: convInfo.name,
                  message: messagePreview,
                  avatar: convInfo.avatar,
                  conversationId,
                });

                // Show browser notification ONLY if permission granted
                if (notificationPermission === "granted") {
                  console.log("[Notification] Showing browser notification");
                  new Notification(convInfo.name, {
                    body: messagePreview,
                    icon: convInfo.avatar || "/favicon.ico",
                    tag: `message-${conversationId}`,
                    requireInteraction: formattedMessage.type === "offer",
                  });
                } else {
                  console.log("[Notification] Browser permission not granted:", notificationPermission);
                }
              } else {
                console.error("[Notification] Failed to fetch formatted message:", messageResponse.status);
              }
            } else {
              console.error("[Notification] Failed to fetch conversations:", response.status);
            }
          } catch (err) {
            console.error("[Notification] Error showing notification:", err);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Global message notification subscription active");
        }
      });

    subscriptionRef.current = channel;

    // Refresh conversations cache periodically
    const refreshInterval = setInterval(() => {
      if (isMounted) {
        fetchConversations();
      }
    }, 60000); // Refresh every minute

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      clearInterval(refreshInterval);
    };
  }, [user, profile, notificationPermission, showInAppNotification, handleNotificationClick]);

  return (
    <NotificationContext.Provider
      value={{ notificationPermission, requestPermission, showInAppNotification }}
    >
      {children}
      <ToastContainer>
        {inAppNotifications.map((notification) => (
          <Toast
            key={notification.id}
            id={notification.id}
            title={notification.title}
            message={notification.message}
            avatar={notification.avatar}
            onClick={() => handleNotificationClick(notification.conversationId)}
            onClose={removeInAppNotification}
            duration={8000}
          />
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

