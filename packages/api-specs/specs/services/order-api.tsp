import "@typespec/http";
import "@typespec/rest";
import "../lib/common.tsp";
import "../models/order.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using Common;
using Models.Order;

namespace Services.Order;

/**
 * 注文管理API
 */
namespace OrderAPI {

/**
 * 注文一覧取得
 */
@route("/orders")
@get
op listOrders(...PaginationQuery): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<Order>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 注文詳細取得
 */
@route("/orders/{id}")
@get
op getOrder(
  @path id: string
): {
  @statusCode statusCode: 200;
  @body body: Order;
} | {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 注文作成
 */
@route("/orders")
@post
op createOrder(
  @body order: CreateOrderRequest
): {
  @statusCode statusCode: 201;
  @body body: Order;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 注文更新
 */
@route("/orders/{id}")
@put
op updateOrder(
  @path id: string,
  @body order: UpdateOrderRequest
): {
  @statusCode statusCode: 200;
  @body body: Order;
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
 * 注文キャンセル
 */
@route("/orders/{id}/cancel")
@post
op cancelOrder(
  @path id: string
): {
  @statusCode statusCode: 200;
  @body body: Order;
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
 * ユーザーの注文履歴取得
 */
@route("/users/{userId}/orders")
@get
op getUserOrders(
  @path userId: string,
  @query status?: OrderStatus,
  ...PaginationQuery
): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<Order>;
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
 * 注文ステータス更新
 */
@route("/orders/{id}/status")
@patch
op updateOrderStatus(
  @path id: string,
  @body statusUpdate: {
    status: OrderStatus;
    estimatedDeliveryDate?: utcDateTime;
  }
): {
  @statusCode statusCode: 200;
  @body body: Order;
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

}