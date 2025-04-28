import { $Enums, FileType } from "@prisma/client";
import { z } from "zod";

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "video/quicktime",
  "image/gif",
  "image/png",
  "image/webp",
];

// const MAX_IMAGE_SIZE = 4; // In MegaBytes
// const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
// 	const result = sizeInBytes / (1024 * 1024);
// 	return +result.toFixed(decimalsNum);
// };

// Use for prisma creation
export const CreateFileSchema = z.object({
  extension: z.string(),
  height: z.number().optional(),
  key: z.string(),
  mime: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.nativeEnum(FileType),
  width: z.number().optional(),
});

// Use for forms
export const SingleFileSchema = z
  .any()
  .refine((file) => file?.length === 1, "File is required.")
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type as string),
    "File type is not supported.",
  )
  .refine((file) => file?.[0]?.size ?? 0 <= 3000000, `Max file size is 3MB.`);

export type Asset = {
  createdAt: Date;
  extension: string;
  height: null | number;
  id: string;
  key: string;
  mime: string;
  name: string;
  size: number;
  thumbnail: string;
  type: $Enums.FileType;
  updatedAt: Date;
  url: string;
  width: null | number;
};

export type SingleFileValues = z.infer<typeof SingleFileSchema>;

export function DynamicSizeFileSchema(size: number, acceptedTypes: string[]) {
  // Convert size to mb
  const mb = size / (1024 * 1024);

  return z
    .any()
    .refine((file) => file?.length === 1, "File is required.")
    .refine(
      (file) => acceptedTypes.includes(file?.[0]?.type as string),
      "File type is not supported.",
    )
    .refine(
      (file) => file?.[0]?.size ?? size >= 0,
      `Max file size is ${mb}MB.`,
    );
}
