import { AsyncLocalStorage } from "node:async_hooks";

export const requestContext = new AsyncLocalStorage();

const levels = { debug: 10, info: 20, warn: 30, error: 40 };
const configured = levels[process.env.LOG_LEVEL] ?? 20;

function log (level, message, extra = {}) {
  if (levels[level] < configured) return;
  const context = requestContext.getStore() || {};
  process.stdout.write(JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    requestId: context.requestId,
    ...extra
  }) + "\n");
}

export const logger = {
  debug: (message, extra) => log("debug", message, extra),
  info: (message, extra) => log("info", message, extra),
  warn: (message, extra) => log("warn", message, extra),
  error: (message, extra) => log("error", message, extra)
};
