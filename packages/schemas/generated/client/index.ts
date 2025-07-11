import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";
import { schemas } from "../zod";

const { User, UsersListResponse, Error, CreateUserRequest, UpdateUserRequest, PaginationResponse } = schemas;

const endpoints = makeApi([
  {
    method: "get",
    path: "/users",
    alias: "getUsers",
    description: `Retrieve a list of all users`,
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(10),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().gte(0).optional().default(0),
      },
    ],
    response: UsersListResponse,
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: Error,
      },
    ],
  },
  {
    method: "post",
    path: "/users",
    alias: "createUser",
    description: `Create a new user with the provided information`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateUserRequest,
      },
    ],
    response: User,
    errors: [
      {
        status: 400,
        description: `Invalid request data`,
        schema: Error,
      },
      {
        status: 409,
        description: `Resource conflict (e.g., email already exists)`,
        schema: Error,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: Error,
      },
    ],
  },
  {
    method: "get",
    path: "/users/:id",
    alias: "getUserById",
    description: `Retrieve a user by their unique identifier`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: User,
    errors: [
      {
        status: 404,
        description: `The specified resource was not found`,
        schema: Error,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: Error,
      },
    ],
  },
  {
    method: "put",
    path: "/users/:id",
    alias: "updateUser",
    description: `Update an existing user with the provided information`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateUserRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: User,
    errors: [
      {
        status: 400,
        description: `Invalid request data`,
        schema: Error,
      },
      {
        status: 404,
        description: `The specified resource was not found`,
        schema: Error,
      },
      {
        status: 409,
        description: `Resource conflict (e.g., email already exists)`,
        schema: Error,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: Error,
      },
    ],
  },
  {
    method: "delete",
    path: "/users/:id",
    alias: "deleteUser",
    description: `Delete an existing user`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `The specified resource was not found`,
        schema: Error,
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: Error,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}


// Re-export schemas for convenience
export { schemas } from "../zod";