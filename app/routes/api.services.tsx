import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/services - Get all services or services for a specific vendor
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  const url = new URL(request.url);
  const vendorId = url.searchParams.get("vendorId");

  try {
    let query = supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (vendorId) {
      query = query.eq("vendor_id", vendorId);
    } else {
      query = query.eq("is_active", true);
    }

    const { data: services, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    // Fetch vendor profiles separately
    if (services && services.length > 0) {
      const vendorIds = [
        ...new Set(
          (services as any[]).map((s) => s.vendor_id).filter((id) => id)
        ),
      ];

      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from("profiles")
          .select("id, business_name, avatar_url")
          .in("id", vendorIds);

        const vendorMap = new Map((vendors || []).map((v: any) => [v.id, v]));

        // Attach vendor info to each service
        const servicesWithVendors = (services || []).map((service: any) => ({
          ...service,
          vendor: vendorMap.get(service.vendor_id) || null,
        }));

        return Response.json({ services: servicesWithVendors }, { headers });
      }
    }

    return Response.json({ services: services || [] }, { headers });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch services" },
      { status: 500, headers }
    );
  }
}

// POST /api/services - Create a new service
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const body = await request.json();
    const {
      title,
      category,
      description,
      priceMin,
      priceMax,
      location,
      contactMethod,
      tags,
      videoLink,
      availableDays,
      packages,
      specificFields,
      serviceRegion,
      images,
      leadTime,
    } = body;

    // Validate required fields
    if (!title || !category || !description || !location) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400, headers }
      );
    }

    // Check if user is a vendor
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "vendor") {
      return Response.json(
        { error: "Only vendors can create services" },
        { status: 403, headers }
      );
    }

    // Create the service
    const { data: service, error } = await supabase
      .from("services")
      .insert({
        vendor_id: user.id,
        title,
        category,
        description,
        price_min: priceMin ? parseFloat(priceMin) : null,
        price_max: priceMax ? parseFloat(priceMax) : null,
        location,
        contact_method: contactMethod,
        tags: tags || [],
        videos: videoLink ? [videoLink] : [],
        images: images || [],
        available_days: availableDays || [],
        packages: packages || [],
        specific_fields: specificFields || {},
        service_region: serviceRegion || null,
        lead_time: leadTime ? parseInt(leadTime, 10) : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating service:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    return Response.json({ service }, { status: 201, headers });
  } catch (error) {
    console.error("Error in service creation:", error);
    return Response.json(
      { error: "Failed to create service" },
      { status: 500, headers }
    );
  }
}
