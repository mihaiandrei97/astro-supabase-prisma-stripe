import { products } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import { processPayment, type Metadata } from "@/server/payment/payment.service";
import type { APIRoute } from "astro";
import type Stripe from "stripe";


export const POST: APIRoute = async ({ request, locals }) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const stripeSigningSecret = import.meta.env.STRIPE_SIGNING_SECRET as string;
  try {
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      stripeSigningSecret
    );

    const completedEvent = event.data.object as Stripe.Checkout.Session & {
      metadata: Metadata;
    };

    if (event.type === "checkout.session.completed") {
      if (completedEvent.mode === "payment") {
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          completedEvent.id,
          {
            expand: ["line_items"],
          }
        );
        if (!sessionWithLineItems.line_items) {
          throw new Error("No line items found");
        }
        await processPayment({
          userId: completedEvent.metadata.userId,
          plan: completedEvent.metadata.plan,
          amount: sessionWithLineItems.line_items.data[0].amount_total,
        })
      }
    }
    return new Response(JSON.stringify({ success: true, error: null }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: false,
        error: (err as { message: string }).message,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
