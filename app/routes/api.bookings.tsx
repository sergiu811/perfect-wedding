import type { LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/bookings - Get all bookings for the current user
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

    let bookingsQuery;

    if (isVendor) {
      // Vendors see bookings for their services
      // First get vendor's services
      const { data: vendorServices } = await supabase
        .from("services")
        .select("id")
        .eq("vendor_id", user.id);

      const serviceIds = (vendorServices || []).map((s: any) => s.id);

      if (serviceIds.length === 0) {
        return Response.json(
          {
            bookings: [],
            summary: {
              totalBookings: 0,
              totalSpent: "$0",
              confirmed: 0,
              pending: 0,
            },
          },
          { headers }
        );
      }

      bookingsQuery = supabase
        .from("bookings")
        .select(
          `
          *,
          service:services(id, title, category, images, vendor_id),
          wedding:weddings(id, partner1_name, partner2_name, location, wedding_date)
          `
        )
        .in("service_id", serviceIds)
        .order("created_at", { ascending: false });
    } else {
      // Couples see bookings for their weddings
      const { data: wedding } = await supabase
        .from("weddings")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!wedding) {
        return Response.json({ bookings: [] }, { headers });
      }

      bookingsQuery = supabase
        .from("bookings")
        .select(
          `
          *,
          service:services(id, title, category, images, vendor_id),
          wedding:weddings(id, partner1_name, partner2_name, location, wedding_date)
          `
        )
        .eq("wedding_id", wedding.id)
        .order("created_at", { ascending: false });
    }

    const { data: bookings, error } = await bookingsQuery;

    if (error) {
      console.error("Error fetching bookings:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    // Fetch vendor profiles for couples
    let vendorMap = new Map();
    if (!isVendor && bookings && bookings.length > 0) {
      const vendorIds = [
        ...new Set(
          (bookings as any[])
            .map((b) => b.service?.vendor_id)
            .filter((id) => id)
        ),
      ];
      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from("profiles")
          .select("id, business_name, avatar_url")
          .in("id", vendorIds);
        vendorMap = new Map((vendors || []).map((v: any) => [v.id, v]));
      }
    }

    // Fetch couple profiles for vendors
    let coupleMap = new Map();
    if (isVendor && bookings && bookings.length > 0) {
      const weddingIds = [
        ...new Set(
          (bookings as any[]).map((b) => b.wedding_id).filter((id) => id)
        ),
      ];
      if (weddingIds.length > 0) {
        const { data: weddings } = await supabase
          .from("weddings")
          .select("id, user_id")
          .in("id", weddingIds);
        const userIds = [
          ...new Set(
            (weddings || []).map((w: any) => w.user_id).filter((id) => id)
          ),
        ];
        if (userIds.length > 0) {
          const { data: couples } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, avatar_url")
            .in("id", userIds);
          coupleMap = new Map((couples || []).map((c: any) => [c.id, c]));
        }
      }
    }

    // Format bookings for frontend
    const formattedBookings = (bookings || []).map((booking: any) => {
      const service = booking.service;
      let vendor;
      if (isVendor) {
        const wedding = booking.wedding;
        const couple = wedding?.user_id ? coupleMap.get(wedding.user_id) : null;
        vendor = {
          name: couple
            ? `${couple.first_name || ""} ${couple.last_name || ""}`.trim() ||
              "Couple"
            : "Couple",
          avatar: couple?.avatar_url,
        };
      } else {
        const vendorProfile = service?.vendor_id
          ? vendorMap.get(service.vendor_id)
          : null;
        vendor = {
          name: vendorProfile?.business_name || "Vendor",
          avatar: vendorProfile?.avatar_url,
        };
      }

      return {
        id: booking.id,
        vendorId: isVendor ? user.id : service?.vendor_id,
        vendorName: isVendor ? "Your Service" : vendor.name,
        vendorCategory: getCategoryLabel(service?.category || ""),
        vendorImage:
          service?.images?.[0] ||
          vendor.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.name)}`,
        status: booking.status || "pending",
        date: formatDate(booking.event_date),
        eventDate: booking.event_date, // Raw date for filtering
        price: formatPrice(booking.total_price),
        totalPrice: booking.total_price || 0, // Raw number for calculations
        location: booking.wedding?.location || "Location not specified",
        depositPaid: !!booking.deposit_paid,
        depositAmount: booking.deposit_paid
          ? formatPrice(booking.deposit_paid)
          : undefined,
        serviceId: service?.id,
        coupleName: isVendor ? vendor.name : undefined,
        coupleAvatar: isVendor ? vendor.avatar : undefined,
      };
    });

    // Calculate summary stats
    const totalBookings = formattedBookings.length;
    const totalSpent = formattedBookings.reduce(
      (sum, b) => sum + parseFloat(b.price.replace(/[^0-9.]/g, "") || "0"),
      0
    );
    const confirmedCount = formattedBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pendingCount = formattedBookings.filter(
      (b) => b.status === "pending"
    ).length;

    return Response.json(
      {
        bookings: formattedBookings,
        summary: {
          totalBookings,
          totalSpent: formatPrice(totalSpent),
          confirmed: confirmedCount,
          pending: pendingCount,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Error in bookings fetch:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500, headers }
    );
  }
}

function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    venue: "Venue",
    photo_video: "Photo & Video",
    music_dj: "Music/DJ",
    sweets: "Sweets",
    decorations: "Decorations",
    invitations: "Invitations",
  };
  return categoryMap[category] || category;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Date not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "$0";
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
