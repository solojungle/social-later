import { env } from "@/env.mjs";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function seedStripeProducts() {
  // Fetch all products from Stripe
  const products = await stripe.products.list();

  // Fetch prices for all products concurrently
  const productPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({ product: product.id });
      return { price: prices.data[0], product };
    }),
  );

  // Process all products concurrently
  await Promise.all(
    productPrices.map(async ({ price, product }) => {
      if (price) {
        await prisma.stripeProduct.upsert({
          create: {
            currency: price.currency,
            image: product.images[0] || "",
            name: product.name,
            price: price.unit_amount || 0,
            priceFormatted: formatPrice(price.unit_amount, price.currency),
            stripePriceId: price.id,
            stripeProductId: product.id,
          },
          update: {
            currency: price.currency,
            image: product.images[0] || "",
            name: product.name,
            price: price.unit_amount || 0,
            priceFormatted: formatPrice(price.unit_amount, price.currency),
            stripePriceId: price.id,
          },
          where: { stripeProductId: product.id },
        });
      }
    }),
  );

  const count = await prisma.stripeProduct.count();
  console.log(`There are ${count} products in the database.`);
}

function formatPrice(amount: null | number, currency: string): string {
  if (amount === null) return "";
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount / 100);
}
