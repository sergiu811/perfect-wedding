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

        // Build query for availability
        let query = supabase
            .from("service_availability")
            .select("*")
            .eq("service_id", serviceId)
            .order("date", { ascending: true });

        if (startDate) {
            query = query.gte("date", startDate);
        }
        if (endDate) {
            query = query.lte("date", endDate);
        }

        const { data: availability, error } = await query;

        if (error) {
            console.error("Error fetching availability:", error);
            return Response.json(
                { error: error.message },
                { status: 500, headers }
            );
        }

        return Response.json(
            { availability: availability || [] },
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
