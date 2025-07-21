import "@typespec/http";
import "@typespec/rest";
import "../lib/common.tsp";
import "../models/product.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using Common;
using Models.Product;

namespace Services.Product;

/**
 * 商品管理API
 */
namespace ProductAPI {

/**
 * 商品一覧取得
 */
@route("/products")
@get
op listProducts(...PaginationQuery): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<Product>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 商品詳細取得
 */
@route("/products/{id}")
@get
op getProduct(
  @path id: string
): {
  @statusCode statusCode: 200;
  @body body: Product;
} | {
  @statusCode statusCode: 404;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 商品作成
 */
@route("/products")
@post
op createProduct(
  @body product: CreateProductRequest
): {
  @statusCode statusCode: 201;
  @body body: Product;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * 商品更新
 */
@route("/products/{id}")
@put
op updateProduct(
  @path id: string,
  @body product: UpdateProductRequest
): {
  @statusCode statusCode: 200;
  @body body: Product;
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
 * 商品削除
 */
@route("/products/{id}")
@delete
op deleteProduct(
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
 * 商品検索
 */
@route("/products/search")
@get
op searchProducts(
  @query name?: string,
  @query category?: ProductCategory,
  @query status?: ProductStatus,
  @query minPrice?: int32,
  @query maxPrice?: int32,
  ...PaginationQuery
): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<Product>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

/**
 * カテゴリ別商品取得
 */
@route("/products/category/{category}")
@get
op getProductsByCategory(
  @path category: ProductCategory,
  ...PaginationQuery
): {
  @statusCode statusCode: 200;
  @body body: PaginatedResponse<Product>;
} | {
  @statusCode statusCode: 400;
  @body error: ErrorResponse;
} | {
  @statusCode statusCode: 500;
  @body error: ErrorResponse;
};

}