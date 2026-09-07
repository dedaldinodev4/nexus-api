import { config } from "./config/index.js";
import { db, migrate } from "./database/db.js";
import { server  } from "./server.js";

migrate();

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