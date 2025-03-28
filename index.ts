import { Hono } from "hono";
import recipe from "./routes/recipes";
import category from "./routes/categories";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());

// Root route
app.get("/", (c) => {
  return c.json({ message: "Recipe API is running" });
});

app.route("/recipes", recipe);
app.route("/categories", category);

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3030,
});
