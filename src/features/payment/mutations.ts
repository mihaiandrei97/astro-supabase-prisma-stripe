import { client } from "@/lib/query";
import type { ProTier } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./api";


export function useCheckoutMutation(proTier: ProTier) {
  return useMutation(
    {
      mutationKey: ["checkout", proTier],
      mutationFn: (proTier: ProTier) => createCheckoutSession(proTier),
    },
    client
  );
}