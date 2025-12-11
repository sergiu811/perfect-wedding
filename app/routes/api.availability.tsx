import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/availability?serviceId=xxx&startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
export async function loader({ request }: LoaderFunctionArgs) {
    const user = await requireAuth(request);
    const { supabase, headers } = createSupabaseServerClient(request);

    const url = new URL(request.url);
    const serviceId = url.searchParams.get("serviceId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!serviceId) {
        return Response.json(
            { error: "serviceId is required" },
            { status: 400, headers }
        );
    }

    try {
        // Verify the service exists
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("id, vendor_id")
            .eq("id", serviceId)
            .single();

        if (serviceError || !service) {
            return Response.json(
                { error: "Service not found" },
                { status: 404, headers }
            );
        }

        // Note: We removed the vendor_id check here to allow couples to check availability

        // 1. Get manual availability settings
        let availabilityQuery = supabase
            .from("service_availability")
            .select("*")
            .eq("service_id", serviceId)
            .order("date", { ascending: true });

        if (startDate) {
            availabilityQuery = availabilityQuery.gte("date", startDate);
        }
        if (endDate) {
            availabilityQuery = availabilityQuery.lte("date", endDate);
        }

        const { data: manualAvailability, error: availabilityError } = await availabilityQuery;

        if (availabilityError) {
            throw availabilityError;
        }

        // 2. Get confirmed bookings
        let bookingsQuery = supabase
            .from("bookings")
            .select("event_date")
            .eq("service_id", serviceId)
            .eq("status", "confirmed");

        if (startDate) {
            bookingsQuery = bookingsQuery.gte("event_date", startDate);
        }
        if (endDate) {
            bookingsQuery = bookingsQuery.lte("event_date", endDate);
        }

        const { data: confirmedBookings, error: bookingsError } = await bookingsQuery;

        if (bookingsError) {
            throw bookingsError;
        }

        // 3. Merge results
        // Start with manual availability
        const availabilityMap = new Map();
        (manualAvailability || []).forEach((item: any) => {
            availabilityMap.set(item.date, item);
        });

        // Override with confirmed bookings (these are definitely booked)
        (confirmedBookings || []).forEach((booking: any) => {
            // If there's already an entry, update it to booked
            if (availabilityMap.has(booking.event_date)) {
                const existing = availabilityMap.get(booking.event_date);
                availabilityMap.set(booking.event_date, {
                    ...existing,
                    status: "booked"
                });
            } else {
                // Create new entry for booked date
                availabilityMap.set(booking.event_date, {
                    service_id: serviceId,
                    date: booking.event_date,
                    status: "booked",
                    created_at: new Date().toISOString(), // Placeholder
                    updated_at: new Date().toISOString()  // Placeholder
                });
            }
        });

        const mergedAvailability = Array.from(availabilityMap.values());

        return Response.json(
            { availability: mergedAvailability },
            { headers }
        );
    } catch (error) {
        console.error("Error in availability fetch:", error);
        return Response.json(
            { error: "Failed to fetch availability" },
            { status: 500, headers }
        );
    }
}

// POST /api/availability - Toggle date availability
export async function action({ request }: ActionFunctionArgs) {
    const user = await requireAuth(request);
    const { supabase, headers } = createSupabaseServerClient(request);

    try {
        const body = await request.json();
        const { serviceId, date, status } = body;

        if (!serviceId || !date || !status) {
            return Response.json(
                { error: "serviceId, date, and status are required" },
                { status: 400, headers }
            );
        }

        // Verify the service belongs to the vendor
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("id, vendor_id")
            .eq("id", serviceId)
            .single();

        if (serviceError || !service) {
            return Response.json(
                { error: "Service not found" },
                { status: 404, headers }
            );
        }

        if (service.vendor_id !== user.id) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 403, headers }
            );
        }

        // Cannot modify dates with 'booked' status
        if (status === "booked") {
            return Response.json(
                { error: "Cannot manually set status to 'booked'" },
                { status: 400, headers }
            );
        }

        // Check if date is already booked
        const { data: existing } = await supabase
            .from("service_availability")
            .select("*")
            .eq("service_id", serviceId)
            .eq("date", date)
            .single();

        if (existing && existing.status === "booked") {
            return Response.json(
                { error: "This date is already booked and cannot be modified" },
                { status: 400, headers }
            );
        }

        // Upsert availability
        const { data, error } = await supabase
            .from("service_availability")
            .upsert(
                {
                    service_id: serviceId,
                    date,
                    status,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "service_id,date" }
            )
            .select()
            .single();

        if (error) {
            console.error("Error updating availability:", error);
            return Response.json(
                { error: error.message },
                { status: 500, headers }
            );
        }

        return Response.json({ availability: data }, { headers });
    } catch (error) {
        console.error("Error in availability action:", error);
        return Response.json(
            { error: "Failed to update availability" },
            { status: 500, headers }
        );
    }
}
