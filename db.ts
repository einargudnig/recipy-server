import type { Recipe, Category } from "./types";
import { randomUUID } from "crypto";

// In memory database
export const db = {
  recipes: new Map<string, Recipe>(),
  categories: new Map<string, Category>(),

  // Helper methods
  addRecipe(
    recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
  ): Recipe {
    const now = new Date();
    const recipe: Recipe = {
      id: randomUUID(),
      ...recipeData,
      createdAt: now,
      updatedAt: now,
    };

    this.recipes.set(recipe.id, recipe);
    return recipe;
  },

  addCategory(categoryData: Omit<Category, "id">): Category {
    const category: Category = {
      id: randomUUID(),
      ...categoryData,
    };
    this.categories.set(category.id, category);
    return category;
  },
};

db.addCategory({ name: "Italian", description: "Italian cuisine" });
db.addCategory({ name: "Dessert", description: "Sweet treats" });
