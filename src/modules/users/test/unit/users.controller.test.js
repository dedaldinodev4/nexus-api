import test, { it, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { userServiceMock } from "../__mocks__/users.service.js";
import { UserController } from "../../users.controller.js";
import { 
  createResponseFake, 
  createRequestFake 
} from "../factories/users.factory.js";


describe("UserController", () => {
  let service;
  let controller;

  beforeEach(() => {
    service = userServiceMock();
    controller = new UserController(service);
  });

  test("UserController.getById - should return an user", async () => {
    let responseBody;
    let responseStatus;

    service.getById = async (id) => ({
      id,
      name: "Dedaldino",
      email: "dedaldinodev4@gmail.com"
    })

    const res = {
      writeHead(status) {
        responseStatus = status;
      },

      end(body) {
        responseBody = JSON.parse(body);
      }
    };

    await controller.getById({
      res,
      params: {
        id: "1"
      }
    });

    assert.equal(responseStatus, 200);

    assert.deepEqual(responseBody, {
      id: "1",
      name: "Dedaldino",
      email: "dedaldinodev4@gmail.com"
    });

  });

  test("UserController.list - should call service with pagination", async () => {
    let receivedOptions;

    service.getAllUsers = async (options) => {
      receivedOptions = options;
      return {
        data: [],
        pagination: {
          page: 2,
          limit: 10,
          total: 29,
          totalPages: 3
        }
      }
    }

    const res = createResponseFake();

    const query = new URLSearchParams({
      page: "2",
      limit: "10"
    });

    await controller.list({
      res,
      query
    })

    assert.deepStrictEqual(receivedOptions, {
      page: "2",
      limit: "10"
    });
  })

  test("UserController.list - should return 200 with paginated users", async () => {
    service.getAllUsers = async () => ({
      data: [
        {
          id: '1',
          name: "Dedaldino",
          email: "dedaldinodev4@gmail.com"
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      }
    })

    const res = createResponseFake();

    const query = new URLSearchParams({
      page: "2",
      limit: "10"
    });

    const result = await controller.list({
      res,
      query
    })

    assert.equal(res.statusCode, 200);
    assert.deepStrictEqual(
      JSON.parse(res.body),
      {
        data: [
          {
            id: "1",
            name: "Dedaldino",
            email: "dedaldinodev4@gmail.com"
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      }
    );
  })

  test("UserController.list - should pass undefined when pagination is not provided", async () => {
    let receivedOptions;

    service.getAllUsers = async (options) => {
      receivedOptions = options;
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      }
    }

    const res = createResponseFake();
    const query = new URLSearchParams();

    await controller.list({
      res,
      query
    })

    assert.deepStrictEqual(receivedOptions, {
      page: null,
      limit: null
    });
  })

  // test("UserController.update - should return 201 with updated user", async () => {
  //   service.update = async () => ({
  //     id: "user-13",
  //     name: "Dedaldino Updated",
  //     email: "dedaldinodev4@gmail.com"
  //   });

  //   const req = createRequestFake({
  //     name: "Dedaldino Updated"
  //   })

  //   const res = createResponseFake();
  

  //   await controller.update({
  //     req,
  //     res,
  //     params: {
  //       id: 'user-13'
  //     }
  //   })

  //   assert.strictEqual(res.statusCode, 200);

  // })

  test("UserController.delete - should call service with user id", async () => {
    let receivedId;

    service.delete = (id) => {
      receivedId = id;
    }

    const res = createResponseFake();

    await controller.delete({
      res,
      params: {
        id: '1'
      }
    })

    assert.strictEqual(receivedId, "1")
  })

  test("UserController.delete - should return 204", async () => {
    const res = createResponseFake();
    await controller.delete({
      res, 
      params: {
        id: '12'
      }
    })

    assert.strictEqual(res.statusCode, 204)
    assert.strictEqual(res.ended, true)
  })

});