import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/services/:id - Get a single service
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Service ID is required" }, { status: 400 });
  }

  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const { data: service, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      return Response.json({ error: error.message }, { status: 404, headers });
    }

    // Fetch vendor profile information
    if (service && service.vendor_id) {
      const { data: vendor } = await supabase
        .from("profiles")
        .select(
          "id, business_name, avatar_url, bio, location, phone, website, instagram, facebook, business_hours, service_areas, specialties, starting_price, years_experience"
        )
        .eq("id", service.vendor_id)
        .single();

      return Response.json(
        { service: { ...service, vendor: vendor || null } },
        { headers }
      );
    }

    return Response.json({ service }, { headers });
  } catch (error) {
    console.error("Error in service fetch:", error);
    return Response.json(
      { error: "Failed to fetch service" },
      { status: 500, headers }
    );
  }
}

// PUT /api/services/:id - Update a service
// DELETE /api/services/:id - Delete a service
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Service ID is required" }, { status: 400 });
  }

  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  // Verify ownership
  const { data: service, error: fetchError } = await supabase
    .from("services")
    .select("vendor_id")
    .eq("id", id)
    .single();

  if (fetchError || !service) {
    return Response.json(
      { error: "Service not found" },
      { status: 404, headers }
    );
  }

  if (service.vendor_id !== user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 403, headers });
  }

  // Handle DELETE request
  if (request.method === "DELETE") {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) {
        console.error("Error deleting service:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ success: true }, { headers });
    } catch (error) {
      console.error("Error in service deletion:", error);
      return Response.json(
        { error: "Failed to delete service" },
        { status: 500, headers }
      );
    }
  }

  // Handle PUT request
  if (request.method === "PUT") {
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
        isActive,
        serviceRegion,
        images,
        leadTime,
      } = body;

      const updateData: any = {};

      if (title !== undefined) updateData.title = title;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;
      if (priceMin !== undefined)
        updateData.price_min = priceMin ? parseFloat(priceMin) : null;
      if (priceMax !== undefined)
        updateData.price_max = priceMax ? parseFloat(priceMax) : null;
      if (location !== undefined) updateData.location = location;
      if (contactMethod !== undefined)
        updateData.contact_method = contactMethod;
      if (tags !== undefined) updateData.tags = tags;
      if (videoLink !== undefined)
        updateData.videos = videoLink ? [videoLink] : [];
      if (availableDays !== undefined)
        updateData.available_days = availableDays;
      if (packages !== undefined) updateData.packages = packages;
      if (specificFields !== undefined)
        updateData.specific_fields = specificFields;
      if (isActive !== undefined) updateData.is_active = isActive;
      if (serviceRegion !== undefined)
        updateData.service_region = serviceRegion;
      if (images !== undefined) updateData.images = images;
      if (leadTime !== undefined)
        updateData.lead_time =
          leadTime && String(leadTime).length > 0
            ? parseInt(leadTime, 10)
            : null;

      const { data: updatedService, error } = await supabase
        .from("services")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating service:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ service: updatedService }, { headers });
    } catch (error) {
      console.error("Error in service update:", error);
      return Response.json(
        { error: "Failed to update service" },
        { status: 500, headers }
      );
    }
  }

  return Response.json(
    { error: "Method not allowed" },
    { status: 405, headers }
  );
}
