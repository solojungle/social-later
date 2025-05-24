import { z } from "zod";

import { CreateFileSchema } from "@/schemas/file-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { getS3ThumbnailUrl, getS3Url } from "./utils/aws";

export const filesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        file: CreateFileSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.create({
        data: {
          ...input.file,
        },
      });

      return {
        ...file,
        thumbnail: `${getS3ThumbnailUrl(file.key)}.${file.extension}`,
        url: `${getS3Url(file.key)}.${file.extension}`,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({
        where: {
          key: input.key,
        },
      });

      if (!file) {
        throw new Error("File not found");
      }

      await ctx.db.file.delete({
        where: {
          key: input.key,
        },
      });

      return file;
    }),

  get: protectedProcedure
    .input(
      z.union([
        z.object({
          key: z.string(),
        }),
        z.object({
          id: z.string(),
        }),
      ]),
    )
    .query(async ({ ctx, input }) => {
      const where = "id" in input ? { id: input.id } : { key: input.key };

      const file = await ctx.db.file.findUnique({
        where,
      });

      if (!file) {
        return null;
      }

      return {
        ...file,
        thumbnail: `${getS3ThumbnailUrl(file.key)}.${file.extension}`,
        url: `${getS3Url(file.key)}.${file.extension}`,
      };
    }),
});
