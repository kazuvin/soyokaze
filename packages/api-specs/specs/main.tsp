import "@typespec/http";
import "@typespec/rest";
import "./lib/common.tsp";
import "./models/user.tsp";
import "./models/product.tsp";
import "./models/order.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using Common;
using Models.User;
using Models.Product;
using Models.Order;

/**
 * Soyokaze API Specification
 * 
 * TypeSpec定義から自動生成されるAPI仕様書
 * モノリポ内でのスキーマ中央管理システム
 */
@service({
  title: "Soyokaze API",
  description: "Comprehensive API for Soyokaze platform"
})
@server("https://api.soyokaze.com", "Production API Server")
@server("https://staging-api.soyokaze.com", "Staging API Server")
@server("http://localhost:8787", "Development API Server")
namespace SoyokazeAPI {
  // User API
  @route("/users")
  @get
  op listUsers(...PaginationQuery): {
    @statusCode _: 200;
    @body body: PaginatedResponse<User>;
  } | {
    @statusCode _: 400;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 500;
    @body error: ErrorResponse;
  };

  @route("/users/{id}")
  @get
  op getUser(@path id: string): {
    @statusCode _: 200;
    @body body: User;
  } | {
    @statusCode _: 404;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 500;
    @body error: ErrorResponse;
  };

  @route("/users")
  @post
  op createUser(@body user: CreateUserRequest): {
    @statusCode _: 201;
    @body body: User;
  } | {
    @statusCode _: 400;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 500;
    @body error: ErrorResponse;
  };

  @route("/users/{id}")
  @put
  op updateUser(
    @path id: string,
    @body user: UpdateUserRequest
  ): {
    @statusCode _: 200;
    @body body: User;
  } | {
    @statusCode _: 400;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 404;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 500;
    @body error: ErrorResponse;
  };

  @route("/users/{id}")
  @delete
  op deleteUser(@path id: string): {
    @statusCode _: 204;
  } | {
    @statusCode _: 404;
    @body error: ErrorResponse;
  } | {
    @statusCode _: 500;
    @body error: ErrorResponse;
  };
}