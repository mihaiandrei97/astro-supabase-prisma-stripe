import { client } from "@/lib/query";
import type { ProPlan } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

function createCheckoutSession(plan: ProPlan): Promise<{ url: string }> {
  return ky.post("/api/payment", { json: { plan } }).json();
}

export function useCheckoutMutation() {
  return useMutation(
    {
      mutationKey: ["checkout"],
      mutationFn: (plan: ProPlan) => createCheckoutSession(plan),
    },
    client
  );
}
