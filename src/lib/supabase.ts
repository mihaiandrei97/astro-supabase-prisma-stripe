import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { AstroCookies } from "astro";

const cookieOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

export function createSupabaseServerClient(cookies: AstroCookies) {
  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key: string) {
          return cookies.get(key)?.value;
        },
        set(key: string, value: string, options: CookieOptions) {
          cookies.set(key, value, options);
        },
        remove(key: string, options) {
          cookies.delete(key, options);
        },
      },
      cookieOptions,
    }
  );
  return supabase;
}

