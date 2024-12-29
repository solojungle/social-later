import {
	createTRPCProxyClient,
	loggerLink,
	unstable_httpBatchStreamLink,
} from "@trpc/client";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

import { type AppRouter } from "@/server/api/root";

import { getUrl, transformer } from "./shared";

export const api = createTRPCProxyClient<AppRouter>({
	transformer,
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error),
		}),
		unstable_httpBatchStreamLink({
			url: getUrl(),
			headers() {
				return {
					cookie: (cookies() as unknown as UnsafeUnwrappedCookies).toString(),
					"x-trpc-source": "rsc",
				};
			},
		}),
	],
});
