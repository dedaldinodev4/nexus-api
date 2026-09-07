import { randomUUID } from "node:crypto";
import { requestContext, logger } from "./logger";
import { json, sendError } from "./http";
import { notFound } from "./errors";


export function createApp({ router, middlewares = [] }) {
  return async function handler(req, res) {
    const requestId = randomUUID();
    const started = performance.now();

    requestContext.run({ requestId }, async () => {
      try {
        let index = -1;
        const context = {
          req, res, requestId,
          state: {},
          params: {},
          query: new URL(req.url, "http://localhost").searchParams
        };

        const dispatch = async (i) => {
          if (i <= index) throw new Error("next() called multiple times");
          index = i;
          const middleware = middlewares[i];
          if (middleware) return middleware(context, () => dispatch(i + 1));
          const url = new URL(req.url, "http://localhost");
          const route = router.match(req.method, url.pathname);
          if (!route) throw notFound("Route not found");
          context.params = route.params;
          for (const fn of route.handlers) await fn(context, async () => { });
        };

        await dispatch(0);
        if (!res.writableEnded) json(res, 204, {});
      } catch (error) {
        logger.error("request.failed", { error: error.message, stack: error.stack });
        if (!res.headersSent) sendError(res, error);
        else res.destroy();
      } finally {
        logger.info("request.completed", {
          method: req.method,
          path: req.url,
          status: res.statusCode,
          durationMs: Math.round(performance.now() - started)
        });
      }
    });
  };
}
