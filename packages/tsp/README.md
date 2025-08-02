# Soyokaze API TypeSpec

TypeSpec定義を使用したSoyokaze APIの仕様管理

## ディレクトリ構造

```
tsp/
├── main.tsp              # エントリーポイント
├── lib/
│   └── index.tsp         # サービス設定・共通ライブラリ
├── models/
│   ├── common.tsp        # 共通型定義・バリデーションエイリアス
│   └── auth.tsp          # 認証関連のモデル定義
├── services/
│   └── auth.tsp          # 認証API定義
├── package.json          # パッケージ設定・スクリプト
├── tspconfig.yaml        # TypeSpecコンパイラ設定
└── tsp-output/           # 生成されたスキーマファイル
    └── @typespec/openapi3/
        └── openapi.yaml
```

## 使用方法

```bash
# TypeSpecのコンパイル
pnpm run compile

# ファイル監視モード
pnpm run watch

# 出力ファイルのクリーンアップ
pnpm run clean
```

## 開発フロー

1. TypeSpecファイル（`.tsp`）を編集
2. `pnpm run compile` でコンパイル
3. `tsp-output/@typespec/openapi3/openapi.yaml` で生成されたOpenAPI仕様を確認
4. 必要に応じて仕様を調整し、再度コンパイル

## ファイル構成の原則

### models/
- **common.tsp**: 全体で使用される共通型、エラーレスポンス、ページネーション等
- **auth.tsp**: 認証・ユーザー関連のモデル定義

### services/
- **auth.tsp**: 認証・ユーザープロフィール関連のAPI定義

### lib/
- **index.tsp**: サービス全体の設定、セキュリティスキーマ、メタデータ

## 新しい機能の追加

1. **新しいモデル**: `models/` に機能別のファイルを作成
2. **新しいAPI**: `services/` に対応するAPIファイルを作成  
3. **main.tsp**: 新しいファイルをimport文で追加

例：
```typescript
// models/product.tsp を追加した場合
import "./models/product.tsp";
import "./services/product.tsp";
```