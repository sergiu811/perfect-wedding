import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/messages?conversationId=xxx - Get messages for a conversation
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");

  if (!conversationId) {
    return Response.json(
      { error: "Conversation ID is required" },
      { status: 400, headers }
    );
  }

  try {
    // Verify user has access to this conversation
    const { data: conversation, error: convError } = await (supabase as any)
      .from("conversations")
      .select("couple_id, vendor_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404, headers }
      );
    }

    if (
      conversation.couple_id !== user.id &&
      conversation.vendor_id !== user.id
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403, headers });
    }

    // Fetch messages
    const { data: messages, error } = await (supabase as any)
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    // Mark messages as read
    await (supabase as any).rpc("mark_messages_read", {
      p_conversation_id: conversationId,
      p_user_id: user.id,
    });

    // Format messages for frontend
    const formattedMessages = (messages || []).map((msg: any) => ({
      id: msg.id,
      sender: msg.sender_id === conversation.couple_id ? "couple" : "vendor",
      message: msg.content,
      timestamp: formatMessageTime(msg.created_at),
      type: msg.message_type,
      offerDetails: msg.offer_data || undefined,
      read: !!msg.read_at,
    }));

    return Response.json({ messages: formattedMessages }, { headers });
  } catch (error) {
    console.error("Error in messages fetch:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500, headers }
    );
  }
}

// POST /api/messages - Send a message or create an offer
// PUT /api/messages - Update offer status (accept/reject/negotiate)
export async function action({ request }: ActionFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  if (request.method === "PUT") {
    // Handle offer status update
    try {
      const body = await request.json();
      const { messageId, status, bookingData } = body;

      if (!messageId || !status) {
        return Response.json(
          { error: "Message ID and status are required" },
          { status: 400, headers }
        );
      }

      // Get the message
      const { data: message, error: msgError } = await (supabase as any)
        .from("messages")
        .select("*, conversation:conversations(*)")
        .eq("id", messageId)
        .single();

      if (msgError || !message) {
        return Response.json(
          { error: "Message not found" },
          { status: 404, headers }
        );
      }

      // Verify user can update this offer (must be the couple)
      const conversation = message.conversation as any;
      if (conversation.couple_id !== user.id) {
        return Response.json(
          { error: "Only couples can accept/reject offers" },
          { status: 403, headers }
        );
      }

      // Update offer status
      const updatedOfferData = {
        ...(message.offer_data || {}),
        status: status,
      };

      const { error: updateError } = await (supabase as any)
        .from("messages")
        .update({ offer_data: updatedOfferData })
        .eq("id", messageId);

      if (updateError) {
        console.error("Error updating offer:", updateError);
        return Response.json(
          { error: updateError.message },
          { status: 500, headers }
        );
      }

      // If accepted, create a booking
      if (status === "accepted" && bookingData) {
        // Get user's wedding
        const { data: wedding } = await supabase
          .from("weddings")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (wedding) {
          await supabase.from("bookings").insert({
            wedding_id: wedding.id,
            service_id: conversation.service_id,
            status: "confirmed",
            event_date: bookingData.date,
            total_price: parseFloat(bookingData.price.replace(/[^0-9.]/g, "")),
            deposit_paid: bookingData.deposit
              ? parseFloat(bookingData.deposit.replace(/[^0-9.]/g, ""))
              : null,
            notes: bookingData.notes || null,
          });
        }
      }

      return Response.json({ success: true }, { headers });
    } catch (error) {
      console.error("Error updating offer:", error);
      return Response.json(
        { error: "Failed to update offer" },
        { status: 500, headers }
      );
    }
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Handle message creation
  try {
    const body = await request.json();
    const { conversationId, message, messageType, offerData } = body;

    if (!conversationId) {
      return Response.json(
        { error: "Conversation ID is required" },
        { status: 400, headers }
      );
    }

    // Verify user has access to this conversation
    const { data: conversation, error: convError } = await (supabase as any)
      .from("conversations")
      .select("couple_id, vendor_id")
      .eq("id", conversationId)
      .single();

    if (convError || !conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404, headers }
      );
    }

    if (
      conversation.couple_id !== user.id &&
      conversation.vendor_id !== user.id
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403, headers });
    }

    // Determine message type
    const msgType = messageType || "text";
    let content = message || "Booking Offer";
    let offerDataToStore = null;

    if (msgType === "offer") {
      if (!offerData) {
        return Response.json(
          { error: "Offer data is required for offer messages" },
          { status: 400, headers }
        );
      }

      // Validate offer data
      if (!offerData.price || !offerData.date || !offerData.services) {
        return Response.json(
          { error: "Offer must include price, date, and services" },
          { status: 400, headers }
        );
      }

      offerDataToStore = {
        price: offerData.price,
        date: offerData.date,
        services: offerData.services,
        status: "pending",
      };
      content = "Booking Offer";
    }

    // Create message
    const { data: newMessage, error: msgError } = await (supabase as any)
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_type: msgType,
        content: content,
        offer_data: offerDataToStore,
      })
      .select()
      .single();

    if (msgError) {
      console.error("Error creating message:", msgError);
      return Response.json(
        { error: msgError.message },
        { status: 500, headers }
      );
    }

    return Response.json(
      {
        message: {
          id: newMessage.id,
          sender:
            newMessage.sender_id === conversation.couple_id
              ? "couple"
              : "vendor",
          message: newMessage.content,
          timestamp: formatMessageTime(newMessage.created_at),
          type: newMessage.message_type,
          offerDetails: newMessage.offer_data || undefined,
        },
        success: true,
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("Error in message creation:", error);
    return Response.json(
      { error: "Failed to send message" },
      { status: 500, headers }
    );
  }
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
