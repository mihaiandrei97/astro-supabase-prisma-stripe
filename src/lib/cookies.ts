import type { AstroCookies } from "astro";

export function createAuthCookies(input: {
  cookies: AstroCookies;
  accessToken: string;
  refreshToken: string;
}) {
  const { cookies, accessToken, refreshToken } = input;

  cookies.set("sb-access-token", accessToken, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  });
  cookies.set("sb-refresh-token", refreshToken, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  });
}

export function deleteAuthCookies(input: {
  cookies: AstroCookies;
}) {
  const { cookies } = input;

  cookies.delete("sb-access-token", {
    path: "/",
  });
  cookies.delete("sb-refresh-token", {
    path: "/",
  });
}
