import { client } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";

function createCheckoutSession(id: string): Promise<{ url: string }> {
  return ky.post("/api/payment", { json: { id } }).json();
}

export function useCheckoutMutation() {
  return useMutation(
    {
      mutationKey: ["checkout"],
      mutationFn: (id: string) => createCheckoutSession(id),
    },
    client
  );
}
