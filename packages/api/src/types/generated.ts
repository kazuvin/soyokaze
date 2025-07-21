/**
 * TypeSpec生成型定義からの再エクスポート
 * @soyokaze/api-specs パッケージから生成された型定義を利用
 */

// 開発時のテスト用 - 実際には @soyokaze/api-specs/generated/zod からimport
// import type { 
//   CommonErrorResponse,
//   ModelsOrderAddress,
//   ModelsOrderOrderStatus
// } from '@soyokaze/api-specs/generated/zod';

// 現在は相対パス参照でテスト
import type { 
  CommonErrorResponse,
  ModelsOrderAddress,  
  ModelsOrderOrderStatus
} from '../../../api-specs/generated/zod';

// APIパッケージ用の型エクスポート
export type {
  CommonErrorResponse,
  ModelsOrderAddress,
  ModelsOrderOrderStatus,
};

// APIレスポンス統合用のヘルパー型
export type ApiResponse<T> = {
  data: T;
  error?: CommonErrorResponse;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
};