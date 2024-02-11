import { client } from "@/lib/query";
import type { ProTier } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

function createCheckoutSession(proTier: ProTier): Promise<{ url: string }> {
  return ky.post("/api/payment", { json: { proTier } }).json();
}

export function useCheckoutMutation(proTier: ProTier) {
  return useMutation(
    {
      mutationKey: ["checkout", proTier],
      mutationFn: (proTier: ProTier) => createCheckoutSession(proTier),
    },
    client
  );
}