// middleware.ts
import type { Context, Next } from "hono";

export async function logger(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const status = c.res.status;
  const duration = Date.now() - start;

  console.log(`${method} ${path} - ${status} (${duration}ms)`);
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("Unhandled error:", error);
    return c.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}
