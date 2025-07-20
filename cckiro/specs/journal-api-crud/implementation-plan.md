# ジャーナル API CRUD 実装計画書

## 1. 実装順序とタスク分解

### 1.1 実装フェーズ
1. **データベース層**: スキーマ定義とマイグレーション
2. **バリデーション層**: Zodスキーマ定義
3. **ルート層**: APIエンドポイント実装
4. **統合層**: メインアプリケーションへの統合

### 1.2 詳細タスクリスト

#### フェーズ1: データベース層実装
- [ ] **Task 1.1**: `packages/schemas/src/db/schema.ts` にjournalsテーブル定義を追加
- [ ] **Task 1.2**: マイグレーションファイル `packages/api/migrations/0003_add_journals_table.sql` を作成
- [ ] **Task 1.3**: 型定義をエクスポート (`packages/schemas/src/api/types.ts`)

#### フェーズ2: バリデーション層実装
- [ ] **Task 2.1**: `packages/schemas/src/api/validators.ts` にジャーナル用Zodスキーマを追加
- [ ] **Task 2.2**: 共通バリデーションスキーマ（日付、ページネーション）の確認・追加

#### フェーズ3: ルート層実装
- [ ] **Task 3.1**: `packages/api/src/routes/journals.ts` の基本構造作成
- [ ] **Task 3.2**: GET /journals エンドポイント実装（一覧取得）
- [ ] **Task 3.3**: GET /journals/:id エンドポイント実装（詳細取得）
- [ ] **Task 3.4**: POST /journals エンドポイント実装（作成）
- [ ] **Task 3.5**: PUT /journals/:id エンドポイント実装（更新）
- [ ] **Task 3.6**: DELETE /journals/:id エンドポイント実装（削除）

#### フェーズ4: 統合層実装
- [ ] **Task 4.1**: `packages/api/src/index.ts` にjournalsルートを統合
- [ ] **Task 4.2**: 型定義の適切なエクスポート確認


## 2. ファイル別実装詳細

### 2.1 packages/schemas/src/db/schema.ts
```typescript
// 追加する内容
export const journals = sqliteTable('journals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  authorId: integer('author_id').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 型定義のエクスポート
export type Journal = InferSelectModel<typeof journals>;
export type NewJournal = InferInsertModel<typeof journals>;
export type JournalUpdate = Partial<Pick<Journal, 'title' | 'content' | 'date'>>;
```

### 2.2 packages/api/migrations/0003_add_journals_table.sql
```sql
-- journals テーブル作成
CREATE TABLE journals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- インデックス作成
CREATE INDEX idx_journals_author_id ON journals(author_id);
CREATE INDEX idx_journals_date ON journals(date);
CREATE INDEX idx_journals_author_date ON journals(author_id, date);
```

### 2.3 packages/schemas/src/api/validators.ts
```typescript
// 新規追加する内容
import { z } from 'zod';

// 日付文字列バリデーション
export const DateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
);

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

// 型推論
export type CreateJournalInput = z.infer<typeof CreateJournalSchema>;
export type UpdateJournalInput = z.infer<typeof UpdateJournalSchema>;
export type JournalListQuery = z.infer<typeof JournalListQuerySchema>;
```

### 2.4 packages/api/src/routes/journals.ts
```typescript
// 新規ファイル作成
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and, desc, count } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

import { db } from '../db';
import { journals, users } from '@repo/schemas/db/schema';
import {
  CreateJournalSchema,
  UpdateJournalSchema,
  JournalListQuerySchema,
  IdParamSchema,
} from '@repo/schemas/api/validators';
import { AppError, NotFoundError, ValidationError } from '@repo/schemas/api/errors';
import type { Bindings } from '../types';

const app = new Hono<{ Bindings: Bindings }>();

// GET /journals - 一覧取得
app.get('/', zValidator('query', JournalListQuerySchema), async (c) => {
  // 実装内容
});

// GET /journals/:id - 詳細取得
app.get('/:id', zValidator('param', IdParamSchema), async (c) => {
  // 実装内容
});

// POST /journals - 作成
app.post('/', zValidator('json', CreateJournalSchema), async (c) => {
  // 実装内容
});

// PUT /journals/:id - 更新
app.put('/:id', 
  zValidator('param', IdParamSchema),
  zValidator('json', UpdateJournalSchema),
  async (c) => {
    // 実装内容
  }
);

// DELETE /journals/:id - 削除
app.delete('/:id', zValidator('param', IdParamSchema), async (c) => {
  // 実装内容
});

export default app;
```

### 2.5 packages/api/src/index.ts
```typescript
// 既存ファイルに追加
import journalsRoutes from './routes/journals';

// ルート追加
app.route('/journals', journalsRoutes);
```

## 3. 実装時の注意点

### 3.1 エラーハンドリング
- 既存の `AppError`, `NotFoundError`, `ValidationError` クラスを使用
- データベースエラーの適切なキャッチと変換
- 外部キー制約違反の適切な処理

### 3.2 データベース操作
- Drizzle ORMのクエリビルダーを使用
- SQLインジェクション対策（パラメータ化クエリ）
- トランザクション処理（必要に応じて）

### 3.3 バリデーション
- 全入力値に対するZodスキーマバリデーション
- 日付形式の厳密な検証
- 外部キー（authorId）の存在確認

### 3.4 パフォーマンス
- ページネーション実装でのメモリ効率
- 適切なインデックス使用
- 不要なデータ取得の回避

## 4. 実装完了基準

- [ ] 全5つのAPIエンドポイントが正常に動作する
- [ ] バリデーションエラーが適切に処理される
- [ ] データベース制約が正しく機能する
- [ ] ページネーションが正常に動作する
- [ ] エラーレスポンスが既存パターンと一致する
- [ ] 型安全性が保たれている
- [ ] `npm run api:deploy` が成功する

## 5. 想定される課題と対策

### 5.1 マイグレーション関連
**課題**: 既存データベースとの整合性
**対策**: マイグレーションファイルでの外部キー制約確認

### 5.2 型定義関連
**課題**: スキーマと型定義の不整合
**対策**: Drizzle ORMの型推論を活用し、手動型定義を避ける

### 5.3 パフォーマンス関連
**課題**: 大量データでのページネーション性能
**対策**: 適切なインデックス設計とクエリ最適化

### 5.4 エラーハンドリング関連
**課題**: 一貫性のないエラーレスポンス
**対策**: 既存のエラークラス階層の徹底活用

この実装計画に従って段階的に実装を進めることで、要件と設計に沿った高品質なジャーナルAPIを効率的に構築できます。