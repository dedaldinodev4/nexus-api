import test from "node:test";
import assert from "node:assert/strict";
import { Router } from "../src/core/router/index.js";

test("GET /projects/:id is matched and params.id is extracted", () => {
  const router = new Router();

  router.get("/projects", () => {});
  router.get("/projects/:id", () => {});
  router.get("/projects/:id/tasks", () => {});

  const route = router.match("GET", "/projects/abc123");

  assert.ok(route);
  assert.equal(route.path, "/projects/:id");
  assert.deepEqual(route.params, { id: "abc123" });
});

test("nested dynamic route works", () => {
  const router = new Router();
  router.get("/projects/:id/tasks", () => {});

  const route = router.match("GET", "/projects/project-42/tasks");

  assert.ok(route);
  assert.deepEqual(route.params, { id: "project-42" });
});

test("trailing slash is accepted", () => {
  const router = new Router();
  router.get("/projects/:id", () => {});

  assert.ok(router.match("GET", "/projects/123/"));
});

test("wrong HTTP method does not match", () => {
  const router = new Router();
  router.get("/projects/:id", () => {});

  assert.equal(router.match("POST", "/projects/123"), null);
});

test("allowed methods are available", () => {
  const router = new Router();
  router.get("/projects/:id", () => {});
  router.delete("/projects/:id", () => {});

  assert.deepEqual(
    router.allowedMethods("/projects/123").sort(),
    ["DELETE", "GET"]
  );
});
