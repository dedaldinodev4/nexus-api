
import test, { it, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { UserRepository } from '../../users.repository.js'
import { AuthRepository } from '../../../auth/auth.repository.js'
import { hashPassword } from "../../../../utils/auth.js";


describe("UserRepository", () => {
  let repository; 
  let authRepository;

  beforeEach(() => {
    repository = new UserRepository();
    authRepository = new AuthRepository();
  });

  it("UserRepository.findMany - should return all users", async (t) => {
    const users = await repository.findMany({
      limit: 10,
      offset: 10
    });
  
    assert.ok(Array.isArray(users));
    assert.ok(users.length <= 10);
  });

  it("UserRepository.count - should count users", async () => {
    const total = await repository.count();
  
    assert.strictEqual(typeof total, "number");
    assert.ok(total >= 0);
  });

  test("UserRepository.update - should update user", async () => {
    const data = {
      name: "Dedaldino",
      email: "dedaldino4dev@gmail.com",
      password: 'role@123!'
    }
    const { email, name } = data;
    const { salt, hash } = await hashPassword(data.password);
    const user = await authRepository.create({
      name,
      email,
      hash,
      salt
    });
  
    const userUpdated = await repository.update(
      user.id,
      {
        name: "Daniel"
      }
    );
  
    assert.strictEqual(userUpdated.id, user.id);
    assert.strictEqual(userUpdated.name, "Daniel");
  });

  test("UserRepository.delete - should delete an user", async () => {
    const data = {
      name: "John",
      email: "delete@text.com",
      password: 'role@123!'
    }
    const { email, name } = data;
    const { salt, hash } = await hashPassword(data.password);
    const userCreated = await authRepository.create({
      name,
      email,
      hash,
      salt
    });
  
    await repository.delete(userCreated.id);
  
    const user = await repository.findById(userCreated.id);
  
    assert.strictEqual(user, undefined);
  });

 

});
