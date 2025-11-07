import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

type SeatingChart = Database['public']['Tables']['seating_charts']['Row'];
type SeatingChartInsert = Database['public']['Tables']['seating_charts']['Insert'];
type SeatingChartUpdate = Database['public']['Tables']['seating_charts']['Update'];

export interface TableSeat {
  seatNumber: number;
  guestId?: string;
  guestName?: string;
}

export interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle";
  seats: number;
  assignedSeats: TableSeat[];
  position?: { x: number; y: number };
  color?: string;
  notes?: string;
}

export async function getSeatingChartByWeddingId(
  supabase: SupabaseClient<Database>,
  weddingId: string
) {
  const { data, error } = await supabase
    .from('seating_charts')
    .select('*')
    .eq('wedding_id', weddingId)
    .single();

  return { data, error };
}

export async function createSeatingChart(
  supabase: SupabaseClient<Database>,
  weddingId: string,
  tables: Table[]
) {
  const { data, error } = await supabase
    .from('seating_charts')
    .insert({
      wedding_id: weddingId,
      tables: tables as any,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateSeatingChart(
  supabase: SupabaseClient<Database>,
  seatingChartId: string,
  tables: Table[]
) {
  const { data, error } = await supabase
    .from('seating_charts')
    .update({
      tables: tables as any,
    })
    .eq('id', seatingChartId)
    .select()
    .single();

  return { data, error };
}

export async function upsertSeatingChart(
  supabase: SupabaseClient<Database>,
  weddingId: string,
  tables: Table[]
) {
  const { data, error } = await supabase
    .from('seating_charts')
    .upsert({
      wedding_id: weddingId,
      tables: tables as any,
    }, {
      onConflict: 'wedding_id'
    })
    .select()
    .single();

  return { data, error };
}

export async function deleteSeatingChart(
  supabase: SupabaseClient<Database>,
  seatingChartId: string
) {
  const { error } = await supabase
    .from('seating_charts')
    .delete()
    .eq('id', seatingChartId);

  return { error };
}
