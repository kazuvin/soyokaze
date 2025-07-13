import { Hono } from "hono";

type Bindings = {
  ENV: string;
  // Add your environment variables here
  // DB: D1Database;
  // PUBLIC_JWK_CACHE_KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

// Basic health check endpoint
app.get("/", (c) => {
  return c.json({ message: "Hello from your-app-name API!" });
});

// Add your routes here
// app.route("/users", usersRouter);
// app.route("/posts", postsRouter);

export default app;
