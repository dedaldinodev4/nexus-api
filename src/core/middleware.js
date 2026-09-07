import { unauthorized } from "./errors";

export function requestId() {
  return async ({ req, res, requestId }, next) => {
    res.setHeader("x-request-id", requestId);
    return next();
  };
}

export function securityHeaders() {
  return async ({ res }, next) => {
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("x-frame-options", "DENY");
    res.setHeader("referrer-policy", "no-referrer");
    res.setHeader("cache-control", "no-store");
    return next();
  };
}

export function rateLimit({ windowMs, max }) {
  const buckets = new Map();
  return async ({ req, res }, next) => {
    const key = req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || now - bucket.started >= windowMs) {
      bucket = { started: now, count: 0 };
      buckets.set(key, bucket);
    }
    bucket.count++;
    res.setHeader("x-ratelimit-limit", max);
    res.setHeader("x-ratelimit-remaining", Math.max(0, max - bucket.count));
    if (bucket.count > max) {
      res.writeHead(429, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: { code: "RATE_LIMITED", message: "Too many requests" } }));
    }
    return next();
  };
}

export function requireAuth() {
  return async ({ state }, next) => {
    if (!state.user) 
      throw unauthorized();
    return next();
  };
}
