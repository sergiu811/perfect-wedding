import type { LoaderFunctionArgs } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase.server";

// GET /api/profiles/:id - Get a profile by ID
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return Response.json({ error: "Profile ID is required" }, { status: 400 });
  }

  const { supabase, headers } = createSupabaseServerClient(request);

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return Response.json({ error: error.message }, { status: 404, headers });
    }

    return Response.json({ profile }, { headers });
  } catch (error) {
    console.error("Error in profile fetch:", error);
    return Response.json(
      { error: "Failed to fetch profile" },
      { status: 500, headers }
    );
  }
}
