import { z } from "zod";

import { PostsSchema } from "@/schemas/posts-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createAttachments } from "./utils/attachments";
import { getS3ThumbnailUrl, getS3Url } from "./utils/aws";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      PostsSchema.omit({
        attachment: true,
        id: true,
        published: true,
        status: true,
      }).extend({
        fileIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileIds, scheduledFor, ...postData } = input;

      // Determine the status and published flag based on scheduledFor
      const status = scheduledFor ? "scheduled" : "published";
      const published = !scheduledFor;

      // Create the post
      const post = await ctx.db.post.create({
        data: {
          ...postData,
          published,
          scheduledFor,
          status,
        },
      });

      // If there are files, create attachments
      if (fileIds && fileIds.length > 0) {
        const files = await ctx.db.file.findMany({
          where: {
            id: {
              in: fileIds,
            },
          },
        });

        if (!files || files.length !== fileIds.length) {
          throw new Error("One or more files do not exist");
        }

        await createAttachments(
          files.map((file) => ({
            fileId: file.id,
            postId: post.id,
            teamId: post.authorId,
          })),
        );
      }

      return post;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        internalPostId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get the post
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.internalPostId,
        },
      });

      if (!post) {
        throw new Error("Post does not exist");
      }

      // Check if the user is part of the team
      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: post.authorId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      // Check if the user is the owner of the team
      const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
      if (!isUserOwnerOfTeam) {
        throw new Error("You are not an owner of this team");
      }

      // Delete the post
      return ctx.db.post.delete({
        where: {
          id: input.internalPostId,
        },
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        internalPostId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the post
      const post = await ctx.db.post.findFirst({
        include: {
          attachment: {
            include: {
              file: true,
            },
          },
        },
        where: {
          id: input.internalPostId,
        },
      });

      if (!post) {
        throw new Error("Post does not exist");
      }

      // Get the file for each attachment
      const attachmentsWithFiles = await Promise.all(
        post.attachment.map(async (attachment) => {
          const file = await ctx.db.file.findFirst({
            where: { id: attachment.fileId },
          });

          if (!file) {
            throw new Error("File does not exist");
          }

          const { extension, key, type } = file;
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
        }),
      );

      return {
        ...post,
        attachment: attachmentsWithFiles,
      };
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get posts and their attachments
      const posts = await ctx.db.post.findMany({
        include: {
          attachment: {
            include: {
              file: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          authorId: input.teamId,
        },
      });

      // Get the file for each attachment
      const postsWithFiles = await Promise.all(
        posts.map(async (post) => {
          const attachments = await ctx.db.attachment.findMany({
            include: { file: true },
            where: { postId: post.id },
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
            return attachment;
          });

          return {
            ...post,
            attachment: attachmentsWithUrls,
          };
        }),
      );

      return postsWithFiles;
    }),

  getFromExternalId: protectedProcedure
    .input(
      z.object({
        externalPostId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the post
      const post = await ctx.db.post.findFirst({
        where: {
          externalPostId: input.externalPostId,
        },
      });

      if (!post) {
        return null;
      }

      return {
        ...post,
      };
    }),

  updateThumbnail: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        thumbnailUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get the post
      const post = await ctx.db.post.findFirst({
        where: {
          id: input.postId,
        },
      });

      if (!post) {
        throw new Error("Post does not exist");
      }

      // Check if the user is part of the team
      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: post.authorId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      // Check if the user is the owner of the team
      const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
      if (!isUserOwnerOfTeam) {
        throw new Error("You are not an owner of this team");
      }

      // Update the post
      return ctx.db.post.update({
        data: {
          thumbnail: input.thumbnailUrl,
        },
        where: {
          id: input.postId,
        },
      });
    }),
});
