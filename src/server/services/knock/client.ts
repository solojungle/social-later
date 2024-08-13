import { Knock } from "@knocklabs/node";

import { env } from "@/env.mjs";

export const knock = new Knock(env.SECRET_KNOCK_KEY);
