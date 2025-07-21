import "@typespec/http";
import "@typespec/rest";
import "../lib/common.tsp";
import "../models/user.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using Common;
using Models.User;

namespace Services.User;

/**
 * ユーザー管理API
 */
namespace UserAPI {

/**
 * ユーザー一覧取得
 */
@route("/users")
@get
op listUsers(...PaginationQuery): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<User>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * ユーザー詳細取得
 */
@route("/users/{id}")
@get
op getUser(
  @path id: string
): {
  @statusCode statusCode: 200;
  @body body: User;
} | {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * ユーザー作成
 */
@route("/users")
@post
op createUser(
  @body user: CreateUserRequest
): {
  @statusCode statusCode: 201;
  @body body: User;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 409;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * ユーザー更新
 */
@route("/users/{id}")
@put
op updateUser(
  @path id: string,
  @body user: UpdateUserRequest
): {
  @statusCode statusCode: 200;
  @body body: User;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * ユーザー削除
 */
@route("/users/{id}")
@delete
op deleteUser(
  @path id: string
): {
  @statusCode statusCode: 204;
} | {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * ユーザー検索
 */
@route("/users/search")
@get
op searchUsers(
  @query name?: string,
  @query email?: string,
  @query status?: UserStatus,
  ...PaginationQuery
): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<User>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

}