import { FileType, Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createAttachments } from "./utils/attachments";
import { deleteS3Object, getS3ThumbnailUrl, getS3Url } from "./utils/aws";

// Define supported file types and sort fields
const FileTypeFilter = z.enum(["image", "video", "all"]);
const SortField = z.enum(["name", "size", "createdAt"]);
const SortOrder = z.enum(["asc", "desc"]);

export const attachmentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.array(
        z.object({
          fileId: z.string(),
          postId: z.string().optional(),
          teamId: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      return createAttachments(input);
    }),

  delete: protectedProcedure
    .input(z.object({ attachmentIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // We find the attachments based on their fileIds
      const attachments = await ctx.db.attachment.findMany({
        include: {
          file: true,
        },
        where: {
          fileId: {
            in: input.attachmentIds,
          },
        },
      });

      if (!attachments || attachments.length === 0) {
        throw new Error("Attachments not found");
      }

      // Remove any attachments with postIds that are not null
      const attachmentsWithoutPosts = attachments.filter(
        (a) => a.postId === null,
      );

      if (attachmentsWithoutPosts.length !== attachments.length) {
        throw new Error("Cannot delete attachments that are attached to posts");
      }

      // Filter out duplicate files
      const uniqueAttachments = attachmentsWithoutPosts.filter(
        (value, index, self) =>
          self.findIndex((t) => t.file.key === value.file.key) === index,
      );

      const deletePromises = uniqueAttachments.map(async (a) =>
        deleteS3Object(a.file.key),
      );

      await Promise.allSettled(deletePromises);

      const deletedFiles = await ctx.db.file.deleteMany({
        where: {
          id: {
            in: uniqueAttachments.map((a) => a.fileId),
          },
        },
      });

      return deletedFiles;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        fileType: FileTypeFilter.optional(),
        page: z.number().min(1).default(1),
        searchQuery: z.string().optional(),
        sortBy: SortField.optional().default("createdAt"),
        sortOrder: SortOrder.optional().default("desc"),
        teamId: z.string(),
        // pageSize: z.number().min(8).max(100).default(8),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        fileType,
        page,
        searchQuery,
        sortBy,
        sortOrder,
        teamId,
        // pageSize,
      } = input;

      // Lets hardcode the pageSize for now, we can add it back later if needed
      const pageSize = 8;

      const skip = Math.max(0, (page - 1) * pageSize);

      // Build where conditions
      const whereConditions: Prisma.AttachmentWhereInput = {
        file: {
          AND: [
            // Search condition
            searchQuery
              ? {
                  OR: [
                    { name: { contains: searchQuery, mode: "insensitive" } },
                  ],
                }
              : {},
            // File type filter
            fileType && fileType !== "all"
              ? {
                  type: fileType as FileType,
                }
              : {},
          ],
        },
        teamId,
      };

      // Prisma does not support distinct with count.
      const totalCount = await ctx.db.attachment
        .groupBy({
          by: ["fileId"],
          where: whereConditions,
        })
        .then((groups) => groups.length);

      const totalPages = Math.ceil(totalCount / pageSize);

      // Build sort object
      const orderBy: Prisma.AttachmentOrderByWithRelationInput = (() => {
        switch (sortBy) {
          case "name":
            return { file: { name: sortOrder } };
          case "size":
            return { file: { size: sortOrder } };
          case "createdAt":
          default:
            return { createdAt: sortOrder };
        }
      })();

      // Fetch attachments
      const attachments = await ctx.db.attachment.findMany({
        distinct: ["fileId"],
        include: {
          file: true,
        },
        orderBy,
        skip,
        take: pageSize,
        where: whereConditions,
      });

      const attachmentsWithUrls = attachments.map((attachment) => {
        if (attachment?.file) {
          const { extension, key, type } = attachment.file;
          const baseUrl = getS3Url(key);
          const thumbnailBaseUrl = getS3ThumbnailUrl(key);

          return {
            ...attachment,
            thumbnail:
              type === "video"
                ? `${thumbnailBaseUrl}.jpg`
                : `${thumbnailBaseUrl}.${extension}`,
            url: `${baseUrl}.${extension}`,
          };
        }
        return {
          ...attachment,
          thumbnail: "",
          url: "",
        };
      });

      const files = attachmentsWithUrls.map((a) => {
        return {
          ...a.file,
          thumbnail: a.thumbnail,
          url: a.url,
        };
      });

      return {
        items: files,
        pagination: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 0,
          items: totalCount,
          page,
          pages: totalPages,
        },
      };
    }),
});
