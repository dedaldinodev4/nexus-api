import {
  randomBytes, scrypt as scryptCb,
  createHash, timingSafeEqual
} from "node:crypto";
import { promisify } from "node:util";
import { config } from "./config.js";

const scrypt = promisify(scryptCb);

export async function hashPassword (password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return { 
    salt: salt.toString("hex"), 
    hash: Buffer.from(derived).toString("hex") 
  };
}

export async function verifyPassword(password, saltHex, hashHex) {
  const derived = await scrypt(
    password, 
    Buffer.from(saltHex, "hex"), 64, { N: 16384, r: 8, p: 1 }
  );
  const a = Buffer.from(hashHex, "hex");
  const b = Buffer.from(derived);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function cookie(token) {
  return `sid=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(config.sessionTtlMs / 1000)}`;
}