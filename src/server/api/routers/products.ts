import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.stripeProduct.findMany();
  }),
});
