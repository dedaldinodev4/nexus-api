import { db } from "../database/db.js";
import { tokenHash } from "../utils/auth.js";

export function authenticate (req) {
  const raw = req.headers.cookie || "";
  const match = raw.match(/(?:^|;\s*)sid=([^;]+)/);
  if (!match) return null;
  const session = db.prepare(`
    SELECT u.id,u.name,u.email,u.role,s.expires_at
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>?
  `).get(tokenHash(match[1]), new Date().toISOString());
  return session || null;
}
