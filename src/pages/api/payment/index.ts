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
  const { plan } = body;
  if (!plan && typeof plan !== "string") {
    return new Response(JSON.stringify({ error: "Invalid product id" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const product = products.find((product) => product.plan === plan);
  if (!product) {
    return new Response(
      JSON.stringify({ message: `Product not found with plan: ${plan}` }),
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
    plan,
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
