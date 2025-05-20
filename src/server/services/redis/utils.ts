import { cache as redis } from "./client";

const PREFIX = process.env.REDIS_PREFIX || "app:"; // Default prefix if not set

export const kv = {
  del: (key: string) => {
    return redis.del(`${PREFIX}${key}`);
  },
  get: (key: string) => {
    return redis.get(`${PREFIX}${key}`);
  },
  getByPattern: async (pattern: string) => {
    try {
      // Get all matching keys with pagination (handle large datasets)
      let cursor = 0;
      let allKeys: string[] = [];

      // Collect all keys first without awaiting in the loop
      do {
        /**
         * In this specific case, you're using Redis SCAN, which must be sequential
         * as the cursor returned in one iteration is needed for the next.
         * So, awaiting inside the loop is intentional and correct.
         */
        // eslint-disable-next-line no-await-in-loop
        const { cursor: nextCursor, keys } = await kv.scan(pattern, cursor);
        allKeys = allKeys.concat(keys);
        cursor = parseInt(nextCursor as string, 10);
      } while (cursor !== 0);

      if (allKeys.length === 0) {
        return [];
      }

      // Efficiently fetch values in parallel with proper error handling
      const results = await Promise.all(
        allKeys.map(async (key) => {
          try {
            // Extract the key without prefix for retrieval
            const keyWithoutPrefix = key.replace(PREFIX, "");
            const value = await kv.get(keyWithoutPrefix);

            // Try to parse JSON if the value is a JSON string
            if (typeof value === "string") {
              try {
                return JSON.parse(value);
              } catch {
                // If not valid JSON, return as is
                return value;
              }
            }

            return value;
          } catch (error) {
            // console.error(`Error fetching key ${key}:`, error);
            return null;
          }
        }),
      );

      // Filter out any null values from failed retrievals
      return results.filter(Boolean);
    } catch (error) {
      // console.error("Error in getByPattern:", error);
      return [];
    }
  },
  increment: (key: string) => {
    return redis.incr(`${PREFIX}${key}`);
  },
  keys: () => {
    return redis.keys(`${PREFIX}*`);
  },
  scan: (pattern: string, cursor = 0) => {
    const patternWithPrefix = `${PREFIX}${pattern}`;
    return redis.scan(cursor.toString(), { MATCH: patternWithPrefix });
  },
  set: (key: string, value: string) => {
    return redis.set(`${PREFIX}${key}`, value);
  },
};
