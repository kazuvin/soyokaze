# TypeSpec API Specifications

TypeSpec定義による中央管理されたAPI仕様とスキーマ生成システムです。

## 概要

このパッケージは、Soyokazeプロジェクトで使用する全てのAPI定義をTypeSpecで管理し、複数の出力形式に自動変換します。

## 生成される成果物

- **OpenAPI 3.0仕様**: `generated/@typespec/openapi3/openapi.yaml`
- **JSON Schema**: `generated/json-schema/`
- **Zodスキーマと型定義**: `generated/zod/index.ts`（z.inferで型も含む）

## 使用方法

### スキーマのコンパイルと生成

```bash
# TypeSpecコンパイルとZodスキーマ生成
npm run api-specs:generate

# TypeSpecのみコンパイル
npm run api-specs:compile

# 監視モード
npm run api-specs:watch

# バリデーションのみ
npm run api-specs:validate
```

### モノリポからの実行

```bash
# ルートから実行
npm run compile:schemas
npm run watch:schemas
npm run validate:schemas
```

## 他パッケージでの利用

### packages/mobile での利用

```typescript
// Zodスキーマの利用
import { 
  CommonErrorResponseSchema,
  ModelsOrderAddressSchema 
} from '@soyokaze/api-specs/generated/zod';

// バリデーション
const result = CommonErrorResponseSchema.safeParse(data);
```

### packages/api での利用

```typescript
// 型定義の利用  
import type { 
  CommonErrorResponse,
  ModelsOrderAddress
} from '@soyokaze/api-specs/generated/zod';

// API レスポンス型
const response: CommonErrorResponse = {
  code: "USER_NOT_FOUND",
  message: "指定されたユーザーが見つかりません"
};
```

## ファイル構造

```
packages/api-specs/
├── specs/
│   ├── main.tsp           # エントリーポイント
│   ├── lib/
│   │   └── common.tsp     # 共通型定義
│   ├── models/            # データモデル定義
│   │   ├── user.tsp
│   │   ├── product.tsp
│   │   └── order.tsp
│   └── services/          # API エンドポイント定義
│       ├── user-api.tsp
│       ├── product-api.tsp
│       └── order-api.tsp
├── scripts/
│   └── generate-zod.js    # Zodスキーマ生成スクリプト
├── generated/             # 自動生成されたファイル
│   ├── @typespec/
│   │   └── openapi3/
│   ├── json-schema/
│   └── zod/               # Zodスキーマと型定義（統合）
└── tspconfig.yaml         # TypeSpecコンパイラ設定
```

## 開発ワークフロー

1. `specs/` ディレクトリでTypeSpecファイルを編集
2. `npm run api-specs:generate` でスキーマ生成
3. 他パッケージで生成されたスキーマを利用
4. 必要に応じて型定義やバリデーションスキーマを更新

## 互換性

- 既存の `packages/schemas/` との並行運用が可能
- 段階的な移行をサポート
- 生成される型定義は既存システムと互換性を保持