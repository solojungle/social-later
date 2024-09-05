import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

import { env } from "@/env.mjs";

const prisma = new PrismaClient();
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

function formatPrice(amount: number | null, currency: string): string {
	if (amount === null) return "";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
}

export async function seedStripeProducts() {
	// Fetch all products from Stripe
	const products = await stripe.products.list();

	// Fetch prices for all products concurrently
	const productPrices = await Promise.all(
		products.data.map(async (product) => {
			const prices = await stripe.prices.list({ product: product.id });
			return { product, price: prices.data[0] };
		}),
	);

	// Process all products concurrently
	await Promise.all(
		productPrices.map(async ({ product, price }) => {
			if (price) {
				await prisma.stripeProduct.upsert({
					where: { stripeProductId: product.id },
					update: {
						name: product.name,
						image: product.images[0] || "",
						price: price.unit_amount || 0,
						priceFormatted: formatPrice(price.unit_amount, price.currency),
						currency: price.currency,
						stripePriceId: price.id,
					},
					create: {
						name: product.name,
						image: product.images[0] || "",
						price: price.unit_amount || 0,
						priceFormatted: formatPrice(price.unit_amount, price.currency),
						currency: price.currency,
						stripeProductId: product.id,
						stripePriceId: price.id,
					},
				});
			}
		}),
	);

	const count = await prisma.stripeProduct.count();
	console.log(`There are ${count} products in the database.`);
}
