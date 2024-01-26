import { products } from "@/lib/products";
import { createCheckoutSession, getOrCreateStripeCustomerId, type Metadata } from "@/server/payment/payment.service";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  const { user } = locals;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const body = await request.json();
  const { proTier } = body;
  if (!proTier && typeof proTier !== "string") {
    return new Response(JSON.stringify({ error: "Invalid product id" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const product = products.find((product) => product.proTier === proTier);
  if (!product) {
    return new Response(
      JSON.stringify({ message: `Product not found with proTier: ${proTier}` }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const stripeCustomerId = await getOrCreateStripeCustomerId(
    user.id,
    user.email
  );

  const metadata: Metadata = {
    proTier,
    userId: user.id,
  }

  const session = await createCheckoutSession(product, stripeCustomerId, metadata);
  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
