# @soyokaze/orval

TypeSpec OpenAPI仕様から各種ライブラリを自動生成するパッケージです。

## 概要

このパッケージは、`@soyokaze/tsp`パッケージで生成されたOpenAPI仕様を使用して、以下のライブラリを自動生成します：

- **TanStack Query**: React Query用のhooksとクライアント
- **Client Library**: Axios基盤のAPIクライアント
- **Zod Schemas**: バリデーション用のZodスキーマ
- **MSW Handlers**: テスト用のMSWモックハンドラー

## 使用方法

### 全ライブラリを生成

```bash
pnpm generate
```

### 個別ライブラリを生成

```bash
# TanStack Query
pnpm generate:tanstack

# Client Library
pnpm generate:client

# Zod Schemas
pnpm generate:zod

# MSW Handlers
pnpm generate:msw
```

## 生成されるファイル

```
generated/
├── tanstack-query/     # TanStack Query hooks
├── client/            # Axios client
├── zod/               # Zod schemas
└── msw/               # MSW handlers
```

## インポート方法

```typescript
// TanStack Query hooks
import { useGetUsers, useCreateUser } from '@soyokaze/orval/tanstack-query';

// Client library
import { getUsers, createUser } from '@soyokaze/orval/client';

// Zod schemas
import { UserSchema, CreateUserSchema } from '@soyokaze/orval/zod';

// MSW handlers
import { handlers } from '@soyokaze/orval/msw';
```

## 設定

### API URL設定

環境変数でAPI URLを設定できます：

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 認証

APIクライアントは自動的にlocalStorageから`auth_token`を読み取り、Authorizationヘッダーに設定します。

## 依存関係

- TypeSpec仕様: `@soyokaze/tsp`パッケージで生成
- 生成ツール: Orval
- HTTPクライアント: Axios
- 状態管理: TanStack Query
- バリデーション: Zod
- モック: MSW