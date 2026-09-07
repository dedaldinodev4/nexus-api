import { createServer } from 'node:http'
import { config } from './config'
import { createApp } from './core/app.js'
import { requestId, securityHeaders, rateLimit } from "./core/middleware.js";
import { authenticate } from "./middlewares/auth.js";
import { buildRoutes } from "./routes.js";
import { Router } from './core/router';

const router = new Router();
buildRoutes(router, config);

const authMiddleware = async ({ req, state }, next) => {
  state.user = authenticate(req);
  return next();
}

const app = createApp ({
  router,
  middlewares: [
    requestId(),
    securityHeaders(),
    rateLimit({ windowMs: config.rateWindowMs, max: config.rateMax }),
    authMiddleware
  ]
});

const server = createServer (app);

export { server }