
import { requestContext, logger } from "./logger.js";
import { sendError } from "./http.js";
import { notFound, AppError } from "./errors/index.js";


export function createApp({ router, middlewares = [] }) {
  return async function handler(req, res) {
    const requestId = requestContext.getStore()?.requestId;
    const started = performance.now();
    const url = new URL(req.url, "http://localhost");

    const context = {
      req,
      res,
      requestId,
      state: {},
      params: {},
      query: url.searchParams,
      url
    };

    try {
      let index = -1;

      async function dispatch(position) {
        if (position <= index) {
          throw new Error("next() called multiple times");
        }

        index = position;

        const middleware = middlewares[position];

        if (middleware) {
          return middleware(context, () => dispatch(position + 1));
        }

        const route = router.match(req.method, url.pathname);

        if (!route) {
          if (router.findPath(url.pathname)) {
            throw new AppError(
              405,
              "METHOD_NOT_ALLOWED",
              `Method ${req.method} is not allowed for ${url.pathname}`,
              { allowedMethods: router.allowedMethods(url.pathname) }
            );
          }

          throw notFound("Route not found");
        }

        context.params = route.params;

        for (const handler of route.handlers) {
          await handler(context);
          if (res.writableEnded) break;
        }
      }

      await dispatch(0);
      // A handler must explicitly complete the response.
      if (!res.writableEnded) {
        throw new AppError(
          500,
          "RESPONSE_NOT_SENT",
          "Route completed without sending a response"
        );
      }
    } catch (error) {
      logger.error("request.failed", {
        error: error.message,
        stack: error.stack
      });

      if (!res.headersSent) {
        sendError(res, error);
      } else {
        res.destroy();
      }
    } finally {
      logger.info("request.completed", {
        method: req.method,
        path: url.pathname,
        status: res.statusCode,
        durationMs: Math.round(performance.now() - started)
      });
    }
  };
}
