#!/usr/bin/env node

/**
 * Zodスキーマ生成スクリプト
 * OpenAPIからZodスキーマを生成し、型定義も作成する
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const openApiPath = join(
  projectRoot,
  "generated/@typespec/openapi3/openapi.yaml",
);
const zodOutputDir = join(projectRoot, "generated/zod");

// 出力ディレクトリの作成
if (!existsSync(zodOutputDir)) {
  mkdirSync(zodOutputDir, { recursive: true });
}

/**
 * OpenAPIタイプをZodスキーマに変換
 */
function convertToZodSchema(schema, name) {
  if (!schema) return "z.unknown()";

  switch (schema.type) {
    case "string":
      if (schema.format === "date-time") {
        return "z.string().datetime()";
      }
      if (schema.format === "email") {
        return "z.string().email()";
      }
      if (schema.enum) {
        const enumValues = schema.enum.map((val) => `"${val}"`).join(" | ");
        return `z.enum([${schema.enum.map((val) => `"${val}"`).join(", ")}])`;
      }
      return "z.string()";

    case "integer":
    case "number":
      return "z.number()";

    case "boolean":
      return "z.boolean()";

    case "array":
      const itemSchema = convertToZodSchema(schema.items, `${name}Item`);
      return `z.array(${itemSchema})`;

    case "object":
      if (schema.properties) {
        const properties = Object.entries(schema.properties)
          .map(([key, prop]) => {
            const propSchema = convertToZodSchema(
              prop,
              `${name}${key.charAt(0).toUpperCase()}${key.slice(1)}`,
            );
            const isRequired = schema.required && schema.required.includes(key);
            return `  ${key}: ${propSchema}${isRequired ? "" : ".optional()"}`;
          })
          .join(",\n");

        return `z.object({\n${properties}\n})`;
      }
      return "z.object({})";

    default:
      return "z.unknown()";
  }
}

/**
 * メイン処理
 */
function main() {
  try {
    console.log("🔄 Generating Zod schemas from OpenAPI...");

    // OpenAPIファイルの読み込み
    if (!existsSync(openApiPath)) {
      console.error("❌ OpenAPI file not found. Run compile first.");
      process.exit(1);
    }

    const openApiContent = readFileSync(openApiPath, "utf8");
    const openApiSpec = yaml.load(openApiContent);

    if (!openApiSpec.components || !openApiSpec.components.schemas) {
      console.log("⚠️  No schemas found in OpenAPI spec.");
      return;
    }

    const schemas = openApiSpec.components.schemas;

    // Zodスキーマの生成（スキーマと型定義を統合）
    let zodSchemas = `import { z } from 'zod';\n\n`;

    // スキーマ定義の生成
    Object.entries(schemas).forEach(([name, schema]) => {
      const zodSchema = convertToZodSchema(schema, name);
      // ドット記号を含む名前を有効なJavaScript識別子に変換
      const cleanName = name.replace(/\./g, "");
      const schemaName = `${cleanName}Schema`;

      zodSchemas += `export const ${schemaName} = ${zodSchema};\n`;
      zodSchemas += `export type ${cleanName} = z.infer<typeof ${schemaName}>;\n\n`;
    });

    // ファイル出力（zodディレクトリのみ）
    writeFileSync(join(zodOutputDir, "index.ts"), zodSchemas);

    console.log(
      `✅ Generated Zod schemas for ${Object.keys(schemas).length} types`,
    );
    console.log(`   📁 Zod schemas with types: ${zodOutputDir}/index.ts`);
  } catch (error) {
    console.error("❌ Error generating Zod schemas:", error.message);
    process.exit(1);
  }
}

main();

