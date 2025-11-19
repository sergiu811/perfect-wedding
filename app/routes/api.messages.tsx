import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/messages?conversationId=xxx&messageId=yyy - Get messages for a conversation
// If messageId is provided, returns only that single formatted message
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");
  const messageId = url.searchParams.get("messageId");

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

    // If messageId is provided, return only that single message (for realtime updates)
    if (messageId) {
      const { data: message, error: msgError } = await (supabase as any)
        .from("messages")
        .select("*")
        .eq("id", messageId)
        .eq("conversation_id", conversationId)
        .single();

      if (msgError || !message) {
        return Response.json(
          { error: "Message not found" },
          { status: 404, headers }
        );
      }

      // Format single message for frontend
      const formattedMessage = {
        id: message.id,
        sender:
          message.sender_id === conversation.couple_id ? "couple" : "vendor",
        message: message.content,
        timestamp: formatMessageTime(message.created_at),
        type: message.message_type,
        offerDetails: message.offer_data || undefined,
        read: !!message.read_at,
      };

      return Response.json({ message: formattedMessage }, { headers });
    }

    // Fetch all messages
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

      // If accepted, update the booking status to confirmed
      // (Booking should already exist from when the offer was sent)
      if (status === "accepted") {
        // Get user's wedding
        const { data: wedding } = await supabase
          .from("weddings")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!wedding) {
          console.error("Error updating booking: Wedding not found for user");
          return Response.json(
            {
              error:
                "Wedding not found. Please create a wedding profile first.",
            },
            { status: 400, headers }
          );
        }

        // Use bookingData if provided, otherwise use offer_data from message
        const offerData = message.offer_data || {};
        const serviceId = offerData.serviceId;
        const finalDate = bookingData?.date || offerData.date;
        const finalPrice = bookingData?.price || offerData.price;

        if (!serviceId) {
          console.error(
            "Error updating booking: Service ID not found in offer data"
          );
          return Response.json(
            { error: "Service ID is required to update booking" },
            { status: 400, headers }
          );
        }

        // Find the booking (should exist from when offer was sent)
        const { data: existingBooking } = await supabase
          .from("bookings")
          .select("id")
          .eq("wedding_id", wedding.id)
          .eq("service_id", serviceId)
          .maybeSingle();

        if (existingBooking) {
          // Update booking to confirmed status when offer is accepted
          const { error: updateError } = await supabase
            .from("bookings")
            .update({
              status: "confirmed",
              event_date: finalDate || undefined,
              total_price: finalPrice
                ? parseFloat(String(finalPrice).replace(/[^0-9.]/g, ""))
                : undefined,
              deposit_paid: bookingData?.deposit
                ? parseFloat(
                  String(bookingData.deposit).replace(/[^0-9.]/g, "")
                )
                : undefined,
              notes: bookingData?.notes || undefined,
              selected_packages: offerData.packageDetails || offerData.selectedPackages || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingBooking.id);

          if (updateError) {
            console.error("Error updating booking:", updateError);
            return Response.json(
              { error: "Failed to update booking: " + updateError.message },
              { status: 500, headers }
            );
          }
        } else {
          // Fallback: Create booking if it doesn't exist (for old offers)
          if (finalDate && finalPrice) {
            const { error: bookingError } = await supabase
              .from("bookings")
              .insert({
                wedding_id: wedding.id,
                service_id: serviceId,
                status: "confirmed",
                event_date: finalDate,
                total_price: parseFloat(
                  String(finalPrice).replace(/[^0-9.]/g, "")
                ),
                deposit_paid: bookingData?.deposit
                  ? parseFloat(
                    String(bookingData.deposit).replace(/[^0-9.]/g, "")
                  )
                  : null,
                notes: bookingData?.notes || null,
                selected_packages: offerData.packageDetails || offerData.selectedPackages || null,
              });

            if (bookingError) {
              console.error("Error creating booking:", bookingError);
              // Don't fail the request, just log the error
            }
          }
        }

        // Also update conversation status to closed
        await (supabase as any)
          .from("conversations")
          .update({ status: "closed" })
          .eq("id", conversation.id);
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

    // Check if user is a vendor (only vendors can send offers)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isVendor = profile?.role === "vendor";

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
      if (
        !offerData.price ||
        !offerData.date ||
        !offerData.services ||
        !offerData.serviceId
      ) {
        return Response.json(
          { error: "Offer must include serviceId, price, date, and services" },
          { status: 400, headers }
        );
      }

      // Only vendors can send offers
      if (!isVendor) {
        return Response.json(
          { error: "Only vendors can send offers" },
          { status: 403, headers }
        );
      }

      // Fetch the service to get package details
      let packageDetails: any[] = [];
      if (offerData.serviceId && offerData.selectedPackages?.length > 0) {
        const { data: service } = await supabase
          .from("services")
          .select("packages")
          .eq("id", offerData.serviceId)
          .single();

        if (service?.packages && Array.isArray(service.packages)) {
          // Get full details for selected packages
          packageDetails = service.packages.filter((pkg: any) =>
            offerData.selectedPackages?.includes(pkg.id || pkg.name)
          );
        }
      }

      offerDataToStore = {
        serviceId: offerData.serviceId,
        serviceName: offerData.serviceName || "Service",
        serviceCategory: offerData.serviceCategory || "",
        price: offerData.price,
        date: offerData.date,
        services: offerData.services,
        selectedPackages: offerData.selectedPackages || [],
        packageDetails: packageDetails, // Include full package details
        status: "pending",
      };
      const categoryLabel = offerData.serviceCategory
        ? ` (${offerData.serviceCategory})`
        : "";
      content = `Booking Offer: ${offerData.serviceName || "Service"}${categoryLabel}`;
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

    // If an offer was sent, create a booking with pending status
    if (msgType === "offer" && offerDataToStore && isVendor) {
      // Get the couple's wedding
      const { data: wedding } = await supabase
        .from("weddings")
        .select("id")
        .eq("user_id", conversation.couple_id)
        .single();

      if (wedding) {
        const serviceId = offerDataToStore.serviceId;
        const eventDate = offerDataToStore.date;
        const totalPrice = parseFloat(
          String(offerDataToStore.price).replace(/[^0-9.]/g, "")
        );

        // Check if booking already exists for this service and wedding
        const { data: existingBooking } = await supabase
          .from("bookings")
          .select("id")
          .eq("wedding_id", wedding.id)
          .eq("service_id", serviceId)
          .maybeSingle();

        if (existingBooking) {
          // Update existing booking to pending status
          await supabase
            .from("bookings")
            .update({
              status: "pending",
              event_date: eventDate,
              total_price: totalPrice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingBooking.id);
        } else {
          // Create new booking with pending status
          const { error: bookingError } = await supabase
            .from("bookings")
            .insert({
              wedding_id: wedding.id,
              service_id: serviceId,
              status: "pending",
              event_date: eventDate,
              total_price: totalPrice,
            });

          if (bookingError) {
            console.error("Error creating booking from offer:", bookingError);
            // Don't fail the message creation if booking creation fails
          }
        }
      }
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
