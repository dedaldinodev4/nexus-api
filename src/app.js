import { Router } from "./core/router/index.js";
import { registerRoutes } from "./routes/index.js";
import { createApp } from "./core/app.js";


export function buildApp (middlewares = []) {
  const router = new Router();

  registerRoutes(router);

  const app = createApp ({
    router,
    middlewares
  });

  return app;
}