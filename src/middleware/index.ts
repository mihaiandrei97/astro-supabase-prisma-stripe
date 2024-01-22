import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/lib/supabase";
import { createAuthCookies, deleteAuthCookies } from "@/lib/cookies";
import { getOrCreateUserForSession } from "@/server/user/user.service";

const PATHS_TO_IGNORE = ["/ignore"];

export const onRequest = defineMiddleware(async ({ locals, cookies, url }, next) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  if (!accessToken || !refreshToken) {
    return next();
  }

  if (PATHS_TO_IGNORE.includes(url.pathname)) {
    return next();
  }

  const { data, error } = await supabase.auth.setSession({
    refresh_token: refreshToken.value,
    access_token: accessToken.value,
  });

  if (error) {
    deleteAuthCookies({ cookies });
    return next();
  }

  if (!data.session) {
    return next();
  }

  const isSameAccessToken = accessToken.value === data.session.access_token;
  const isSameRefreshToken = refreshToken.value === data.session.refresh_token;

  if (!isSameAccessToken || !isSameRefreshToken) {
    createAuthCookies({
      cookies,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  }

  if (data.user) {
    const user = await getOrCreateUserForSession(data.user.id);
    locals.user = {...user, email: data.user.email};
  }
  return next();
});
