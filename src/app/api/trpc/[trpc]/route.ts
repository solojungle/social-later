import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    createContext: () => createTRPCContext({ req }),
    endpoint: "/api/trpc",
    onError: env.NODE_ENV === "development" ? () => {} : undefined,
    req,
    router: appRouter,
    // T3Stack generated the following code, but because of eslint I've disabled it.
    // onError:
    // 	env.NODE_ENV === "development"
    // 		? ({ path, error }) => {
    // 				// console.error(
    // 				// 	`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
    // 				// );
    // 		  }
    // 		: undefined,
  });

export { handler as GET, handler as POST };
