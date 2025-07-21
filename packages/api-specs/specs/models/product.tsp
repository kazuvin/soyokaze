import "../lib/common.tsp";

using Common;

namespace Models.Product;

/**
 * 商品モデル
 */
model Product extends BaseEntity {
  /**
   * 商品名
   */
  name: string;

  /**
   * 商品説明
   */
  description: string;

  /**
   * 商品価格 (円)
   */
  price: int32;

  /**
   * 商品カテゴリ
   */
  category: ProductCategory;

  /**
   * 在庫数
   */
  stock: int32;

  /**
   * 商品ステータス
   */
  status: ProductStatus;

  /**
   * 商品画像URL配列
   */
  imageUrls?: string[];

  /**
   * SKUコード
   */
  sku?: string;
}

/**
 * 商品作成リクエスト
 */
model CreateProductRequest {
  /**
   * 商品名
   */
  name: string;

  /**
   * 商品説明
   */
  description: string;

  /**
   * 商品価格 (円)
   */
  price: int32;

  /**
   * 商品カテゴリ
   */
  category: ProductCategory;

  /**
   * 在庫数
   */
  stock: int32;

  /**
   * 商品画像URL配列
   */
  imageUrls?: string[];

  /**
   * SKUコード
   */
  sku?: string;
}

/**
 * 商品更新リクエスト
 */
model UpdateProductRequest {
  /**
   * 商品名
   */
  name?: string;

  /**
   * 商品説明
   */
  description?: string;

  /**
   * 商品価格 (円)
   */
  price?: int32;

  /**
   * 商品カテゴリ
   */
  category?: ProductCategory;

  /**
   * 在庫数
   */
  stock?: int32;

  /**
   * 商品ステータス
   */
  status?: ProductStatus;

  /**
   * 商品画像URL配列
   */
  imageUrls?: string[];

  /**
   * SKUコード
   */
  sku?: string;
}

/**
 * 商品カテゴリ
 */
enum ProductCategory {
  /**
   * 電子機器
   */
  Electronics: "electronics",

  /**
   * 衣料品
   */
  Clothing: "clothing",

  /**
   * 書籍
   */
  Books: "books",

  /**
   * 食品
   */
  Food: "food",

  /**
   * その他
   */
  Other: "other",
}

/**
 * 商品ステータス
 */
enum ProductStatus {
  /**
   * 販売中
   */
  Available: "available",

  /**
   * 在庫切れ
   */
  OutOfStock: "out_of_stock",

  /**
   * 販売停止
   */
  Discontinued: "discontinued",

  /**
   * 下書き
   */
  Draft: "draft",
}