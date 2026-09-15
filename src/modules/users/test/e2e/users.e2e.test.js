
import test, { it, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { UserRepository } from '../../users.repository.js'
import { AuthRepository } from '../../../auth/auth.repository.js'
import { hashPassword } from "../../../../utils/auth.js";


describe("User - e2e tests", () => {

  it("GET /users", async () => {
    const response = await fetch(
      "http://127.0.0.1:3333/api/v1/users?page=2&limit=10"
    );
  
    assert.strictEqual(response.status, 200);
  
    const body = await response.json();
  
    assert.ok(Array.isArray(body.data));
    assert.strictEqual(body.pagination.page, 2);
    assert.strictEqual(body.pagination.perPage, 10);
  });

  it("PATCH /users/:id", async () => {
    const response = await fetch(
      "http://127.0.0.1:3333/api/v1/users/user-123",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: "John Updated"
        })
      }
    );
  
    assert.strictEqual(response.status, 201);
    const body = await response.json();
  
    assert.strictEqual(body.id, "user-123");
    assert.strictEqual(body.name, "John Updated");
  });
 

});
