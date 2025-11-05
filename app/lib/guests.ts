import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

type Guest = Database['public']['Tables']['guests']['Row'];
type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type GuestUpdate = Database['public']['Tables']['guests']['Update'];

export async function createGuest(
  supabase: SupabaseClient<Database>,
  guestData: GuestInsert
) {
  const { data, error } = await supabase
    .from('guests')
    // @ts-ignore - Supabase type inference issue, works correctly at runtime
    .insert(guestData)
    .select()
    .single();

  return { data, error };
}

export async function getGuestsByWeddingId(
  supabase: SupabaseClient<Database>,
  weddingId: string
) {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('name');

  return { data, error };
}

export async function updateGuest(
  supabase: SupabaseClient<Database>,
  guestId: string,
  updates: GuestUpdate
) {
  const { data, error } = await supabase
    .from('guests')
    // @ts-ignore - Supabase type inference issue, works correctly at runtime
    .update(updates)
    .eq('id', guestId)
    .select()
    .single();

  return { data, error };
}

export async function deleteGuest(
  supabase: SupabaseClient<Database>,
  guestId: string
) {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);

  return { error };
}

export async function updateGuestRSVP(
  supabase: SupabaseClient<Database>,
  guestId: string,
  status: 'yes' | 'no' | 'pending'
) {
  return updateGuest(supabase, guestId, { rsvp_status: status });
}

export async function bulkCreateGuests(
  supabase: SupabaseClient<Database>,
  guests: GuestInsert[]
) {
  const { data, error } = await supabase
    .from('guests')
    // @ts-ignore - Supabase type inference issue, works correctly at runtime
    .insert(guests)
    .select();

  return { data, error };
}
