import type { ProTier } from "@prisma/client";
import ky from "ky";

type CheckoutSession = {
  url: string;
};

export function createCheckoutSession(proTier: ProTier) {
  return ky.post("/api/payment", { json: { proTier } }).json<CheckoutSession>();
}