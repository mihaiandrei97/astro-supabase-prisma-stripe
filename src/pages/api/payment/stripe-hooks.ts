import { products } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import type { APIRoute } from "astro";
import type Stripe from "stripe";

type Metadata = {
  userId: string;
};

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
  // const body = await ;
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
        console.log({ boughtItem: sessionWithLineItems.line_items.data[0] });
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
