import "@typespec/http";

using TypeSpec.Http;

namespace Common;

/**
 * 共通エラーレスポンス
 */
model ErrorResponse {
  /**
   * エラーコード
   */
  code: string;

  /**
   * エラーメッセージ
   */
  message: string;

  /**
   * エラーの詳細情報
   */
  details?: string;

  /**
   * リクエストID
   */
  requestId?: string;
}

/**
 * ページネーション用パラメータ
 */
model PaginationQuery {
  /**
   * ページ番号 (1から開始)
   */
  @query
  page?: int32 = 1;

  /**
   * 1ページあたりの件数
   */
  @query
  limit?: int32 = 20;
}

/**
 * ページネーション用レスポンス
 */
model PaginatedResponse<T> {
  /**
   * データ配列
   */
  data: T[];

  /**
   * ページネーション情報
   */
  pagination: {
    /**
     * 現在のページ
     */
    page: int32;

    /**
     * 1ページあたりの件数
     */
    limit: int32;

    /**
     * 総件数
     */
    total: int32;

    /**
     * 総ページ数
     */
    totalPages: int32;

    /**
     * 前のページがあるか
     */
    hasPrevious: boolean;

    /**
     * 次のページがあるか
     */
    hasNext: boolean;
  };
}

/**
 * 共通の基本フィールド
 */
model BaseEntity {
  /**
   * ユニークID
   */
  id: string;

  /**
   * 作成日時 (ISO 8601)
   */
  createdAt: utcDateTime;

  /**
   * 更新日時 (ISO 8601)
   */
  updatedAt: utcDateTime;
}