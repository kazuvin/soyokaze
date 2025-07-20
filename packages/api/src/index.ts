import { Hono } from "hono";
import { cors } from 'hono/cors'
import { users, posts } from './routes'
import { AppError } from '@soyokaze/schemas/api/errors'

type Bindings = {
  ENV: string;
  DB: D1Database;
  PUBLIC_JWK_CACHE_KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

app.use('/*', cors())

// Basic health check endpoint
app.get("/", (c) => {
  return c.json({ message: "Hello from Soyokaze API!" });
});

app.route("/users", users);
app.route("/posts", posts);

app.onError((err, c) => {
  console.error(err)
  
  if (err instanceof AppError) {
    return c.json({ success: false, error: err.message }, err.statusCode)
  }
  
  return c.json({ success: false, error: err.message }, 500)
})

export default app;
export type ApiType = typeof app
