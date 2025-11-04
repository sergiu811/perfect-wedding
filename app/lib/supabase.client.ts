import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/database.types'

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient<Database>(
    window.ENV.SUPABASE_URL,
    window.ENV.SUPABASE_ANON_KEY
  )

  return supabaseClient
}

// Type-safe helper for client-side auth
export function useSupabase() {
  return getSupabaseBrowserClient()
}
