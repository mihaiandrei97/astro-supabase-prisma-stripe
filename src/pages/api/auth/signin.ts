import type { APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getBaseUrl } from "@/lib/helpers";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const provider = formData.get("provider")?.toString();
  if (!provider) {
    return new Response("No provider provided", { status: 400 });
  }

  const baseUrl = getBaseUrl();
  const supabase = createSupabaseServerClient(cookies);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options: {
      redirectTo: `${baseUrl}/api/auth/callback`,
    },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect(data.url);
};
