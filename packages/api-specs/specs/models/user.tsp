import "../lib/common.tsp";

using Common;

namespace Models.User;

/**
 * ユーザーモデル
 */
model User extends BaseEntity {
  /**
   * ユーザー名
   */
  name: string;

  /**
   * メールアドレス
   */
  email: string;

  /**
   * ユーザーステータス
   */
  status: UserStatus;

  /**
   * プロフィール画像URL
   */
  avatarUrl?: string;

  /**
   * 最終ログイン日時
   */
  lastLoginAt?: utcDateTime;
}

/**
 * ユーザー作成リクエスト
 */
model CreateUserRequest {
  /**
   * ユーザー名
   */
  name: string;

  /**
   * メールアドレス
   */
  email: string;

  /**
   * プロフィール画像URL
   */
  avatarUrl?: string;
}

/**
 * ユーザー更新リクエスト
 */
model UpdateUserRequest {
  /**
   * ユーザー名
   */
  name?: string;

  /**
   * メールアドレス
   */
  email?: string;

  /**
   * プロフィール画像URL
   */
  avatarUrl?: string;

  /**
   * ユーザーステータス
   */
  status?: UserStatus;
}

/**
 * ユーザーステータス
 */
enum UserStatus {
  /**
   * アクティブ
   */
  Active: "active",

  /**
   * 非アクティブ
   */
  Inactive: "inactive",

  /**
   * 保留中
   */
  Pending: "pending",

  /**
   * 停止中
   */
  Suspended: "suspended",
}