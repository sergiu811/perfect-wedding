import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import type { Database } from '~/types/database.types'

export function createSupabaseServerClient(request: Request) {
  const headers = new Headers()

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
          )
        },
      },
    }
  )

  return { supabase, headers }
}

export async function requireAuth(request: Request) {
  const { supabase } = createSupabaseServerClient(request)
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  return user
}

export async function requireVendor(request: Request) {
  const user = await requireAuth(request)
  const { supabase } = createSupabaseServerClient(request)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'vendor') {
    throw new Response('Forbidden - Vendor access required', { status: 403 })
  }

  return user
}

export async function getSession(request: Request) {
  const { supabase } = createSupabaseServerClient(request)
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}
