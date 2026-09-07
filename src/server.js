import { createServer } from 'node:http'
import { config } from './config/index.js'
import { createApp } from './core/app.js'
import { requestId, securityHeaders, rateLimit } from "./core/middleware.js";
import { authenticate } from "./middlewares/auth.js";
import { buildRoutes } from "./routes.js";
import { Router } from './core/router/index.js';
import { db, migrate } from "./database/db.js";

migrate();

const router = new Router();
buildRoutes(router, config);

// const authMiddleware = async ({ req, state }, next) => {
//   state.user = authenticate(req);
//   return next();
// }

const app = createApp ({
  router,
  middlewares: []
});

const server = createServer (app);

server.listen(config.port, config.host, () => {
  console.log(`Nexus API listening on http://${config.host}:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal}: shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));