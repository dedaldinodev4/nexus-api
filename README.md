# Nexus API — Native Node.js

A production-oriented REST API built with **Node.js + JavaScript only**.
No Express, Fastify, NestJS, ORM, validation framework, logger framework,
authentication framework, or test framework.

## Requirements

- Node.js 24+
- npm (only used for scripts; there are zero runtime dependencies)

## Run

```bash
cp .env.example .env
npm start
```

Server: http://127.0.0.1:3000

Health:
```bash
curl http://127.0.0.1:3000/health
```

Register:
```bash
curl -i -c cookies.txt \
  -H 'content-type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"StrongPass123!"}' \
  http://127.0.0.1:3000/auth/register
```

Login:
```bash
curl -i -c cookies.txt \
  -H 'content-type: application/json' \
  -d '{"email":"ada@example.com","password":"StrongPass123!"}' \
  http://127.0.0.1:3000/auth/login
```

Create a project:
```bash
curl -b cookies.txt \
  -H 'content-type: application/json' \
  -d '{"name":"Nexus Lab","description":"Native Node project"}' \
  http://127.0.0.1:3000/projects
```

## Architecture

HTTP server → middleware pipeline → router → controller → use case → repository → SQLite.

The `core` folder contains reusable technical primitives. The `modules` folder
contains business capabilities.

## Learning goals

1. Build an HTTP server from `node:http`.
2. Implement route matching and path parameters.
3. Implement middleware composition.
4. Use `AsyncLocalStorage` for request context.
5. Hash passwords with `crypto.scrypt`.
6. Manage secure sessions.
7. Use native SQLite with prepared statements and transactions.
8. Implement RBAC.
9. Add rate limiting, body limits, security headers and request IDs.
10. Add health checks, metrics and graceful shutdown.
11. Test with `node:test`.
12. Benchmark with the Node runtime.

## Deliberate trade-offs

This is a learning-grade production-style implementation, not a replacement
for mature frameworks. The point is to expose the mechanisms frameworks hide.
For a commercial system, use battle-tested libraries where appropriate.
