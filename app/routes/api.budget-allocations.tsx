import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/budget-allocations - Get all allocations for the user's wedding
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    // Get user's wedding
    const { data: wedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wedding) {
      return Response.json({ allocations: [] }, { headers });
    }

    // Fetch allocations
    const { data: allocations, error } = await supabase
      .from("budget_allocations")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching allocations:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    return Response.json({ allocations: allocations || [] }, { headers });
  } catch (error) {
    console.error("Error in allocations fetch:", error);
    return Response.json(
      { error: "Failed to fetch allocations" },
      { status: 500, headers }
    );
  }
}

// POST /api/budget-allocations - Create a new allocation
// PUT /api/budget-allocations - Update an allocation
// DELETE /api/budget-allocations - Delete an allocation
export async function action({ request }: ActionFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    // Get user's wedding
    const { data: wedding } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wedding) {
      return Response.json(
        { error: "Wedding not found" },
        { status: 404, headers }
      );
    }

    const method = request.method;

    if (method === "POST") {
      // Create new allocation
      const body = await request.json();
      const { category, allocated_amount, notes } = body;

      if (!category || allocated_amount === undefined || allocated_amount === null) {
        return Response.json(
          { error: "Category and allocated amount are required" },
          { status: 400, headers }
        );
      }

      const { data: allocation, error } = await supabase
        .from("budget_allocations")
        .insert({
          wedding_id: wedding.id,
          category,
          allocated_amount: parseFloat(allocated_amount),
          notes: notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating allocation:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ allocation, success: true }, { status: 201, headers });
    }

    if (method === "PUT") {
      // Update allocation
      const body = await request.json();
      const { id, category, allocated_amount, notes } = body;

      if (!id) {
        return Response.json(
          { error: "Allocation ID is required" },
          { status: 400, headers }
        );
      }

      // Verify allocation belongs to user's wedding
      const { data: existingAllocation } = await supabase
        .from("budget_allocations")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingAllocation || existingAllocation.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Allocation not found" },
          { status: 404, headers }
        );
      }

      const updateData: any = {};
      if (category !== undefined) updateData.category = category;
      if (allocated_amount !== undefined) updateData.allocated_amount = parseFloat(allocated_amount);
      if (notes !== undefined) updateData.notes = notes || null;

      const { data: allocation, error } = await supabase
        .from("budget_allocations")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating allocation:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ allocation, success: true }, { headers });
    }

    if (method === "DELETE") {
      // Delete allocation
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return Response.json(
          { error: "Allocation ID is required" },
          { status: 400, headers }
        );
      }

      // Verify allocation belongs to user's wedding
      const { data: existingAllocation } = await supabase
        .from("budget_allocations")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingAllocation || existingAllocation.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Allocation not found" },
          { status: 404, headers }
        );
      }

      const { error } = await supabase
        .from("budget_allocations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting allocation:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ success: true }, { headers });
    }

    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers }
    );
  } catch (error) {
    console.error("Error in allocation action:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500, headers }
    );
  }
}

