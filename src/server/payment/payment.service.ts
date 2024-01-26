import { db } from "@/lib/db/database";
import { getBaseUrl } from "@/lib/helpers";
import type { Product } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import type { PrismaPromise, ProTier } from "@prisma/client";

export type Metadata = {
  proTier: ProTier;
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

export function updateProTierUser({
  userId,
  proTier,
}: {
  userId: string;
  proTier: ProTier;
}) {
  return db.user.update({
    where: {
      id: userId,
    },
    data: {
      proTier,
    },
  });
}

export function addPurchase({
  userId,
  proTier,
  amount,
}: {
  userId: string;
  proTier: ProTier;
  amount: number;
}) {
  return db.purchase.create({
    data: {
      userId,
      amount,
      type: `proTier-${proTier}`,
    },
  });
}

export async function processPayment({
  userId,
  proTier,
  amount,
}: {
  userId: string;
  proTier: ProTier;
  amount: number;
}) {
  const transactions = [
    updateProTierUser({ userId, proTier }),
    addPurchase({ userId, proTier, amount }),
  ];
  const result = await db.$transaction(transactions);
  return result;
}

export async function getSales(){
  const purchases = await db.purchase.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select:{
      id: true,
      amount: true,
      createdAt: true,
      type: true,
      user: {
        select: {
          id: true,
        }
      }
    }
  });
  return purchases;
}