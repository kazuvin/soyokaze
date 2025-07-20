# ジャーナル API CRUD 設計書

## 1. アーキテクチャ設計

### 1.1 システム構成
```
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare Workers                     │
├─────────────────────────────────────────────────────────┤
│  Hono Application (packages/api/src/index.ts)          │
│  ├─ Error Handling Middleware                          │
│  ├─ Journal Routes (packages/api/src/routes/journals.ts)│
│  └─ Existing Routes (users.ts, posts.ts)              │
├─────────────────────────────────────────────────────────┤
│  Drizzle ORM Database Layer                            │
│  └─ journals table (Cloudflare D1)                    │
├─────────────────────────────────────────────────────────┤
│  Validation Layer (packages/schemas/src/api/)          │
│  ├─ Journal Zod Schemas                               │
│  └─ Common Validation Schemas                         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 レイヤー構成
1. **ルートレイヤー**: HTTP リクエスト処理とレスポンス生成
2. **バリデーションレイヤー**: Zod による入力値検証
3. **ビジネスロジックレイヤー**: CRUD 操作とビジネスルール
4. **データアクセスレイヤー**: Drizzle ORM によるデータベース操作

## 2. データベース設計

### 2.1 journals テーブル構造
```typescript
export const journals = sqliteTable('journals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD format
  authorId: integer('author_id').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### 2.2 インデックス設計
```sql
-- 作成者による検索最適化
CREATE INDEX idx_journals_author_id ON journals(author_id);

-- 日付による検索最適化
CREATE INDEX idx_journals_date ON journals(date);

-- 作成者×日付での複合検索最適化
CREATE INDEX idx_journals_author_date ON journals(author_id, date);
```

### 2.3 型定義設計方針

**Drizzle ORM型推論の積極活用**

既存のcodebaseパターンに従い、手動での型定義ではなくDrizzle ORMの型推論機能を使用します：

```typescript
// ✅ 推奨: Drizzle による型推論
export type Journal = InferSelectModel<typeof journals>;
export type NewJournal = InferInsertModel<typeof journals>;

// ✅ 推奨: 既存型からの派生型
export type JournalUpdate = Partial<Pick<Journal, 'title' | 'content' | 'date'>>;

// ❌ 非推奨: 手動型定義
// interface Journal {
//   id: number;
//   title: string;
//   content: string;
//   // ... 手動で全フィールドを定義
// }
```

**利点:**
- **型安全性**: スキーマ変更時に型も自動更新
- **保守性**: 重複したコード定義を排除
- **一貫性**: 既存codebase（users, posts）と同じパターン
- **開発効率**: TypeScriptの型推論を最大限活用

## 3. API設計

### 3.1 エンドポイント詳細設計

#### 3.1.1 GET /journals - ジャーナル一覧取得
```typescript
// クエリパラメータ
interface JournalListQuery {
  page?: number;        // ページ番号 (default: 1)
  limit?: number;       // 取得件数 (default: 10, max: 100)
  authorId?: number;    // 作成者フィルタ
  date?: string;        // 日付フィルタ (YYYY-MM-DD)
}

// レスポンス
interface JournalListResponse {
  success: true;
  data: {
    journals: Journal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### 3.1.2 GET /journals/:id - ジャーナル詳細取得
```typescript
// パラメータ
interface JournalIdParam {
  id: number;
}

// レスポンス
interface JournalDetailResponse {
  success: true;
  data: Journal;
}
```

#### 3.1.3 POST /journals - ジャーナル作成
```typescript
// リクエストボディ
interface CreateJournalRequest {
  title: string;      // 1-200文字
  content: string;    // 1文字以上
  date: string;       // YYYY-MM-DD format
  authorId: number;   // 有効なuser.id
}

// レスポンス
interface CreateJournalResponse {
  success: true;
  data: Journal;
}
```

#### 3.1.4 PUT /journals/:id - ジャーナル更新
```typescript
// パラメータ
interface JournalIdParam {
  id: number;
}

// リクエストボディ
interface UpdateJournalRequest {
  title?: string;     // 1-200文字
  content?: string;   // 1文字以上
  date?: string;      // YYYY-MM-DD format
}

// レスポンス
interface UpdateJournalResponse {
  success: true;
  data: Journal;
}
```

#### 3.1.5 DELETE /journals/:id - ジャーナル削除
```typescript
// パラメータ
interface JournalIdParam {
  id: number;
}

// レスポンス
interface DeleteJournalResponse {
  success: true;
  data: {
    message: string;
    deletedId: number;
  };
}
```

### 3.2 エラーレスポンス設計
```typescript
// 400 Bad Request
{
  success: false,
  error: "Validation failed: title must be between 1 and 200 characters"
}

// 404 Not Found
{
  success: false,
  error: "Journal not found"
}

// 500 Internal Server Error
{
  success: false,
  error: "Internal server error"
}
```

## 4. バリデーション設計

### 4.1 Zod スキーマ定義
```typescript
// 共通スキーマ
export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// ジャーナル作成用スキーマ
export const CreateJournalSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  date: DateStringSchema,
  authorId: z.number().int().positive(),
});

// ジャーナル更新用スキーマ
export const UpdateJournalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  date: DateStringSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

// ジャーナル検索用スキーマ
export const JournalListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  authorId: z.coerce.number().int().positive().optional(),
  date: DateStringSchema.optional(),
});

// IDパラメータ用スキーマ
export const JournalIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
```

### 4.2 バリデーション適用パターン
```typescript
// パラメータバリデーション
app.get('/journals/:id', zValidator('param', JournalIdParamSchema), ...)

// クエリバリデーション
app.get('/journals', zValidator('query', JournalListQuerySchema), ...)

// ボディバリデーション
app.post('/journals', zValidator('json', CreateJournalSchema), ...)
```

## 5. データアクセス設計

### 5.1 データベース操作関数
```typescript
// ジャーナル一覧取得（ページネーション・フィルタ対応）
async function getJournals(params: {
  page: number;
  limit: number;
  authorId?: number;
  date?: string;
}): Promise<{ journals: Journal[]; total: number }>;

// ジャーナル詳細取得
async function getJournalById(id: number): Promise<Journal | null>;

// ジャーナル作成
async function createJournal(data: NewJournal): Promise<Journal>;

// ジャーナル更新
async function updateJournal(id: number, data: JournalUpdate): Promise<Journal | null>;

// ジャーナル削除
async function deleteJournal(id: number): Promise<boolean>;

// 作成者の存在確認
async function authorExists(authorId: number): Promise<boolean>;
```

### 5.2 クエリ最適化
- **インデックス活用**: author_id, date, (author_id, date) の複合インデックス
- **ページネーション**: LIMIT/OFFSET を使用した効率的なページング
- **カウントクエリ**: 総件数取得のための最適化されたCOUNTクエリ

## 6. エラーハンドリング設計

### 6.1 エラー分類と処理
```typescript
// バリデーションエラー (400)
if (validation fails) {
  throw new ValidationError("Validation failed: specific message");
}

// リソース未発見エラー (404)
if (journal not found) {
  throw new NotFoundError("Journal");
}

// 外部キー制約エラー (400)
if (author not exists) {
  throw new ValidationError("Author does not exist");
}

// 内部サーバーエラー (500)
if (database error) {
  throw new AppError("Database operation failed", "DATABASE_ERROR", 500);
}
```

### 6.2 ミドルウェアでの統一処理
```typescript
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      { success: false, error: err.message }, 
      err.statusCode as StatusCode
    );
  }
  
  // 予期しないエラー
  console.error('Unexpected error:', err);
  return c.json(
    { success: false, error: 'Internal server error' }, 
    500
  );
});
```

## 7. ファイル構成設計

### 7.1 新規作成ファイル
```
packages/
├── api/src/routes/
│   └── journals.ts              # ジャーナルAPIルート
├── schemas/src/
│   ├── api/validators.ts        # ジャーナル用Zodスキーマ追加
│   └── db/schema.ts            # journalsテーブル定義追加
└── api/migrations/
    └── 0003_add_journals_table.sql  # journalsテーブル作成マイグレーション
```

### 7.2 既存ファイル更新
```
packages/
├── api/src/
│   └── index.ts                # journalsルートの追加
└── schemas/src/api/
    └── types.ts                # Journal型定義のエクスポート追加
```

## 8. パフォーマンス設計

### 8.1 データベース最適化
- **インデックス戦略**: 検索パターンに応じた効率的なインデックス配置
- **クエリ最適化**: N+1問題の回避、効率的なJOIN操作
- **ページネーション**: メモリ効率的なデータ取得

### 8.2 レスポンス最適化
- **必要なフィールドのみ返却**: 不要なデータの転送を避ける
- **適切なHTTPステータスコード**: キャッシュ最適化のための正確なステータス
- **圧縮**: Cloudflare Workersの自動圧縮機能活用

## 9. セキュリティ設計

### 9.1 入力値検証
- **Zodスキーマ**: 全入力値の厳密な型チェックと範囲検証
- **SQLインジェクション対策**: Drizzle ORMによるパラメータ化クエリ
- **XSS対策**: 適切なエスケープ処理

### 9.2 将来の認証・認可対応
```typescript
// 将来実装される認証ミドルウェア対応設計
interface AuthenticatedContext extends Context {
  var: {
    user: {
      id: number;
      email: string;
      role: 'admin' | 'user';
    };
  };
}

// 所有者チェック（将来実装）
async function checkJournalOwnership(journalId: number, userId: number): Promise<boolean>;
```

## 10. 拡張性設計

### 10.1 モノリポ統合
- **共通スキーマ**: モバイルアプリとAPIでの型定義共有
- **一貫したエラーハンドリング**: 全パッケージでの統一されたエラー処理
- **OpenAPI統合**: スキーマからのAPI仕様書自動生成対応

### 10.2 同期機能対応
```typescript
// 将来のオフライン同期機能対応
interface SyncReadyJournal extends Journal {
  synced: boolean;
  lastModified: string;
  clientId?: string;
}
```

この設計により、要件で定義された機能を効率的かつ拡張性を持って実装できます。既存のアーキテクチャパターンとの整合性を保ちながら、将来の機能拡張にも対応可能な設計となっています。