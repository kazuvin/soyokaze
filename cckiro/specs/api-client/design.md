# 共通 API クライアント 設計書

## 1. アーキテクチャ設計

### 1.1 システム構成
```
┌─────────────────────────────────────────────────────────┐
│                Mobile/Web Applications                  │
├─────────────────────────────────────────────────────────┤
│               @soyokaze/client Package                  │
│  ┌─────────────────┐  ┌─────────────────────────────────┐│
│  │  createApiClient │  │     Individual Services        ││
│  │   (Factory)     │  │  ┌─────────────────────────────┐││
│  │                 │  │  │ journal-service.ts          │││
│  │                 │  │  │ user-service.ts             │││
│  │                 │  │  │ post-service.ts             │││
│  │                 │  │  └─────────────────────────────┘││
│  └─────────────────┘  └─────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────┐ │
│  │             Common API Client                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │ │
│  │  │ HTTP Client │  │ Validation  │  │ Error       │ │ │
│  │  │ (Hono hc)   │  │ (Zod)       │  │ Handling    │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                @soyokaze/schemas Package                │
│  ┌─────────────────┐  ┌─────────────────────────────────┐│
│  │ Zod Schemas     │  │ TypeScript Types                ││
│  │ (validators.ts) │  │ (types.ts)                      ││
│  └─────────────────┘  └─────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                    Hono API Server                      │
│  ┌─────────────────┐  ┌─────────────────────────────────┐│
│  │ /api/journals   │  │ Type Export: ApiType            ││
│  │ /api/users      │  │ (Hono app type inference)       ││
│  │ /api/posts      │  │                                 ││
│  └─────────────────┘  └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 1.2 レイヤー構成
1. **Factory Layer**: クライアントインスタンス生成と設定管理
2. **Service Layer**: API別のビジネスロジック（journals、users、posts）
3. **HTTP Client Layer**: Honoクライアントベースの通信処理
4. **Validation Layer**: Zodスキーマによる入出力検証
5. **Error Handling Layer**: 統一されたエラー処理

## 2. パッケージ設計

### 2.1 ディレクトリ構造
```
packages/client/
├── src/
│   ├── index.ts                    # メインエントリーポイント
│   ├── api-client.ts               # 共通APIクライアント基盤
│   ├── services/
│   │   ├── index.ts                # サービス一括エクスポート
│   │   ├── journal-service.ts      # ジャーナルAPIサービス
│   │   ├── user-service.ts         # ユーザーAPIサービス
│   │   └── post-service.ts         # 投稿APIサービス
│   ├── types/
│   │   ├── index.ts                # 型定義一括エクスポート
│   │   ├── api.ts                  # API共通型定義
│   │   ├── config.ts               # 設定型定義
│   │   └── errors.ts               # エラー型定義
│   └── utils/
│       ├── index.ts                # ユーティリティ一括エクスポート
│       ├── validation.ts           # バリデーション実装
│       ├── error-handling.ts       # エラーハンドリング実装
│       └── config.ts               # 設定管理
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

### 2.2 package.json 設計
```json
{
  "name": "@soyokaze/client",
  "version": "1.0.0",
  "description": "Type-safe API client for Soyokaze applications",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    },
    "./journals": {
      "types": "./dist/services/journal-service.d.ts",
      "import": "./dist/services/journal-service.js",
      "require": "./dist/services/journal-service.js"
    },
    "./users": {
      "types": "./dist/services/user-service.d.ts",
      "import": "./dist/services/user-service.js",
      "require": "./dist/services/user-service.js"
    },
    "./posts": {
      "types": "./dist/services/post-service.d.ts",
      "import": "./dist/services/post-service.js",
      "require": "./dist/services/post-service.js"
    }
  },
  "files": ["dist"],
  "dependencies": {
    "hono": "^4.x.x",
    "zod": "^3.x.x",
    "@soyokaze/schemas": "workspace:*"
  },
  "peerDependencies": {
    "typescript": "^5.x.x"
  }
}
```

## 3. 型設計

### 3.1 設定型定義
```typescript
// types/config.ts
export interface ApiClientConfig {
  baseUrl: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
  headers?: Record<string, string>
  // 将来の認証対応
  auth?: {
    type: 'bearer' | 'apikey'
    token: string
  }
}

export interface ApiClientOptions extends Partial<ApiClientConfig> {
  baseUrl: string // 必須
}
```

### 3.2 共通API型定義
```typescript
// types/api.ts
import type { ApiResponse, PaginatedResponse } from '@soyokaze/schemas/api/types'

// 基本的なCRUD操作の型
export interface BaseApiService<T, CreateInput, UpdateInput> {
  list(params?: ListParams): Promise<ApiResponse<PaginatedResponse<T>>>
  getById(id: number): Promise<ApiResponse<T>>
  create(data: CreateInput): Promise<ApiResponse<T>>
  update(id: number, data: UpdateInput): Promise<ApiResponse<T>>
  delete(id: number): Promise<ApiResponse<{ message: string; deletedId: number }>>
}

// ページネーション共通パラメータ
export interface ListParams {
  page?: number
  limit?: number
}

// リクエスト/レスポンス型
export interface ApiRequest<T = unknown> {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, unknown>
  data?: T
  headers?: Record<string, string>
}

export interface ApiResponseMeta {
  timestamp: string
  requestId?: string
  version?: string
}
```

### 3.3 エラー型定義
```typescript
// types/errors.ts
import type { AppError } from '@soyokaze/schemas/api/errors'

export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string, public originalError?: Error) {
    super(message, 'NETWORK_ERROR', 0, originalError)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApiClientError {
  constructor(message: string, public validationErrors?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, validationErrors)
    this.name = 'ValidationError'
  }
}

export class TimeoutError extends ApiClientError {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`, 'TIMEOUT_ERROR', 408)
    this.name = 'TimeoutError'
  }
}

// エラー判定ヘルパー関数
export const isApiClientError = (error: unknown): error is ApiClientError =>
  error instanceof ApiClientError

export const isNetworkError = (error: unknown): error is NetworkError =>
  error instanceof NetworkError

export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError
```

## 4. サービス設計

### 4.1 ジャーナルサービス設計
```typescript
// services/journal-service.ts
import type {
  Journal,
  CreateJournalInput,
  UpdateJournalInput,
  JournalListQuery
} from '@soyokaze/schemas/api/types'
import type { BaseApiService } from '../types/api'

export interface JournalListParams extends JournalListQuery {
  page?: number
  limit?: number
  authorId?: number
  date?: string // YYYY-MM-DD
}

export interface JournalService extends 
  Omit<BaseApiService<Journal, CreateJournalInput, UpdateJournalInput>, 'list'> {
  
  // 拡張された一覧取得（フィルタ対応）
  list(params?: JournalListParams): Promise<ApiResponse<PaginatedResponse<Journal>>>
  
  // ジャーナル固有メソッド
  getByDate(date: string): Promise<ApiResponse<Journal[]>>
  getByAuthor(authorId: number, params?: ListParams): Promise<ApiResponse<PaginatedResponse<Journal>>>
  searchByTitle(title: string, params?: ListParams): Promise<ApiResponse<PaginatedResponse<Journal>>>
}
```

### 4.2 ユーザーサービス設計
```typescript
// services/user-service.ts
import type { User, CreateUserInput } from '@soyokaze/schemas/api/types'
import type { BaseApiService } from '../types/api'

// ユーザー更新は一部のフィールドのみ
export interface UpdateUserInput {
  name?: string
  email?: string
  role?: 'admin' | 'user'
}

export interface UserService extends 
  BaseApiService<User, CreateUserInput, UpdateUserInput> {
  
  // ユーザー固有メソッド
  getByEmail(email: string): Promise<ApiResponse<User>>
  searchByName(name: string, params?: ListParams): Promise<ApiResponse<PaginatedResponse<User>>>
}
```

### 4.3 投稿サービス設計
```typescript
// services/post-service.ts
import type { Post, CreatePostInput } from '@soyokaze/schemas/api/types'
import type { BaseApiService } from '../types/api'

export interface UpdatePostInput {
  title?: string
  content?: string
  status?: 'draft' | 'published'
}

export interface PostListParams extends ListParams {
  authorId?: number
  status?: 'draft' | 'published'
}

export interface PostService extends 
  Omit<BaseApiService<Post, CreatePostInput, UpdatePostInput>, 'list'> {
  
  // 拡張された一覧取得（フィルタ対応）
  list(params?: PostListParams): Promise<ApiResponse<PaginatedResponse<Post>>>
  
  // 投稿固有メソッド
  getByAuthor(authorId: number, params?: ListParams): Promise<ApiResponse<PaginatedResponse<Post>>>
  getByStatus(status: 'draft' | 'published', params?: ListParams): Promise<ApiResponse<PaginatedResponse<Post>>>
  publish(id: number): Promise<ApiResponse<Post>>
  unpublish(id: number): Promise<ApiResponse<Post>>
}
```

## 5. HTTP クライアント設計

### 5.1 共通APIクライアント基盤
```typescript
// api-client.ts
import { hc } from 'hono/client'
import type { ApiType } from '@soyokaze/api' // Honoアプリの型
import type { ApiClientConfig, ApiRequest } from './types'

export class ApiClient {
  private client: ReturnType<typeof hc<ApiType>>
  private config: ApiClientConfig

  constructor(config: ApiClientConfig) {
    this.config = config
    this.client = hc<ApiType>(config.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })
  }

  // 基本的なHTTPメソッド
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return this.request({ url, method: 'GET', params })
  }

  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.request({ url, method: 'POST', data })
  }

  async put<T, D = unknown>(url: string, data?: D): Promise<T> {
    return this.request({ url, method: 'PUT', data })
  }

  async delete<T>(url: string): Promise<T> {
    return this.request({ url, method: 'DELETE' })
  }

  // 統一されたリクエスト処理
  private async request<T>(request: ApiRequest): Promise<T> {
    try {
      // タイムアウト処理
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new TimeoutError(this.config.timeout || 30000)), 
                   this.config.timeout || 30000)
      })

      // 実際のリクエスト実行
      const responsePromise = this.executeRequest<T>(request)
      
      const response = await Promise.race([responsePromise, timeoutPromise])
      return response
    } catch (error) {
      return this.handleError(error, request)
    }
  }

  // Honoクライアントでのリクエスト実行
  private async executeRequest<T>(request: ApiRequest): Promise<T> {
    // Honoクライアントを使用したタイプセーフなリクエスト実行
    // 実装は具体的なエンドポイントに応じて変更
    throw new Error('Implementation required for specific endpoints')
  }

  // エラーハンドリング
  private handleError(error: unknown, request: ApiRequest): never {
    if (error instanceof TimeoutError) {
      throw error
    }

    if (error instanceof Error) {
      throw new NetworkError(`Request failed: ${error.message}`, error)
    }

    throw new ApiClientError('Unknown error occurred', 'UNKNOWN_ERROR')
  }
}
```

### 5.2 バリデーション設計
```typescript
// utils/validation.ts
import { z } from 'zod'
import type { ApiResponse } from '@soyokaze/schemas/api/types'
import { ValidationError } from '../types/errors'

// レスポンスバリデーション
export function validateApiResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'Response validation failed',
        error.errors
      )
    }
    throw error
  }
}

// APIレスポンス形式のバリデーション
export function validateResponse<T>(
  data: unknown,
  dataSchema: z.ZodSchema<T>
): T {
  const apiResponseSchema = z.object({
    success: z.literal(true),
    data: dataSchema,
  }).or(z.object({
    success: z.literal(false),
    error: z.string(),
  }))

  const response = validateApiResponse(data, apiResponseSchema)
  
  if (!response.success) {
    throw new ApiClientError(
      response.error,
      'API_ERROR',
      400,
      response
    )
  }

  return response.data
}

// リクエストデータバリデーション
export function validateRequestData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        'Request validation failed',
        error.errors
      )
    }
    throw error
  }
}
```

## 6. Factory パターン設計

### 6.1 メインファクトリー
```typescript
// index.ts
import { ApiClient } from './api-client'
import { createJournalService } from './services/journal-service'
import { createUserService } from './services/user-service'
import { createPostService } from './services/post-service'
import type { ApiClientOptions } from './types'

export interface SoyokazeApiClient {
  journals: JournalService
  users: UserService
  posts: PostService
  // 生のクライアントへのアクセス（上級者向け）
  _client: ApiClient
}

export function createApiClient(options: ApiClientOptions): SoyokazeApiClient {
  const config = {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    ...options,
  }

  const client = new ApiClient(config)

  return {
    journals: createJournalService(client),
    users: createUserService(client),
    posts: createPostService(client),
    _client: client,
  }
}

// 個別サービス用ファクトリー
export function createJournalClient(options: ApiClientOptions) {
  const client = new ApiClient({ ...options })
  return createJournalService(client)
}

export function createUserClient(options: ApiClientOptions) {
  const client = new ApiClient({ ...options })
  return createUserService(client)
}

export function createPostClient(options: ApiClientOptions) {
  const client = new ApiClient({ ...options })
  return createPostService(client)
}

// 型とエラークラスの再エクスポート
export * from './types'
export * from './services'
export {
  ApiClientError,
  NetworkError,
  ValidationError,
  TimeoutError,
  isApiClientError,
  isNetworkError,
  isValidationError,
} from './types/errors'
```

## 7. エラーハンドリング設計

### 7.1 統一エラー処理
```typescript
// utils/error-handling.ts
export class ErrorHandler {
  static handle(error: unknown): never {
    // API エラーレスポンス
    if (this.isApiErrorResponse(error)) {
      throw new ApiClientError(
        error.error,
        'API_ERROR',
        this.extractStatusCode(error)
      )
    }

    // ネットワークエラー
    if (this.isNetworkError(error)) {
      throw new NetworkError('Network request failed', error as Error)
    }

    // バリデーションエラー
    if (this.isValidationError(error)) {
      throw new ValidationError('Data validation failed', error)
    }

    // 未知のエラー
    throw new ApiClientError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500,
      error
    )
  }

  private static isApiErrorResponse(error: unknown): error is { success: false; error: string } {
    return typeof error === 'object' && 
           error !== null && 
           'success' in error && 
           error.success === false
  }

  private static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message.includes('fetch')
  }

  private static isValidationError(error: unknown): boolean {
    return error instanceof z.ZodError
  }

  private static extractStatusCode(error: unknown): number {
    // レスポンスオブジェクトからステータスコードを抽出
    return 400 // デフォルト
  }
}
```

## 8. 設定管理設計

### 8.1 環境別設定
```typescript
// utils/config.ts
export const DEFAULT_CONFIG: Partial<ApiClientConfig> = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}

export const DEVELOPMENT_CONFIG: Partial<ApiClientConfig> = {
  ...DEFAULT_CONFIG,
  baseUrl: 'http://localhost:8787/api',
  timeout: 60000, // 開発時は長めのタイムアウト
}

export const PRODUCTION_CONFIG: Partial<ApiClientConfig> = {
  ...DEFAULT_CONFIG,
  timeout: 10000, // 本番は短めのタイムアウト
  retryAttempts: 2,
}

export function createConfigForEnvironment(
  env: 'development' | 'production' | 'test',
  overrides: Partial<ApiClientConfig> = {}
): Partial<ApiClientConfig> {
  const baseConfig = env === 'development' 
    ? DEVELOPMENT_CONFIG 
    : PRODUCTION_CONFIG

  return {
    ...baseConfig,
    ...overrides,
  }
}
```

## 9. 拡張性設計

### 9.1 プラグインシステム（将来実装）
```typescript
// 将来の拡張ポイント
export interface ApiClientPlugin {
  name: string
  beforeRequest?(request: ApiRequest): ApiRequest | Promise<ApiRequest>
  afterResponse?(response: unknown): unknown | Promise<unknown>
  onError?(error: unknown): unknown | Promise<unknown>
}

// プラグイン対応のクライアント（将来実装）
export class ExtendableApiClient extends ApiClient {
  private plugins: ApiClientPlugin[] = []

  use(plugin: ApiClientPlugin): this {
    this.plugins.push(plugin)
    return this
  }
}
```

### 9.2 キャッシュ機能（将来実装）
```typescript
// 将来のキャッシュ機能
export interface CacheOptions {
  ttl: number // Time to live in milliseconds
  key?: string
  tags?: string[]
}

export interface CachedApiClient extends ApiClient {
  getCached<T>(url: string, options: CacheOptions): Promise<T>
  invalidateCache(tags: string[]): void
}
```

この設計により、型安全で拡張性のある共通APIクライアントを効率的に実装できます。Honoの型推論を活用しながら、既存のスキーマシステムとシームレスに統合し、Mobile・Web両方で使用可能なライブラリとなります。