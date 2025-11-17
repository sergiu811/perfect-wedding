import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";

// GET /api/planning-tasks - Get all tasks for the user's wedding
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
      return Response.json({ tasks: [] }, { headers });
    }

    // Fetch tasks
    const { data: tasks, error } = await supabase
      .from("planning_tasks")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("order_index", { ascending: true })
      .order("due_date", { ascending: true, nullsLast: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      return Response.json({ error: error.message }, { status: 500, headers });
    }

    return Response.json({ tasks: tasks || [] }, { headers });
  } catch (error) {
    console.error("Error in tasks fetch:", error);
    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500, headers }
    );
  }
}

// POST /api/planning-tasks - Create a new task
// PUT /api/planning-tasks - Update a task
// DELETE /api/planning-tasks - Delete a task
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
      // Create new task
      const body = await request.json();
      const { title, category, due_date, priority, notes, order_index } = body;

      if (!title || !category) {
        return Response.json(
          { error: "Title and category are required" },
          { status: 400, headers }
        );
      }

      const { data: task, error } = await supabase
        .from("planning_tasks")
        .insert({
          wedding_id: wedding.id,
          title,
          category,
          due_date: due_date || null,
          priority: priority || "medium",
          notes: notes || null,
          order_index: order_index || 0,
          completed: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating task:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ task, success: true }, { status: 201, headers });
    }

    if (method === "PUT") {
      // Update task
      const body = await request.json();
      const {
        id,
        title,
        category,
        completed,
        due_date,
        priority,
        notes,
        order_index,
      } = body;

      if (!id) {
        return Response.json(
          { error: "Task ID is required" },
          { status: 400, headers }
        );
      }

      // Verify task belongs to user's wedding
      const { data: existingTask } = await supabase
        .from("planning_tasks")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingTask || existingTask.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Task not found" },
          { status: 404, headers }
        );
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (category !== undefined) updateData.category = category;
      if (completed !== undefined) updateData.completed = completed;
      if (due_date !== undefined) updateData.due_date = due_date || null;
      if (priority !== undefined) updateData.priority = priority;
      if (notes !== undefined) updateData.notes = notes || null;
      if (order_index !== undefined) updateData.order_index = order_index;

      const { data: task, error } = await supabase
        .from("planning_tasks")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating task:", error);
        return Response.json(
          { error: error.message },
          { status: 500, headers }
        );
      }

      return Response.json({ task, success: true }, { headers });
    }

    if (method === "DELETE") {
      // Delete task
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return Response.json(
          { error: "Task ID is required" },
          { status: 400, headers }
        );
      }

      // Verify task belongs to user's wedding
      const { data: existingTask } = await supabase
        .from("planning_tasks")
        .select("wedding_id")
        .eq("id", id)
        .single();

      if (!existingTask || existingTask.wedding_id !== wedding.id) {
        return Response.json(
          { error: "Task not found" },
          { status: 404, headers }
        );
      }

      const { error } = await supabase
        .from("planning_tasks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting task:", error);
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
    console.error("Error in task action:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500, headers }
    );
  }
}
