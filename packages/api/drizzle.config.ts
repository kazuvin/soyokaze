import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schemas",
  out: "./migrations",
  dialect: "sqlite",
} satisfies Config;
