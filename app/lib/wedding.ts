import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

type Wedding = Database["public"]["Tables"]["weddings"]["Row"];
type WeddingInsert = Database["public"]["Tables"]["weddings"]["Insert"];
type WeddingUpdate = Database["public"]["Tables"]["weddings"]["Update"];

export async function createWedding(
  supabase: SupabaseClient<Database>,
  userId: string,
  weddingData: Omit<WeddingInsert, "user_id">
) {
  const insertData: WeddingInsert = {
    user_id: userId,
    ...weddingData,
  };

  const { data, error } = await supabase
    .from("weddings")
    // @ts-ignore - Supabase type inference issue, works correctly at runtime
    .insert(insertData)
    .select()
    .single();

  return { data, error };
}

export async function getWeddingByUserId(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export async function updateWedding(
  supabase: SupabaseClient<Database>,
  weddingId: string,
  updates: WeddingUpdate
) {
  const { data, error } = await supabase
    .from("weddings")
    // @ts-ignore - Supabase type inference issue, works correctly at runtime
    .update(updates)
    .eq("id", weddingId)
    .select()
    .single();

  return { data, error };
}

export async function deleteWedding(
  supabase: SupabaseClient<Database>,
  weddingId: string
) {
  const { error } = await supabase
    .from("weddings")
    .delete()
    .eq("id", weddingId);

  return { error };
}
