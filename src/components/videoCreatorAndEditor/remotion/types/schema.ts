import { z } from "zod";

import { CompositionProps } from "./constants";

export const RenderRequest = z.object({
  id: z.string(),
  inputProps: CompositionProps,
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      message: string;
      type: "error";
    }
  | {
      progress: number;
      type: "progress";
    }
  | {
      size: number;
      type: "done";
      url: string;
    };
