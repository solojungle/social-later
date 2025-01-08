import OpenAI from "openai";

import { env } from "@/env.mjs";

export const client = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});
