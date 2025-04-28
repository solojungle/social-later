import { z } from "zod";

// Define Zod schema for team
export const TeamSchema = z.object({
  id: z.string(),
  image: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(32, {
      message: "Name must not be longer than 32 characters.",
    }),
  stripeSubscriptionStatus: z.string().optional(),
  url: z
    .string()
    .min(1, {
      message: "URL must be at least 1 character.",
    })
    .max(48, {
      message: "URL must not be longer than 48 characters.",
    }),
});

export type TeamSchemaValues = z.infer<typeof TeamSchema>;

export const teamStoreDefaultValues: TeamSchemaValues = {
  id: "",
  image: "",
  name: "",
  stripeSubscriptionStatus: "",
  url: "",
};

export const TeamCreationSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
  subscription: z.string().min(1, {
    message: "You must pick at least one option.",
  }),
});

export type TeamCreationSchemaValues = z.infer<typeof TeamCreationSchema>;
