import type { APIRoute } from "astro";
import { deleteAuthCookies } from "@/lib/cookies";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  deleteAuthCookies({ cookies })
  return redirect("/login");
};