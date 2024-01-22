import type { APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getBaseUrl } from "@/lib/helpers";
import { createAuthCookies } from "@/lib/cookies";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  if (provider) {
    const baseUrl = getBaseUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${baseUrl}/api/auth/callback`
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;
  createAuthCookies({ cookies, accessToken: access_token, refreshToken: refresh_token })
  return redirect("/");
};