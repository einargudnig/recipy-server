import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { recipes } from "../schema";
import { recipeSchema, recipeUpdateSchema } from "../validation";
import { eq, like, sql, and } from "drizzle-orm";

const app = new Hono();

// GET all recipes

// Implement pagination for the main recipes endpoint
app.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    // Get total count
    const countResult = await db.select({ count: sql`count(*)` }).from(recipes);
    const total = Number(countResult[0]?.count);

    // Get paginated recipes
    const recipeList = await db
      .select()
      .from(recipes)
      .limit(limit)
      .offset(offset);

    return c.json({
      recipes: recipeList,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return c.json({ error: "Failed to fetch recipes" }, 500);
  }
});

// This needs to come BEFORE the /recipes/:id route to avoid conflicts
app.get("/search", async (c) => {
  const query = c.req.query("q")?.toLowerCase();
  const categoryId = c.req.query("category");

  if (!query && !categoryId) {
    return c.json(
      { error: "Search query or category filter is required" },
      400,
    );
  }

  try {
    let conditions = [];

    if (query) {
      conditions.push(like(recipes.name, `%${query}%`));
    }

    if (categoryId) {
      conditions.push(eq(recipes.categoryId, categoryId));
    }

    const searchResults = await db
      .select()
      .from(recipes)
      .where(and(...conditions));

    return c.json(searchResults);
  } catch (error) {
    console.error("Error searching recipes:", error);
    return c.json({ error: "Failed to search recipes" }, 500);
  }
});

// GET a specific recipe
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));

    if (!recipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    return c.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return c.json({ error: "Failed to fetch recipe" }, 500);
  }
});

// POST a new recipe
app.post("/", zValidator("json", recipeSchema), async (c) => {
  try {
    const body = await c.req.json();

    // Basic validation
    if (!body.name || !body.ingredients || !body.instructions) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const [recipe] = await db
      .insert(recipes)
      .values({
        name: body.name,
        description: body.description,
        ingredients: body.ingredients,
        instructions: body.instructions,
        prepTime: body.prepTime,
        cookTime: body.cookTime,
        servings: body.servings,
        categoryId: body.categoryId,
      })
      .returning();

    return c.json(recipe, 201);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return c.json({ error: "Failed to create recipe" }, 500);
  }
});

// PUT to completely replace a recipe
app.put("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Check if recipe exists
    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));

    if (!existingRecipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const body = await c.req.json();

    // Basic validation
    if (!body.name || !body.ingredients || !body.instructions) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Update the recipe
    const [updatedRecipe] = await db
      .update(recipes)
      .set({
        name: body.name,
        description: body.description || "",
        ingredients: body.ingredients,
        instructions: body.instructions,
        prepTime: body.prepTime,
        cookTime: body.cookTime,
        servings: body.servings,
        categoryId: body.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    return c.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return c.json({ error: "Failed to update recipe" }, 500);
  }
});

// PATCH to update specific fields of a recipe
app.patch("/:id", zValidator("json", recipeUpdateSchema), async (c) => {
  const id = c.req.param("id");

  try {
    // Check if recipe exists
    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));

    if (!existingRecipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const updates = await c.req.json();

    // Prepare update data (only include fields that are provided)
    const updateData: any = { updatedAt: new Date() };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.ingredients !== undefined)
      updateData.ingredients = updates.ingredients;
    if (updates.instructions !== undefined)
      updateData.instructions = updates.instructions;
    if (updates.prepTime !== undefined) updateData.prepTime = updates.prepTime;
    if (updates.cookTime !== undefined) updateData.cookTime = updates.cookTime;
    if (updates.servings !== undefined) updateData.servings = updates.servings;
    if (updates.categoryId !== undefined)
      updateData.categoryId = updates.categoryId;

    // Update the recipe
    const [updatedRecipe] = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();

    return c.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return c.json({ error: "Failed to update recipe" }, 500);
  }
});

// DELETE a recipe
app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Check if recipe exists
    const [existingRecipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));

    if (!existingRecipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    // Delete the recipe
    await db.delete(recipes).where(eq(recipes.id, id));

    return c.json(204);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return c.json({ error: "Failed to delete recipe" }, 500);
  }
});

export default app;
