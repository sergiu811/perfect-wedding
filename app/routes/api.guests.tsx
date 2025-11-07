import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { createSupabaseServerClient, requireAuth } from "~/lib/supabase.server";
import { getGuestsByWeddingId, createGuest, updateGuest, deleteGuest, bulkCreateGuests } from "~/lib/guests";
import { getWeddingByUserId } from "~/lib/wedding";

// GET /api/guests - Fetch all guests for the user's wedding
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  // Get wedding ID
  const { data: wedding } = await getWeddingByUserId(supabase, user.id);
  if (!wedding) {
    return Response.json({ guests: [] });
  }

  // Get guests for this wedding
  const { data: guests, error } = await getGuestsByWeddingId(supabase, wedding.id);
  
  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  return Response.json({ guests: guests || [], weddingId: wedding.id });
}

// POST /api/guests - Create, update, delete, or bulk import guests
export async function action({ request }: ActionFunctionArgs) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // Get wedding ID
  const { data: wedding } = await getWeddingByUserId(supabase, user.id);
  if (!wedding) {
    throw new Response("No wedding found", { status: 404 });
  }

  switch (intent) {
    case "create": {
      const guestData = JSON.parse(formData.get("guest") as string);
      const { data, error } = await createGuest(supabase, {
        wedding_id: wedding.id,
        ...guestData,
      });

      if (error) {
        throw new Response(error.message, { status: 500 });
      }

      return Response.json({ success: true, guest: data });
    }

    case "update": {
      const id = formData.get("id") as string;
      const updates = JSON.parse(formData.get("updates") as string);
      const { data, error } = await updateGuest(supabase, id, updates);

      if (error) {
        throw new Response(error.message, { status: 500 });
      }

      return Response.json({ success: true, guest: data });
    }

    case "delete": {
      const id = formData.get("id") as string;
      const { error } = await deleteGuest(supabase, id);

      if (error) {
        throw new Response(error.message, { status: 500 });
      }

      return Response.json({ success: true });
    }

    case "bulk-import": {
      const guests = JSON.parse(formData.get("guests") as string);
      const { data, error } = await bulkCreateGuests(supabase, guests.map((g: any) => ({
        wedding_id: wedding.id,
        ...g,
      })));

      if (error) {
        throw new Response(error.message, { status: 500 });
      }

      return Response.json({ success: true, guests: data });
    }

    default:
      throw new Response("Invalid intent", { status: 400 });
  }
}
