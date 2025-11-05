import { createServerClient } from "@supabase/ssr";
import type { Database } from "~/types/database.types";

/**
 * Creates a Supabase client for server-side environments.
 * Compatible with @supabase/ssr v0.7.0+
 */
export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookieHeader = request.headers.get("Cookie") ?? "";
          const cookies = Object.fromEntries(
            cookieHeader
              .split(";")
              .map((cookie) => cookie.trim().split("="))
              .filter(([key]) => key)
          );
          return cookies[name];
        },
        set(name, value, options) {
          const cookieString = [
            `${name}=${value}`,
            `Path=${options?.path ?? "/"}`,
            options?.maxAge ? `Max-Age=${options.maxAge}` : "",
            options?.domain ? `Domain=${options.domain}` : "",
            options?.secure ? "Secure" : "",
            options?.httpOnly ? "HttpOnly" : "",
            `SameSite=${options?.sameSite ?? "Lax"}`,
          ]
            .filter(Boolean)
            .join("; ");

          headers.append("Set-Cookie", cookieString);
        },
        remove(name, options) {
          const cookieString = [
            `${name}=`,
            `Path=${options?.path ?? "/"}`,
            "Max-Age=0",
            options?.domain ? `Domain=${options.domain}` : "",
            `SameSite=${options?.sameSite ?? "Lax"}`,
          ]
            .filter(Boolean)
            .join("; ");

          headers.append("Set-Cookie", cookieString);
        },
      },
    }
  );

  return { supabase, headers };
}

/**
 * Ensures the user is authenticated; throws 401 if not.
 */
export async function requireAuth(request: Request) {
  const { supabase } = createSupabaseServerClient(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return user;
}

/**
 * Ensures the user is a vendor; throws 403 otherwise.
 */
export async function requireVendor(request: Request) {
  const user = await requireAuth(request);
  const { supabase } = createSupabaseServerClient(request);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "vendor") {
    throw new Response("Forbidden - Vendor access required", { status: 403 });
  }

  return user;
}

/**
 * Returns the current session from Supabase Auth.
 */
export async function getSession(request: Request) {
  const { supabase } = createSupabaseServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
