import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { ratings } from "../schema";

const rating = new Hono();

rating.delete("/ratings/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Check if rating exists
    const [existingRating] = await db
      .select()
      .from(ratings)
      .where(eq(ratings.id, id));

    if (!existingRating) {
      return c.json({ error: "Rating not found" }, 404);
    }

    // Delete the rating
    await db.delete(ratings).where(eq(ratings.id, id));

    return c.json(204);
  } catch (error) {
    console.error("Error deleting rating:", error);
    return c.json({ error: "Failed to delete rating" }, 500);
  }
});
