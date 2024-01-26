import { db } from "@/lib/db/database";
import { getBaseUrl } from "@/lib/helpers";
import type { Product } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import type { ProPlan } from "@prisma/client";

export type Metadata = {
  plan: ProPlan;
  userId: string;
};

export async function getOrCreateStripeCustomerId(
  userId: string,
  email: string | undefined
) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let stripeCustomerId: string | null = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
    });
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
    stripeCustomerId = customer.id;
  }

  return stripeCustomerId;
}

export async function createCheckoutSession(
  product: Product,
  stripeCustomerId: string,
  metadata?: Metadata
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    success_url: getBaseUrl() + "/success",
    cancel_url: getBaseUrl() + "/cancel",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: {
            name: product.name,
            description: product.description,
            images: ["https://icodethis.com/logo.png"],
          },
        },
        quantity: 1,
      },
    ],
    metadata,
    allow_promotion_codes: true,
    // automatic_tax: {
    //   enabled: true,
    // },
    // invoice_creation: {
    //   enabled: true,
    // },
  });

  return session;
}

export async function processPayment({
  userId,
  plan,
  amount,
}: {
  userId: string;
  plan: ProPlan;
  amount: number;
}) {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      proTier: plan,
    },
  });
}
