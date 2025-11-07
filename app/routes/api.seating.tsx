import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";
import { getSeatingChartByWeddingId, upsertSeatingChart } from "~/lib/seating";
import { getWeddingByUserId } from "~/lib/wedding";

// GET /api/seating - Fetch seating chart for the user's wedding
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  // Get wedding ID
  const { data: wedding } = await getWeddingByUserId(supabase, user.id);
  if (!wedding) {
    return Response.json({ tables: [] });
  }

  // Get seating chart for this wedding
  const { data: seatingChart, error } = await getSeatingChartByWeddingId(supabase, wedding.id);
  
  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  const tables = seatingChart?.tables || [];
  return Response.json({ tables, weddingId: wedding.id });
}

// POST /api/seating - Update seating chart
export async function action({ request }: ActionFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  // Get wedding ID
  const { data: wedding } = await getWeddingByUserId(supabase, user.id);
  if (!wedding) {
    throw new Response("No wedding found", { status: 404 });
  }

  const formData = await request.formData();
  const tables = JSON.parse(formData.get("tables") as string);

  const { error } = await upsertSeatingChart(supabase, wedding.id, tables);

  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  return Response.json({ success: true, tables });
}
