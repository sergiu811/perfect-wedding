import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/database.types'

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

const SUPABASE_URL="https://wwlilqpyvbknxlnlijrh.supabase.co"
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bGlscXB5dmJrbnhsbmxpanJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTAzOTMsImV4cCI6MjA3NzgyNjM5M30.8yXyhlQX0mZ0PkFmqEWdr5Pc-GJJZJ9fWgQHzvFc6W0"


  supabaseClient = createBrowserClient<Database>(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!
  )

  return supabaseClient
}

// Type-safe helper for client-side auth
export function useSupabase() {
  return getSupabaseBrowserClient()
}
