import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { categories, recipes } from "../schema";
import { categorySchema } from "../validation";

const category = new Hono();

// GET all categories
category.get("/", async (c) => {
  try {
    const categoryList = await db.select().from(categories);
    return c.json(categoryList);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// GET a specific category
category.get("/categories/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    return c.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return c.json({ error: "Failed to fetch category" }, 500);
  }
});

// POST a new category
category.post("/", zValidator("json", categorySchema), async (c) => {
  try {
    const body = await c.req.json();

    // Basic validation
    if (!body.name) {
      return c.json({ error: "Category name is required" }, 400);
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: body.name,
        description: body.description || "",
      })
      .returning();

    return c.json(category, 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ error: "Failed to create category" }, 500);
  }
});

// DELETE a category
category.delete("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    // Check if category exists
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    // Check if any recipes use this category
    const recipesWithCategory = await db
      .select({ count: sql`count(*)::int` })
      .from(recipes)
      .where(eq(recipes.categoryId, id));

    if (recipesWithCategory[0]?.count > 0) {
      return c.json(
        {
          error: "Cannot delete category that is used by recipes",
          recipeCount: recipesWithCategory[0]?.count,
        },
        409,
      ); // Conflict status code
    }

    // Delete the category
    await db.delete(categories).where(eq(categories.id, id));

    return c.json(204);
  } catch (error) {
    console.error("Error deleting category:", error);
    return c.json({ error: "Failed to delete category" }, 500);
  }
});

// GET recipes by category
category.get("/:id/recipes", async (c) => {
  const categoryId = c.req.param("id");

  try {
    // Check if category exists
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    // Get recipes in this category
    const categoryRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.categoryId, categoryId));

    return c.json(categoryRecipes);
  } catch (error) {
    console.error("Error fetching category recipes:", error);
    return c.json({ error: "Failed to fetch category recipes" }, 500);
  }
});

export default category;
