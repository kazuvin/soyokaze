import "../lib/common.tsp";
import "./user.tsp";
import "./product.tsp";

using Common;
using Models.User;
using Models.Product;

namespace Models.Order;

/**
 * 注文モデル
 */
model Order extends BaseEntity {
  /**
   * 注文番号
   */
  orderNumber: string;

  /**
   * ユーザーID
   */
  userId: string;

  /**
   * 注文ステータス
   */
  status: OrderStatus;

  /**
   * 注文アイテム
   */
  items: OrderItem[];

  /**
   * 合計金額 (円)
   */
  totalAmount: int32;

  /**
   * 配送先住所
   */
  shippingAddress: Address;

  /**
   * 請求先住所
   */
  billingAddress?: Address;

  /**
   * 注文日時
   */
  orderedAt: utcDateTime;

  /**
   * 配送予定日
   */
  estimatedDeliveryDate?: utcDateTime;

  /**
   * 配送完了日
   */
  deliveredAt?: utcDateTime;
}

/**
 * 注文アイテム
 */
model OrderItem {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * 商品名 (注文時のスナップショット)
   */
  productName: string;

  /**
   * 単価 (注文時のスナップショット)
   */
  unitPrice: int32;

  /**
   * 数量
   */
  quantity: int32;

  /**
   * 小計
   */
  subtotal: int32;
}

/**
 * 住所情報
 */
model Address {
  /**
   * 郵便番号
   */
  postalCode: string;

  /**
   * 都道府県
   */
  prefecture: string;

  /**
   * 市区町村
   */
  city: string;

  /**
   * 住所1
   */
  address1: string;

  /**
   * 住所2 (建物名・部屋番号など)
   */
  address2?: string;

  /**
   * 受取人名
   */
  recipientName: string;

  /**
   * 電話番号
   */
  phoneNumber: string;
}

/**
 * 注文作成リクエスト
 */
model CreateOrderRequest {
  /**
   * 注文アイテム
   */
  items: CreateOrderItem[];

  /**
   * 配送先住所
   */
  shippingAddress: Address;

  /**
   * 請求先住所
   */
  billingAddress?: Address;
}

/**
 * 注文アイテム作成リクエスト
 */
model CreateOrderItem {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * 数量
   */
  quantity: int32;
}

/**
 * 注文更新リクエスト
 */
model UpdateOrderRequest {
  /**
   * 注文ステータス
   */
  status?: OrderStatus;

  /**
   * 配送先住所
   */
  shippingAddress?: Address;

  /**
   * 配送予定日
   */
  estimatedDeliveryDate?: utcDateTime;
}

/**
 * 注文ステータス
 */
enum OrderStatus {
  /**
   * 保留中
   */
  Pending: "pending",

  /**
   * 確認済み
   */
  Confirmed: "confirmed",

  /**
   * 処理中
   */
  Processing: "processing",

  /**
   * 配送中
   */
  Shipping: "shipping",

  /**
   * 配送完了
   */
  Delivered: "delivered",

  /**
   * キャンセル
   */
  Cancelled: "cancelled",

  /**
   * 返品
   */
  Returned: "returned",
}