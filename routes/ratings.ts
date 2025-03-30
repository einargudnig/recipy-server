import { zValidator } from "@hono/zod-validator";
import { ratings, recipes } from "../schema";
import { ratingSchema } from "../validation";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";

const rating = new Hono();

rating.post(
  "/recipes/:id/ratings",
  zValidator("json", ratingSchema),
  async (c) => {
    const recipeId = c.req.param("id");

    try {
      // Check if recipe exists
      const [recipe] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId));

      if (!recipe) {
        return c.json({ error: "Recipe not found" }, 404);
      }

      // The validator middleware has already validated the body
      const body = c.req.valid("json");

      const [rating] = await db
        .insert(ratings)
        .values({
          recipeId,
          rating: body.rating,
          comment: body.comment,
        })
        .returning();

      return c.json(rating, 201);
    } catch (error) {
      console.error("Error creating rating:", error);
      return c.json({ error: "Failed to create rating" }, 500);
    }
  },
);

rating.get("/recipes/:id/ratings", async (c) => {
  const recipeId = c.req.param("id");

  try {
    // Check if recipe exists
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const recipeRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.recipeId, recipeId));

    return c.json(recipeRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return c.json({ error: "Failed to fetch ratings" }, 500);
  }
});

rating.get("/recipes/:id/average-rating", async (c) => {
  const recipeId = c.req.param("id");

  try {
    // Check if recipe exists
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const [result] = await db
      .select({
        average: sql`ROUND(AVG(rating)::numeric, 1)`,
        count: sql`COUNT(*)::int`,
      })
      .from(ratings)
      .where(eq(ratings.recipeId, recipeId));

    return c.json({
      recipeId,
      averageRating: result?.average || 0,
      ratingCount: result?.count,
    });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return c.json({ error: "Failed to calculate average rating" }, 500);
  }
});

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
