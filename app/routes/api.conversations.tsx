import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/conversations - Get all conversations for the current user
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    // Get user's role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isVendor = profile?.role === "vendor";

    // Fetch conversations where user is either couple or vendor
    let query = (supabase as SupabaseClient)
      .from("conversations")
      .select(
        `
        *,
        service:services(id, title, category, images)
        `
      )
      .order("last_message_at", { ascending: false });

    if (isVendor) {
      query = query.eq("vendor_id", user.id);
    } else {
      query = query.eq("couple_id", user.id);
    }

    const { data: conversations, error } = await query;

    if (error) {
      console.error("Error fetching conversations:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    // Fetch vendor and couple profiles separately
    const conversationIds = (conversations || []).map((c: any) => c.id);
    const vendorIds = (conversations || []).map((c: any) => c.vendor_id);
    const coupleIds = (conversations || []).map((c: any) => c.couple_id);

    // Fetch vendor profiles, couple profiles, and their weddings for name fallback
    const [vendorProfiles, coupleProfiles, coupleWeddings] = await Promise.all([
      vendorIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, business_name, avatar_url")
            .in("id", [...new Set(vendorIds)] as string[])
        : { data: [] },
      coupleIds.length > 0
        ? supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", [...new Set(coupleIds)] as string[])
        : { data: [] },
      coupleIds.length > 0
        ? supabase
            .from("weddings")
            .select("user_id, partner1_name, partner2_name")
            .in("user_id", [...new Set(coupleIds)] as string[])
        : { data: [] },
    ]);

    const vendorMap = new Map(
      (vendorProfiles.data || []).map((v: any) => [v.id, v])
    );
    const coupleMap = new Map(
      (coupleProfiles.data || []).map((c: any) => [c.id, c])
    );

    // Create a map of couple weddings for fallback names
    const coupleWeddingMap = new Map(
      (coupleWeddings.data || []).map((w: any) => [w.user_id, w])
    );

    // Fetch pending offers from messages for couples
    let pendingOffersMap = new Map();
    if (!isVendor && conversationIds.length > 0) {
      const { data: pendingOffers } = await (supabase as any)
        .from("messages")
        .select("id, conversation_id, offer_data, sender_id, created_at")
        .in("conversation_id", conversationIds)
        .eq("message_type", "offer")
        .order("created_at", { ascending: false });

      if (pendingOffers) {
        // Get the most recent pending offer for each conversation
        const offersByConversation = new Map<string, any>();
        for (const offer of pendingOffers) {
          const offerData = offer.offer_data || {};
          // Only include offers sent by vendors that are still pending
          if (
            offerData.status === "pending" &&
            !offersByConversation.has(offer.conversation_id)
          ) {
            // Check if sender is the vendor (not the couple)
            const conv = (conversations || []).find(
              (c: any) => c.id === offer.conversation_id
            );
            if (conv && conv.vendor_id === offer.sender_id) {
              offersByConversation.set(offer.conversation_id, offer);
            }
          }
        }
        pendingOffersMap = offersByConversation;
      }
    }

    // Format conversations for the frontend
    const formattedConversations = (conversations || []).map((conv: any) => {
      const vendor = vendorMap.get(conv.vendor_id);
      const couple = coupleMap.get(conv.couple_id);
      const wedding = coupleWeddingMap.get(conv.couple_id);
      const unreadCount = isVendor
        ? conv.vendor_unread_count
        : conv.couple_unread_count;

      // Determine couple name with better fallback logic
      let coupleName = "Couple";
      if (couple) {
        const fullName =
          `${couple.first_name || ""} ${couple.last_name || ""}`.trim();
        if (fullName) {
          coupleName = fullName;
        } else if (wedding) {
          // Use wedding partner names as fallback
          const partnerNames =
            `${wedding.partner1_name || ""} & ${wedding.partner2_name || ""}`.trim();
          if (partnerNames && partnerNames !== "&") {
            coupleName = partnerNames;
          }
        }
      }

      const pendingOffer = !isVendor
        ? pendingOffersMap.get(conv.id)
        : null;

      return {
        id: conv.id,
        conversationId: conv.id, // Add explicit conversationId for messages page
        vendorId: conv.vendor_id,
        vendorName: vendor?.business_name || "Vendor",
        vendorCategory: conv.service?.category || "Service",
        vendorAvatar:
          vendor?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            vendor?.business_name || "Vendor"
          )}`,
        coupleName: coupleName,
        coupleAvatar: couple?.avatar_url || null,
        lastMessage: conv.last_message_text || "",
        timestamp: formatTimestamp(conv.last_message_at),
        unread: unreadCount > 0,
        status: getConversationStatus(conv, isVendor, pendingOffer),
        serviceId: conv.service_id,
        serviceTitle: conv.service?.title,
        hasPendingOffer: !!pendingOffer,
        pendingOffer: pendingOffer
          ? {
              id: pendingOffer.id,
              price: pendingOffer.offer_data?.price,
              date: pendingOffer.offer_data?.date,
              services: pendingOffer.offer_data?.services || [],
              createdAt: pendingOffer.created_at,
            }
          : null,
      };
    });

    return Response.json(
      { conversations: formattedConversations },
      { headers }
    );
  } catch (error) {
    console.error("Error in conversations fetch:", error);
    return Response.json(
      { error: "Failed to fetch conversations" },
      { status: 500, headers }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const body = await request.json();
    const { vendorId, serviceId, initialMessage } = body;

    if (!vendorId) {
      return Response.json(
        { error: "Vendor ID is required" },
        { status: 400, headers }
      );
    }

    // Check if user is a couple
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "couple") {
      return Response.json(
        { error: "Only couples can initiate conversations" },
        { status: 403, headers }
      );
    }

    // Check if conversation already exists
    let existingQuery = (supabase as any)
      .from("conversations")
      .select("id")
      .eq("couple_id", user.id)
      .eq("vendor_id", vendorId);

    if (serviceId) {
      existingQuery = existingQuery.eq("service_id", serviceId);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    let conversationId: string;

    if (existing) {
      conversationId = existing.id;
    } else {
      // Create new conversation
      const conversationData: any = {
        couple_id: user.id,
        vendor_id: vendorId,
      };

      if (serviceId) {
        conversationData.service_id = serviceId;
      }

      const { data: conversation, error: convError } = await (supabase as any)
        .from("conversations")
        .insert(conversationData)
        .select("id")
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return Response.json(
          { error: convError.message },
          { status: 500, headers }
        );
      }

      conversationId = conversation.id;
    }

    // If initial message provided, create it
    if (initialMessage) {
      const { error: msgError } = await (supabase as any)
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message_type: "text",
          content: initialMessage,
        });

      if (msgError) {
        console.error("Error creating initial message:", msgError);
      }
    }

    return Response.json(
      { conversationId, success: true },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error in conversation creation:", error);
    return Response.json(
      { error: "Failed to create conversation" },
      { status: 500, headers }
    );
  }
}

function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}

function getConversationStatus(
  conv: any,
  isVendor: boolean,
  pendingOffer?: any
): string {
  // Check for pending offers
  if (pendingOffer && !isVendor) {
    return "pending"; // Pending offer from vendor
  }
  if (conv.status === "closed") return "booked";
  return "responded"; // Default status
}
