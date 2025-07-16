import type { Config } from "drizzle-kit";

export default {
  schema: "../schemas/src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
} satisfies Config;
