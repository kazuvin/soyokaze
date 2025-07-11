# APIクライアント 使用例

このディレクトリには、SoyokazeAPIクライアントの使用例が含まれています。

## ファイル構成

- **`basic-usage.ts`** - 基本的な使用方法とエラーハンドリング
- **`react-usage.tsx`** - React コンポーネントでの使用例
- **`README.md`** - このファイル

## 基本的な使用方法

### 1. クライアントの初期化

```typescript
import { createSoyokazeApiClient } from '@soyokaze/schemas/client';

const apiClient = createSoyokazeApiClient({
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token-here',
  },
});
```

### 2. ユーザー取得

```typescript
// 特定のユーザーを取得
const user = await apiClient.getUser('user-id');

// 全ユーザーを取得
const users = await apiClient.getAllUsers();

// ページネーション付きで取得
const response = await apiClient.getUsers({
  limit: 10,
  offset: 0,
});
```

### 3. エラーハンドリング

```typescript
import { ApiClientError } from '@soyokaze/schemas/client';

try {
  const user = await apiClient.getUser('invalid-id');
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}
```

## React での使用例

### 1. 基本的なコンポーネント

```tsx
import React, { useState, useEffect } from 'react';
import { createSoyokazeApiClient, User } from '@soyokaze/schemas/client';

const apiClient = createSoyokazeApiClient({
  baseUrl: 'http://localhost:3000',
});

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.getUsers();
        setUsers(response.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 2. カスタムフック

```tsx
import { useState, useEffect } from 'react';
import { createSoyokazeApiClient, User } from '@soyokaze/schemas/client';

const apiClient = createSoyokazeApiClient({
  baseUrl: 'http://localhost:3000',
});

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await apiClient.getUser(userId);
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
}

// 使用例
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## 利用可能なメソッド

### ユーザー関連

- `getUser(id: string)` - 特定のユーザーを取得
- `getUsers(params?: PaginationParams)` - ユーザー一覧を取得
- `getAllUsers()` - 全ユーザーを取得（ページネーション無し）
- `userExists(id: string)` - ユーザーの存在確認
- `getUsersByEmail(email: string)` - メールアドレスでユーザーを検索
- `getActiveUsers()` - アクティブなユーザーのみを取得

### エラータイプ

- `ApiClientError` - API関連のエラー
  - `status: number` - HTTPステータスコード
  - `code: string` - エラーコード
  - `message: string` - エラーメッセージ
  - `details?: any` - 追加の詳細情報

## 設定オプション

```typescript
interface ApiClientConfig {
  baseUrl: string;           // APIベースURL
  timeout?: number;          // タイムアウト（ミリ秒）
  headers?: Record<string, string>; // カスタムヘッダー
  retries?: number;          // リトライ回数（未実装）
  retryDelay?: number;       // リトライ間隔（未実装）
}
```

## 型定義

```typescript
interface User {
  id: string;                // UUID
  email: string;             // メールアドレス
  name: string;              // ユーザー名
  avatar_url?: string | null; // アバターURL
  bio?: string | null;       // 自己紹介
  created_at: string;        // 作成日時（ISO8601）
  updated_at: string;        // 更新日時（ISO8601）
  last_login?: string | null; // 最終ログイン（ISO8601）
  is_active?: boolean;       // アクティブ状態
}

interface PaginationParams {
  limit?: number;            // 取得件数（1-100）
  offset?: number;           // スキップ件数
}

interface UsersResponse {
  users: User[];             // ユーザー配列
  total: number;             // 総件数
  limit: number;             // 取得件数
  offset: number;            // スキップ件数
}
```

## 実際の使用例

詳細な使用例は以下のファイルを参照してください：

- **`basic-usage.ts`** - 基本的な使用方法、エラーハンドリング、バッチ処理
- **`react-usage.tsx`** - React コンポーネント、カスタムフック、ページネーション