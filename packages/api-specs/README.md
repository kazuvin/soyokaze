# TypeSpec API Specifications

TypeSpec定義による中央管理されたAPI仕様とスキーマ生成システムです。

## 概要

このパッケージは、Soyokazeプロジェクトで使用する全てのAPI定義をTypeSpecで管理し、複数の出力形式に自動変換します。

## 生成される成果物

- **OpenAPI 3.0仕様**: `generated/@typespec/openapi3/openapi.yaml`
- **JSON Schema**: `generated/json-schema/`
- **Zodスキーマと型定義**: `generated/zod/index.ts`（z.inferで型も含む）
- **ネイティブFetchクライアント**: `generated/clients/native-fetch/`
- **TanStack Queryクライアント**: `generated/clients/tanstack-query/`

## 使用方法

### スキーマのコンパイルと生成

```bash
# 全て生成（TypeSpec + Zod + APIクライアント）
npm run api-specs:generate

# TypeSpecのみコンパイル
npm run api-specs:compile

# 監視モード
npm run api-specs:watch

# バリデーションのみ
npm run api-specs:validate

# APIクライアントのみ生成（Native Fetch + TanStack Query）
npm run api-specs:generate-clients
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

### APIクライアントの利用

#### Native Fetch クライアント

```typescript
// Native Fetch クライアント
import { 
  listUsers, 
  createUser, 
  getUser 
} from '@soyokaze/api-specs/generated/clients/native-fetch/soyokazeAPI';

// ユーザー一覧取得
const users = await listUsers({ page: 1, limit: 20 });

// ユーザー作成
const newUser = await createUser({
  name: "田中太郎",
  email: "tanaka@example.com"
});

// 単一ユーザー取得
const user = await getUser("user123");
```

#### TanStack Query カスタムフック

```typescript
// React Query カスタムフック
import { 
  useListUsers, 
  useCreateUser, 
  useGetUser 
} from '@soyokaze/api-specs/generated/clients/tanstack-query/soyokazeAPI';

function UserList() {
  // ユーザー一覧取得
  const { data: users, isLoading } = useListUsers({ 
    page: 1, 
    limit: 20 
  });

  // ユーザー作成ミューテーション
  const createUserMutation = useCreateUser();

  const handleCreateUser = () => {
    createUserMutation.mutate({
      data: {
        name: "田中太郎",
        email: "tanaka@example.com"
      }
    });
  };

  // 単一ユーザー取得
  const { data: user } = useGetUser("user123");

  // ... コンポーントロジック
}
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
│   ├── zod/               # Zodスキーマと型定義（統合）
│   └── clients/           # APIクライアント
│       ├── native-fetch/  # ネイティブFetchクライアント
│       └── tanstack-query/# TanStack Queryフック
├── src/
│   └── mutator/
│       └── custom-fetch.ts # カスタムFetch関数（Native Fetch用）
├── orval.config.cjs       # Orval設定ファイル
└── tspconfig.yaml         # TypeSpecコンパイラ設定
```

## 開発ワークフロー

1. `specs/` ディレクトリでTypeSpecファイルを編集
2. `npm run api-specs:generate` で全てのスキーマとクライアントを生成
3. 他パッケージで生成されたスキーマとAPIクライアントを利用
4. 必要に応じて型定義、バリデーションスキーマ、APIクライアントを更新

## 互換性

- 既存の `packages/schemas/` との並行運用が可能
- 段階的な移行をサポート
- 生成される型定義は既存システムと互換性を保持