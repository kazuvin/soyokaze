#!/bin/bash

# Soyokaze API 自動セットアップスクリプト
# Cloudflare D1データベースとKVネームスペースを自動で作成し、設定ファイルを更新します

set -e

echo "🚀 Soyokaze API セットアップを開始します..."

# カラーコード定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログイン状況を確認
echo -e "${BLUE}📋 Cloudflareアカウントのログイン状況を確認中...${NC}"
if ! npx wrangler whoami > /dev/null 2>&1; then
    echo -e "${RED}❌ Cloudflareにログインしていません。${NC}"
    echo -e "${YELLOW}次のコマンドでログインしてください: npx wrangler login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Cloudflareにログイン済みです${NC}"

# D1データベースの作成
echo -e "${BLUE}📊 D1データベースを作成中...${NC}"
DB_OUTPUT=$(npx wrangler d1 create prod-soyokaze 2>&1)

# データベースIDを抽出
DATABASE_ID=$(echo "$DB_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$DATABASE_ID" ]; then
    echo -e "${YELLOW}⚠️  データベースが既に存在する可能性があります。既存のデータベースを確認中...${NC}"
    
    # 既存のデータベース一覧を取得
    EXISTING_DB=$(npx wrangler d1 list | grep "prod-soyokaze" | head -1)
    if [ ! -z "$EXISTING_DB" ]; then
        DATABASE_ID=$(echo "$EXISTING_DB" | awk '{print $2}')
        echo -e "${GREEN}✅ 既存のデータベースを使用します: ${DATABASE_ID}${NC}"
    else
        echo -e "${RED}❌ データベースの作成に失敗しました${NC}"
        echo "$DB_OUTPUT"
        exit 1
    fi
else
    echo -e "${GREEN}✅ D1データベースが作成されました: ${DATABASE_ID}${NC}"
fi

# KVネームスペースの作成
echo -e "${BLUE}🗄️  KVネームスペースを作成中...${NC}"
KV_OUTPUT=$(npx wrangler kv namespace create "PUBLIC_JWK_CACHE_KV" 2>&1)

# KV IDを抽出
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$KV_ID" ]; then
    echo -e "${YELLOW}⚠️  KVネームスペースが既に存在する可能性があります。既存のネームスペースを確認中...${NC}"
    
    # 既存のKVネームスペース一覧を取得
    EXISTING_KV=$(npx wrangler kv namespace list | grep "PUBLIC_JWK_CACHE_KV" | head -1)
    if [ ! -z "$EXISTING_KV" ]; then
        KV_ID=$(echo "$EXISTING_KV" | jq -r '.id')
        echo -e "${GREEN}✅ 既存のKVネームスペースを使用します: ${KV_ID}${NC}"
    else
        echo -e "${RED}❌ KVネームスペースの作成に失敗しました${NC}"
        echo "$KV_OUTPUT"
        exit 1
    fi
else
    echo -e "${GREEN}✅ KVネームスペースが作成されました: ${KV_ID}${NC}"
fi

# wrangler.jsonc ファイルを更新
echo -e "${BLUE}⚙️  設定ファイルを更新中...${NC}"

# バックアップを作成
cp wrangler.jsonc wrangler.jsonc.backup

# 一時的なJSONファイルを作成（コメントを削除）
sed 's|//.*||g' wrangler.jsonc | jq --arg db_id "$DATABASE_ID" --arg kv_id "$KV_ID" '
  .d1_databases[0].database_id = $db_id |
  .kv_namespaces[0].id = $kv_id
' > wrangler.temp.json

# JSONファイルをJSONCフォーマットに戻す（コメントを復元）
cat > wrangler.jsonc << EOF
{
  "\$schema": "node_modules/wrangler/config-schema.json",
  "name": "soyokaze-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-05-29",
  // "compatibility_flags": [
  //   "nodejs_compat"
  // ],
  "vars": {
    "PROJECT_ID": "soyokaze",
    "PUBLIC_JWK_CACHE_KEY": "public-jwk-cache"
  },
  "kv_namespaces": [
    {
      "binding": "PUBLIC_JWK_CACHE_KV",
      "id": "$KV_ID"
    }
  ],

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "prod-soyokaze",
      "database_id": "$DATABASE_ID",
      "migrations_dir": "migrations"
    }
  ]
  // "r2_buckets": [
  //   {
  //     "binding": "MY_BUCKET",
  //     "bucket_name": "my-bucket"
  //   }
  // ],
  // "ai": {
  //   "binding": "AI"
  // },
  // "observability": {
  //   "enabled": true,
  //   "head_sampling_rate": 1
  // }
}
EOF

rm -f wrangler.temp.json

echo -e "${GREEN}✅ 設定ファイルが更新されました${NC}"

# マイグレーションの実行（スキーマファイルが存在する場合）
if [ -f "src/db/schemas/index.ts" ] && [ -s "src/db/schemas/index.ts" ]; then
    echo -e "${BLUE}📦 データベースマイグレーションを実行中...${NC}"
    
    # マイグレーションファイルを生成
    pnpm run generate
    
    # ローカルマイグレーションを適用
    pnpm run local:migration
    
    echo -e "${GREEN}✅ マイグレーションが完了しました${NC}"
else
    echo -e "${YELLOW}⚠️  スキーマファイルが見つからないため、マイグレーションをスキップします${NC}"
fi

echo ""
echo -e "${GREEN}🎉 セットアップが完了しました！${NC}"
echo ""
echo -e "${BLUE}📊 作成されたリソース:${NC}"
echo -e "  D1 Database ID: ${DATABASE_ID}"
echo -e "  KV Namespace ID: ${KV_ID}"
echo ""
echo -e "${BLUE}🚀 次のステップ:${NC}"
echo -e "  1. 開発サーバーを起動: ${YELLOW}pnpm run dev${NC}"
echo -e "  2. 本番環境にデプロイ: ${YELLOW}pnpm run deploy${NC}"
echo ""
echo -e "${BLUE}💡 便利なコマンド:${NC}"
echo -e "  - ログの確認: ${YELLOW}npx wrangler tail${NC}"
echo -e "  - D1データベース一覧: ${YELLOW}npx wrangler d1 list${NC}"
echo -e "  - KVネームスペース一覧: ${YELLOW}npx wrangler kv namespace list${NC}"