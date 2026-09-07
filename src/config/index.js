import process from "node:process";

function convertNumber (name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

export const config = Object.freeze({
  host: process.env.HOST || "127.0.0.1",
  port: convertNumber("PORT", 3000),
  databaseFile: process.env.DATABASE_FILE || "./data/nexus.sqlite",
  sessionTtlMs: convertNumber("SESSION_TTL_MS", 7 * 24 * 60 * 60 * 1000),
  rateWindowMs: convertNumber("RATE_LIMIT_WINDOW_MS", 60_000),
  rateMax: convertNumber("RATE_LIMIT_MAX", 100),
  bodyLimit: convertNumber("BODY_LIMIT_BYTES", 1024 * 1024),
  logLevel: process.env.LOG_LEVEL || "info"
});
