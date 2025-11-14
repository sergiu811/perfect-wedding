import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/budget-expenses - Get all expenses for the user's wedding
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
      return Response.json({ expenses: [] }, { headers });
    }

    // Fetch expenses
    const { data: expenses, error } = await supabase
      .from("budget_expenses")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    return Response.json({ expenses: expenses || [] }, { headers });
  } catch (error) {
    console.error("Error in expenses fetch:", error);
    return Response.json(
      { error: "Failed to fetch expenses" },
      { status: 500, headers }
    );
  }
}

// POST /api/budget-expenses - Create a new expense
// PUT /api/budget-expenses - Update an expense
// DELETE /api/budget-expenses - Delete an expense
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
      // Create new expense
      const body = await request.json();
      const { name, category, amount, description, expense_date } = body;

      if (!name || !category || amount === undefined || amount === null) {
        return Response.json(
          { error: "Name, category, and amount are required" },
          { status: 400, headers }
        );
      }

      const { data: expense, error } = await supabase
        .from("budget_expenses")
        .insert({
          wedding_id: wedding.id,
          name,
          category,
          amount: parseFloat(amount),
          description: description || null,
          expense_date: expense_date || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating expense:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ expense, success: true }, { status: 201, headers });
    }

    if (method === "PUT") {
      // Update expense
      const body = await request.json();
      const { id, name, category, amount, description, expense_date } = body;

      if (!id) {
        return Response.json(
          { error: "Expense ID is required" },
          { status: 400, headers }
        );
      }

      // Verify expense belongs to user's wedding
      const { data: existingExpense } = await supabase
        .from("budget_expenses")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingExpense || existingExpense.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Expense not found" },
          { status: 404, headers }
        );
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (amount !== undefined) updateData.amount = parseFloat(amount);
      if (description !== undefined) updateData.description = description || null;
      if (expense_date !== undefined) updateData.expense_date = expense_date || null;

      const { data: expense, error } = await supabase
        .from("budget_expenses")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating expense:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ expense, success: true }, { headers });
    }

    if (method === "DELETE") {
      // Delete expense
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return Response.json(
          { error: "Expense ID is required" },
          { status: 400, headers }
        );
      }

      // Verify expense belongs to user's wedding
      const { data: existingExpense } = await supabase
        .from("budget_expenses")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingExpense || existingExpense.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Expense not found" },
          { status: 404, headers }
        );
      }

      const { error } = await supabase
        .from("budget_expenses")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting expense:", error);
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
    console.error("Error in expense action:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500, headers }
    );
  }
}

