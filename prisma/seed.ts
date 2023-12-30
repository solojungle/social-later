import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.stripeProduct.upsert({
	where: { stripeProductId: "prod_PCnMyMnkzFFKHT" },
	update: {},
	create: {
		name: "Testing Standard",
		image: "/images/standardplan.png",
		price: 9999,
		priceFormatted: "$99.99",
		currency: "USD",
		stripeProductId: "prod_PCnMyMnkzFFKHT",
		stripePriceId: "price_1OONm6BvZcw5DSHU5b2quhbl",
	},
});

await prisma.stripeProduct.upsert({
	where: { stripeProductId: "prod_PCnNxJnj9ZI4ly" },
	update: {},
	create: {
		name: "Testing Agency",
		image: "/images/agencyplan.png",
		price: 24999,
		priceFormatted: "$249.99",
		currency: "USD",
		stripeProductId: "prod_PCnNxJnj9ZI4ly",
		stripePriceId: "price_1OONmPBvZcw5DSHUrC0hdilA",
	},
});

const count = await prisma.stripeProduct.count();
console.log(`There are ${count} products in the database.`);
