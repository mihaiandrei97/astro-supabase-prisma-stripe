import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getOrCreateUserForSession } from "@/server/user/user.service";

const PATHS_TO_IGNORE = ["/ignore"];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url }, next) => {
    if (PATHS_TO_IGNORE.includes(url.pathname)) {
      return next();
    }
    const supabase = createSupabaseServerClient(cookies);

    const { data } = await supabase.auth.getUser();

    if (data.user) {
      // const username = data.session.user.user_metadata.user_name;
      const user = await getOrCreateUserForSession(data.user.id);
      locals.user = { ...user, email: data.user.email };
    }
    return next();
  }
);
