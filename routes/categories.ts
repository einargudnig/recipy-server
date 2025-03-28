import { Hono } from "hono";
import { db } from "../db";
import type { Category } from "../types";

const category = new Hono();

// GET all categories
category.get("/", (c) => {
  const categories = Array.from(db.categories.values());
  return c.json(categories);
});

// POST a new category
category.post("/", async (c) => {
  try {
    const body = await c.req.json();
    // Basic Validation
    if (!body.name) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const category = db.addCategory(body as Category);
    return c.json(category, 201);
  } catch (error) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// DELETE a category
category.delete("/:id", (c) => {
  const id = c.req.param("id");

  if (!db.categories.has(id)) {
    return c.json({ error: "Category not found" }, 404);
  }

  // Check if any recipes use this category
  const recipesWithCategory = Array.from(db.recipes.values()).filter(
    (recipe) => recipe.categoryId === id,
  );

  if (recipesWithCategory.length > 0) {
    return c.json(
      {
        error: "Cannot delete category that is used by recipes",
        recipeCount: recipesWithCategory.length,
      },
      409,
    ); // Conflict status code
  }

  db.categories.delete(id);
  return c.json(204);
});

// GET recipes by category
category.get("/:id/recipes", (c) => {
  const categoryId = c.req.param("id");

  // Check if category exists
  if (!db.categories.has(categoryId)) {
    return c.json({ error: "Category not found" }, 404);
  }

  const categoryRecipes = Array.from(db.recipes.values()).filter(
    (recipe) => recipe.categoryId === categoryId,
  );

  return c.json(categoryRecipes);
});

export default category;
