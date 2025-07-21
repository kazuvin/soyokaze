/**
 * TypeSpec生成スキーマからの再エクスポート
 * @soyokaze/api-specs パッケージから生成されたスキーマを利用
 */

// 開発時のテスト用 - 実際には @soyokaze/api-specs/generated/zod からimport
// import { 
//   CommonErrorResponseSchema,
//   ModelsOrderAddressSchema,
//   ModelsOrderOrderStatusSchema,
//   type CommonErrorResponse,
//   type ModelsOrderAddress,
//   type ModelsOrderOrderStatus
// } from '@soyokaze/api-specs/generated/zod';

// 現在は相対パス参照でテスト
import { 
  CommonErrorResponseSchema,
  ModelsOrderAddressSchema,
  ModelsOrderOrderStatusSchema,
  type CommonErrorResponse,
  type ModelsOrderAddress,
  type ModelsOrderOrderStatus
} from '../../api-specs/generated/zod';

// 既存スキーマとの統合テスト用エクスポート
export {
  CommonErrorResponseSchema,
  ModelsOrderAddressSchema,
  ModelsOrderOrderStatusSchema,
  type CommonErrorResponse,
  type ModelsOrderAddress,
  type ModelsOrderOrderStatus,
};