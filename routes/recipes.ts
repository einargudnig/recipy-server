import { Hono } from "hono";
import { db } from "../db";
import type { Recipe } from "../types";

const app = new Hono();

// GET all recipes
// This needs to come BEFORE the /recipes/:id route to avoid conflicts
app.get("/search", (c) => {
  const query = c.req.query("q")?.toLowerCase();
  const categoryId = c.req.query("category");

  if (!query && !categoryId) {
    return c.json(
      { error: "Search query or category filter is required" },
      400,
    );
  }

  let matchingRecipes = Array.from(db.recipes.values());

  // Filter by name if query is provided
  if (query) {
    matchingRecipes = matchingRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(query),
    );
  }

  // Filter by category if categoryId is provided
  if (categoryId) {
    matchingRecipes = matchingRecipes.filter(
      (recipe) => recipe.categoryId === categoryId,
    );
  }

  return c.json(matchingRecipes);
});

// Implement pagination for the main recipes endpoint
app.get("/", (c) => {
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = parseInt(c.req.query("offset") || "0");

  const allRecipes = Array.from(db.recipes.values());
  const paginatedRecipes = allRecipes.slice(offset, offset + limit);

  return c.json({
    recipes: paginatedRecipes,
    total: allRecipes.length,
    limit,
    offset,
  });
});

// GET a specific recipe
app.get("/:id", (c) => {
  const id = c.req.param("id");
  const recipe = db.recipes.get(id);

  if (!recipe) {
    return c.json({ error: "Recipe not found" }, 404);
  }

  return c.json(recipe);
});

// POST a new recipe
app.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // Basic Validation
    if (!body.name || !body.ingredients || !body.instructions) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const recipe = db.addRecipe(body as Recipe);
    return c.json(recipe, 201);
  } catch (error) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// PUT to completely replace a recipe
app.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existingRecipe = db.recipes.get(id);

    if (!existingRecipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const body = await c.req.json();

    // Basic validation
    if (!body.name || !body.ingredients || !body.instructions) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create updated recipe (keeping original id and createdAt)
    const updatedRecipe: Recipe = {
      ...body,
      id: existingRecipe.id,
      createdAt: existingRecipe.createdAt,
      updatedAt: new Date(),
    };

    // Save to database
    db.recipes.set(id, updatedRecipe);

    return c.json(updatedRecipe);
  } catch (error) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// PATCH to update specific fields of a recipe
app.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existingRecipe = db.recipes.get(id);

    if (!existingRecipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    const updates = await c.req.json();

    // Create updated recipe by merging existing recipe with updates
    const updatedRecipe: Recipe = {
      ...existingRecipe,
      ...updates,
      id: existingRecipe.id, // Ensure ID doesn't change
      createdAt: existingRecipe.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update the modification date
    };

    // Save to database
    db.recipes.set(id, updatedRecipe);

    return c.json(updatedRecipe);
  } catch (error) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// DELETE a recipe
app.delete("/:id", (c) => {
  const id = c.req.param("id");

  if (!db.recipes.has(id)) {
    return c.json({ error: "Recipe not found" }, 404);
  }

  db.recipes.delete(id);
  return c.json(204);
});

export default app;
