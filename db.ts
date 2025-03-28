import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

// Log connection details (for debugging only, remove in production)
console.log("DB Connection settings:", {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(pool);

// Test connection
async function testConnection() {
  try {
    const result = await pool.query("SELECT  NOW()");
    console.log("Connected to POSTGRES:", result.rows[0].now);
  } catch (error) {
    console.error("Failed to connect to POSTGRES:", error);
  }
}

testConnection();
// In memory database
// export const db = {
//   recipes: new Map<string, Recipe>(),
//   categories: new Map<string, Category>(),
//
//   // Helper methods
//   addRecipe(
//     recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
//   ): Recipe {
//     const now = new Date();
//     const recipe: Recipe = {
//       id: randomUUID(),
//       ...recipeData,
//       createdAt: now,
//       updatedAt: now,
//     };
//
//     this.recipes.set(recipe.id, recipe);
//     return recipe;
//   },
//
//   addCategory(categoryData: Omit<Category, "id">): Category {
//     const category: Category = {
//       id: randomUUID(),
//       ...categoryData,
//     };
//     this.categories.set(category.id, category);
//     return category;
//   },
// };
//
// db.addCategory({ name: "Italian", description: "Italian cuisine" });
// db.addCategory({ name: "Dessert", description: "Sweet treats" });
