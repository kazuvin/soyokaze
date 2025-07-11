# OpenAPI 分割管理

このディレクトリには分割された OpenAPI ファイルが格納されています。

## ディレクトリ構造

```
packages/schemas/
├── openapi.yaml              # メインファイル（参照統合用）
├── components/
│   ├── schemas/              # データスキーマ定義
│   │   ├── user.yaml
│   │   ├── create-user-request.yaml
│   │   ├── update-user-request.yaml
│   │   └── common.yaml       # 共通スキーマ（Error, Pagination等）
│   ├── responses/            # レスポンス定義
│   │   ├── success.yaml      # 成功レスポンス
│   │   └── errors.yaml       # エラーレスポンス
│   └── parameters/           # パラメータ定義
│       ├── pagination.yaml   # ページネーション
│       └── user.yaml         # ユーザー関連パラメータ
└── paths/                    # API パス定義
    └── users/
        ├── users.yaml        # /users エンドポイント
        └── user-id.yaml      # /users/{id} エンドポイント
```

## 使用方法

### 1. 統合ファイルの生成

分割されたファイルを1つの統合ファイルに結合します：

```bash
npm run build:openapi
```

これにより `openapi-unified.yaml` が生成されます。

### 2. TypeScript型とクライアントの生成

統合ファイルから TypeScript 型とクライアントを生成します：

```bash
npm run generate
```

### 3. 開発ワークフロー

1. 分割ファイルを編集
2. `npm run build:openapi` で統合
3. `npm run generate` で型生成
4. `npm run build` でビルド

## ファイル編集ガイド

### 新しいリソースの追加

1. **スキーマ定義**: `components/schemas/` に新しいファイルを作成
2. **パラメータ定義**: `components/parameters/` に追加
3. **レスポンス定義**: `components/responses/` に追加
4. **パス定義**: `paths/` 下に適切なディレクトリ構造で作成
5. **メインファイル更新**: `openapi.yaml` に参照を追加

### 参照の書き方

相対パスを使用して他のファイルを参照します：

```yaml
# スキーマ参照
$ref: '../schemas/user.yaml'

# 特定のキー参照
$ref: '../schemas/common.yaml#/Error'

# 同一階層
$ref: './other-file.yaml'
```

### ベストプラクティス

1. **機能別分割**: 関連するスキーマとパスは同じディレクトリにまとめる
2. **共通コンポーネント**: 再利用可能な要素は `common.yaml` に配置
3. **命名規則**: ファイル名は kebab-case を使用
4. **循環参照回避**: 依存関係を明確にし、循環参照を避ける

## 統合処理について

`scripts/build-openapi.js` は以下の処理を行います：

1. `openapi.yaml` を起点として全ての `$ref` を解決
2. 外部ファイルの内容を統合してインライン化
3. 循環参照を検出・警告
4. 統合された1つのYAMLファイルを出力

この統合ファイルは `openapi-zod-client` で正常に処理できる形式になります。