import { seedStripeProducts } from "./stripeProducts";
import { seedSurvey } from "./survey";

await seedStripeProducts().catch(console.error);
await seedSurvey().catch(console.error);
