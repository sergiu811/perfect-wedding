import type { ActionFunctionArgs } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { redirect } from "react-router";

// POST /api/auth/signout - Sign out the current user
export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  // Return success with headers to clear the session cookie
  return Response.json(
    { success: true },
    { headers }
  );
}
