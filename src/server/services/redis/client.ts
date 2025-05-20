import { createClient } from "redis";

export const cache = createClient({
  url: process.env.REDIS_URL,
});

// Open connection to Redis
async function openConnection() {
  await cache.connect();
}

await openConnection();
