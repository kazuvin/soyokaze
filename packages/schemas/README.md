# Soyokaze API Schemas

OpenAPI定義書、Zodスキーマ、型安全なAPIクライアントを自動生成するパッケージです。

## 概要

このパッケージには以下が含まれています：

- **OpenAPI 3.0.3 定義書** (`openapi.yaml`)
- **Express.js モックサーバー** (`server.js`)
- **Swagger UI** ドキュメント
- **自動生成されたZodスキーマ** (`generated/zod/`)
- **型安全なZodiosクライアント** (`generated/client/`)
- **TypeScript型定義** (`generated/types/`)

## 使用方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. スキーマとクライアントの生成

```bash
# すべて生成（推奨）
npm run generate

# 個別生成
npm run generate:zod      # Zodスキーマのみ
npm run generate:client   # Zodiosクライアントのみ  
npm run generate:types    # TypeScript型のみ

# 生成されたスキーマをテスト
npm run test:schemas
```

### 3. サーバーの起動

```bash
# 本番モード
npm start

# 開発モード (ホットリロード)
npm run dev
```

### 4. APIドキュメントの確認

サーバー起動後、以下のURLにアクセスしてください：

- **API ドキュメント**: http://localhost:3000/api-docs
- **サーバー情報**: http://localhost:3000/
- **ヘルスチェック**: http://localhost:3000/health

## API エンドポイント

### ユーザー管理（CRUD対応）

#### GET /users
ユーザーの一覧を取得します（ページネーション対応）。

**クエリパラメータ:**
- `limit` (optional): 取得する最大件数 (1-100, デフォルト: 10)
- `offset` (optional): スキップする件数 (デフォルト: 0)

#### GET /users/{id}
指定されたIDのユーザーを取得します。

**パラメータ:**
- `id` (path, required): ユーザーID (UUID形式)

#### POST /users
新しいユーザーを作成します。

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "User biography",
  "is_active": true
}
```

#### PUT /users/{id}
既存のユーザーを更新します。

**パラメータ:**
- `id` (path, required): ユーザーID (UUID形式)

**リクエストボディ:** (すべてオプショナル)
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "bio": "Updated biography",
  "is_active": false
}
```

#### DELETE /users/{id}
指定されたユーザーを削除します。

**パラメータ:**
- `id` (path, required): ユーザーID (UUID形式)

## モックデータ

サーバーには以下のサンプルユーザーデータが含まれています：

- John Doe (アクティブユーザー)
- Jane Smith (アクティブユーザー)
- Bob Johnson (非アクティブユーザー)

## 開発

### ファイル構成

```
packages/schemas/
├── openapi.yaml          # OpenAPI 定義書
├── server.js             # Express.js モックサーバー
├── scripts/              # 生成スクリプト
│   ├── extract-schemas.js # Zodスキーマ抽出
│   ├── generate-client.js # クライアント生成
│   └── generate-types.js  # 型生成
├── generated/            # 生成されたファイル
│   ├── zod/             # Zodスキーマ
│   │   └── index.ts     # バリデーションスキーマ
│   ├── client/          # APIクライアント
│   │   └── index.ts     # Zodiosクライアント
│   └── types/           # TypeScript型
│       └── index.ts     # 型定義
├── test-schemas.js       # スキーマテストファイル
├── tsconfig.json         # TypeScript設定
├── package.json          # パッケージ設定
└── README.md             # このファイル
```

### 生成されるファイル

`npm run generate`を実行すると、以下が分離して生成されます：

- **`generated/zod/index.ts`**: Zodスキーマ定義（ランタイム検証）
- **`generated/client/index.ts`**: Zodiosクライアント（API呼び出し）
- **`generated/types/index.ts`**: TypeScript型定義（型チェック）

### 利用可能なスクリプト

```bash
# すべて生成
npm run generate

# 個別生成
npm run generate:zod      # Zodスキーマ
npm run generate:client   # Zodiosクライアント  
npm run generate:types    # TypeScript型

# サーバー
npm start                 # 本番サーバー起動
npm run dev              # 開発サーバー起動

# ビルドとテスト
npm run build            # TypeScriptコンパイル
npm run test:schemas     # スキーマテスト
npm run test:client      # クライアントテスト

# クリーンアップ
npm run clean            # 生成ファイル削除
```

### 定義書の更新

`openapi.yaml` を編集した後、サーバーを再起動してください。変更内容は自動的にSwagger UIに反映されます。

### 新しいエンドポイントの追加

1. `openapi.yaml` にAPI定義を追加
2. `server.js` にモックの実装を追加  
3. `npm run generate` でスキーマとクライアントを再生成
4. サーバーを再起動

## パッケージの使用方法

### 基本的な使用方法

```typescript
// Zodiosクライアントを使用（推奨）
import { createApiClient } from '@soyokaze/schemas';
// または
import { createApiClient } from '@soyokaze/schemas/client';

const client = createApiClient('http://localhost:3000');

// CRUD操作
const users = await client.getUsers({ limit: 10 });
const user = await client.getUserById({ id: 'user-id' });
const newUser = await client.createUser({
  email: 'user@example.com',
  name: 'User Name'
});
const updatedUser = await client.updateUser(
  { id: 'user-id' }, 
  { name: 'Updated Name' }
);
await client.deleteUser({ id: 'user-id' });
```

### スキーマのみ使用

```typescript
// Zodスキーマのみ使用
import { schemas } from '@soyokaze/schemas/zod';

// バリデーション
const result = schemas.User.parse(userData);
const isValid = schemas.CreateUserRequest.safeParse(requestData);
```

### 型のみ使用

```typescript
// TypeScript型のみ使用
import type { User, CreateUserRequest } from '@soyokaze/schemas/types';

function processUser(user: User): void {
  console.log(user.name);
}

function createUser(data: CreateUserRequest): Promise<User> {
  // 実装
}
```

### React での使用例

```tsx
import { createApiClient } from '@soyokaze/schemas/client';
import type { User } from '@soyokaze/schemas/types';
import { useState, useEffect } from 'react';

const client = createApiClient('http://localhost:3000');

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getUserById({ id: userId })
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return <div>{user.name}</div>;
}
```

## アーキテクチャ

### 責務の分離

このパッケージは明確な責務分離を採用しています：

- **`generated/zod/`**: ランタイム検証用のZodスキーマ
- **`generated/client/`**: API呼び出し用のZodiosクライアント  
- **`generated/types/`**: コンパイル時型チェック用のTypeScript型

### 生成フロー

1. **OpenAPI定義** → `openapi-zod-client` → **Zodスキーマ** (自動生成)
2. **Zodスキーマ** → カスタムスクリプト → **Zodiosクライアント** (自動生成)
3. **Zodスキーマ** → `z.infer` → **TypeScript型** (自動生成)

### メリット

- **型安全性**: すべての型がZodスキーマから推論され、一貫性が保証
- **ランタイム検証**: APIレスポンスが自動的にバリデーション
- **開発体験**: IDEの補完とエラーチェックが完全にサポート
- **保守性**: OpenAPI定義を変更するだけで全体が自動更新

## 技術仕様

- **Node.js**: 現在のLTS版
- **Express.js**: 4.18.2
- **Swagger UI Express**: 5.0.0
- **OpenAPI**: 3.0.3
- **Zod**: 3.22.0
- **Zodios**: 10.9.6
- **openapi-zod-client**: 1.18.3

## ライセンス

MIT