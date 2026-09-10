import test, { it, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { userRepositoryMock } from "../__mocks__/users.repository.js";
import { UserService } from "../../users.service.js";


describe("UserService", () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = userRepositoryMock();
    service = new UserService(repository);
  });

  it("should return all users", async () => {

    repository.findMany = async ({ limit, offset }) => {
      assert.strictEqual(limit, 10);
      assert.strictEqual(offset, 10);

      return [
        {
          id: '1',
          name: "Dedaldino",
          email: "dedaldinodev4@gmail.com"
        },
        {
          id: '2',
          name: "Daniel",
          email: "danielmjs@gmail.com"
        }
      ];
    };

    repository.count = async () => 25;

    const result = await service.getAllUsers({ page: 2, limit: 10 });

    assert.deepStrictEqual(result, {
      data: [
        {
          id: '1',
          name: "Dedaldino",
          email: "dedaldinodev4@gmail.com"
        },
        {
          id: '2',
          name: "Daniel",
          email: "danielmjs@gmail.com"
        }
      ],
      pagination: {
        page: 2,
        perPage: 10,
        total: 25,
        totalPages: 3
      }
    });
  });

  it("should use default pagination", async () => {

    repository.findMany = async ({ limit, offset }) => {
      assert.strictEqual(limit, 10);
      assert.strictEqual(offset, 0);

      return [];
    };

    repository.count = async () => 0;

    const result = await service.getAllUsers({});


    assert.deepStrictEqual(result.pagination, {
      page: 1,
      perPage: 10,
      total: 0,
      totalPages: 0
    });
  });

  it("should return user by id", async () => {
    repository.findById = async (id) => ({
      id,
      name: "Dedaldino",
      email: "dedaldinodev4@gmail.com"
    });

    const result = await service.getById("123");

    assert.deepEqual(result, {
      id: "123",
      name: "Dedaldino",
      email: "dedaldinodev4@gmail.com"
    });
  });

  it("should throw 404 when user does not exist", async () => {
    repository.findById = async () => null;

    await assert.rejects(
      () => service.getById("unknown"),
      {
        code: 'NOT_FOUND',
        message: 'User not found.',
        name: 'AppError'
      }
    );
  });

});