import { env } from "@/env.mjs";
import { Knock } from "@knocklabs/node";

export const knock = new Knock(env.SECRET_KNOCK_KEY);
