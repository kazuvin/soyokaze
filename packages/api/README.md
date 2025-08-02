# Soyokaze API

Cloudflare Workers上で動作するHonoフレームワークベースのAPIサービスです。

## 必要な環境

- Node.js 18以上
- pnpm
- Cloudflare アカウント
- Wrangler CLI

## セットアップ手順

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. Cloudflareアカウントの設定

Wrangler CLIにログインします：

```bash
npx wrangler login
```

### 3. Cloudflareリソースの作成

#### 3.1. D1データベースの作成

```bash
# D1データベースを作成
npx wrangler d1 create prod-soyokaze

# 出力されるdatabase_idをwrangler.jsonc内のdatabase_idに設定してください
```

#### 3.2. KVネームスペースの作成

```bash
# KVネームスペースを作成
npx wrangler kv namespace create "PUBLIC_JWK_CACHE_KV"

# 出力されるidをwrangler.jsonc内のkv_namespacesのidに設定してください
```

### 4. 設定ファイルの更新

`wrangler.jsonc`ファイルを開き、以下の値を手順3で取得したIDに更新してください：

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "prod-soyokaze",
      "database_id": "ここに手順3.1で取得したdatabase_idを設定",
      "migrations_dir": "migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "PUBLIC_JWK_CACHE_KV",
      "id": "ここに手順3.2で取得したidを設定"
    }
  ]
}
```

### 5. データベースマイグレーション

スキーマファイルが存在する場合、マイグレーションを実行します：

```bash
# マイグレーションファイルを生成
pnpm run generate

# ローカルデータベースにマイグレーションを適用
pnpm run local:migration

# 本番環境にマイグレーションを適用
pnpm run remote:migration
```

### 6. 開発環境での実行

```bash
pnpm run dev
```

これでローカル開発サーバーが起動し、`http://localhost:8787`でAPIにアクセスできます。

### 7. 本番環境へのデプロイ

```bash
pnpm run deploy
```

## 自動セットアップスクリプト

手動での設定を簡略化するため、自動セットアップスクリプトを用意しました：

```bash
# セットアップスクリプトを実行
pnpm run setup
```

または手動で実行する場合：

```bash
# 実行権限を付与
chmod +x scripts/setup.sh

# セットアップスクリプトを実行
./scripts/setup.sh
```

このスクリプトは以下の処理を自動で行います：
- D1データベースの作成
- KVネームスペースの作成
- wrangler.jsonc の自動更新
- 初期マイグレーションの実行

## 利用可能なコマンド

### 開発用
- `pnpm run dev` - 開発サーバーの起動
- `pnpm run generate` - マイグレーションファイルの生成
- `pnpm run local:migration` - ローカルDBへのマイグレーション適用

### 本番用
- `pnpm run deploy` - 本番環境へのデプロイ
- `pnpm run remote:migration` - 本番DBへのマイグレーション適用

## プロジェクト構造

```
src/
├── index.ts           # エントリーポイント
├── routes/            # ルート定義
├── services/          # ビジネスロジック
└── db/
    └── schemas/       # データベーススキーマ
migrations/            # マイグレーションファイル
wrangler.jsonc         # Cloudflare Workers設定
drizzle.config.ts      # Drizzle ORM設定
```

## 環境変数とバインディング

### 環境変数 (vars)
- `PROJECT_ID`: プロジェクトID
- `PUBLIC_JWK_CACHE_KEY`: JWKキャッシュキー

### バインディング
- `DB`: D1データベース接続
- `PUBLIC_JWK_CACHE_KV`: KVストレージ接続

## トラブルシューティング

### よくある問題

1. **database_idまたはKV idが見つからない**
   - `npx wrangler d1 list` でデータベース一覧を確認
   - `npx wrangler kv namespace list` でKVネームスペース一覧を確認

2. **マイグレーションエラー**
   - スキーマファイルが正しく配置されているか確認
   - `pnpm run generate` でマイグレーションファイルが生成されているか確認

3. **デプロイエラー**
   - Cloudflareアカウントにログインしているか確認（`npx wrangler whoami`）
   - 必要な権限があるか確認

### ログの確認

```bash
# リアルタイムログの確認
npx wrangler tail

# デプロイされたWorkerの確認
npx wrangler deployments list
```

## ドキュメント

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)