import { badRequest, AppError } from "./errors.js";

export function json(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...headers
  });
  res.end(body);
}

export function empty(res, status = 204, headers = {}) {
  res.writeHead(status, headers);
  res.end();
}

export async function readBody(req, limit) {
  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > limit) throw new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new AppError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
    chunks.push(chunk);
  }
  if (!size) return null;
  return Buffer.concat(chunks).toString("utf8");
}

export async function readJson(req, limit) {
  const raw = await readBody(req, limit);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw badRequest("Invalid JSON");
  }
}

export function sendError(res, error) {
  const status = error instanceof AppError ? error.status : 500;
  json(res, status, {
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: status === 500 ? "Internal server error" : error.message,
      ...(error.details ? { details: error.details } : {})
    }
  });
}
