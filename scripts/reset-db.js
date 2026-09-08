import { rmSync, existsSync } from "node:fs";
import { config } from "../src/config/index.js";
if (existsSync(config.databaseFile)) rmSync(config.databaseFile);
console.log("Database removed:", config.databaseFile);
