import { UserSchema } from "@/schemas/user-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.userOnTeam.findMany({
      select: {
        team: {
          select: {
            id: true,
            image: true,
            name: true,
            stripeSubscriptionStatus: true,
            url: true,
          },
        },
      },
      where: { userId: ctx.session.user.id },
    });
    if (!teams) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No teams belong to user with id '${ctx.session.user.id}'`,
      });
    }

    // Remove the "team" key from the response
    // and return only the teams
    return teams.map((team) => team.team);
  }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No user with id '${ctx.session.user.id}'`,
      });
    }

    // We need to convert null values to empty strings because,
    // prisma is the only part of the stack that has null values.
    // and it is preferable to have empty strings in the rest of the stack.
    return {
      ...user,
      email: user.email ?? "",
      emailVerified: user.emailVerified ?? "",
      image: user.image ?? "",
      name: user.name ?? "",
    };
  }),

  updateUser: protectedProcedure
    .input(UserSchema.partial())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        data: input,
        where: { id: ctx.session.user.id },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${ctx.session.user.id}'`,
        });
      }
      return user;
    }),

  updateUserRole: protectedProcedure
    .input(
      z.object({
        role: z.nativeEnum(UserRole),
        teamId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Check if the user is an owner of the team
      const user = await ctx.db.userOnTeam.update({
        data: { role: input.role },
        where: {
          userId_teamId: { teamId: input.teamId, userId: input.userId },
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${input.userId}'`,
        });
      }
      return user;
    }),
});
