# npm package.json のフィールド解説

## 概要

npm package.json の `main`, `types`, `exports` フィールドの役割と、monorepo での他パッケージからの import 可能性について。

## 各フィールドの役割

### 1. `main` フィールド
- **役割**: パッケージのデフォルトエントリーポイントを指定
- **使用例**: `import something from '@soyokaze/schemas'` でインポートされるファイル
- **現在の設定**: `"main": "src/index.ts"`

### 2. `types` フィールド
- **役割**: TypeScript の型定義ファイルの場所を指定
- **使用例**: TypeScript コンパイラが型チェックに使用
- **現在の設定**: `"types": "src/index.ts"`

### 3. `exports` フィールド
- **役割**: パッケージのサブパス（特定のファイル）へのアクセスを制御
- **使用例**: `import { users } from '@soyokaze/schemas/db/schema'` のような細かい import を可能にする
- **現在の設定**: 
  ```json
  {
    ".": "./src/index.ts",
    "./db/schema": "./src/db/schema.ts",
    "./api/validators": "./src/api/validators.ts"
  }
  ```

## monorepo での import 可能性

### 現在の状況
- **API パッケージ**: `@soyokaze/schemas` を `file:../schemas` で参照
- **実際の import 例**:
  ```typescript
  import * as schema from '@soyokaze/schemas/db/schema'
  import { CreateUserSchema } from '@soyokaze/schemas/api/validators'
  import { NotFoundError } from '@soyokaze/schemas/api/errors'
  ```

### 問題点
- **TypeScript ソース直接参照**: 現在は `.ts` ファイルを直接参照しているため、以下の問題が発生する可能性：
  1. **型チェック時の問題**: 他パッケージで TypeScript コンパイラが schemas の型を正しく解決できない場合がある
  2. **ビルド時の問題**: production ビルドでは通常 `.js` ファイルが必要
  3. **依存関係の問題**: schemas パッケージの依存関係が他パッケージに影響する

### 推奨解決策

1. **ビルドプロセスの追加**:
   ```json
   {
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "default": "./dist/index.js"
       },
       "./db/schema": {
         "types": "./dist/db/schema.d.ts",
         "default": "./dist/db/schema.js"
       }
     }
   }
   ```

2. **scripts の追加**:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch",
       "clean": "rm -rf dist"
     }
   }
   ```

3. **tsconfig.json の設定**:
   ```json
   {
     "compilerOptions": {
       "outDir": "./dist",
       "declaration": true,
       "declarationMap": true
     }
   }
   ```

## 現在の設定での動作確認

実際に API パッケージで以下の import が動作していることを確認：
- `@soyokaze/schemas/db/schema` - データベーススキーマ
- `@soyokaze/schemas/api/validators` - バリデーション用スキーマ
- `@soyokaze/schemas/api/errors` - エラー定義

## 結論

現在の設定でも他パッケージからの import は可能だが、production 環境や型安全性を考慮すると、ビルドプロセスを追加して `.js` と `.d.ts` ファイルを生成することを推奨する。