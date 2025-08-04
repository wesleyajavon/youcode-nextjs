import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimitlesson = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1h"), // 5 requests per hour
});

export const ratelimitpresentation = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1h"), // 10 requests per hour
});