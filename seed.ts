// seed.ts
import { db } from "./db";
import { categories, recipes } from "./schema";

async function seed() {
  try {
    console.log("Seeding database...");

    // Insert categories
    const [italianCategory] = await db
      .insert(categories)
      .values({
        name: "Italian",
        description: "Italian cuisine",
      })
      .returning();

    const [dessertCategory] = await db
      .insert(categories)
      .values({
        name: "Dessert",
        description: "Sweet treats",
      })
      .returning();

    // Insert recipes
    await db.insert(recipes).values([
      {
        name: "Spaghetti Carbonara",
        description: "A classic Italian pasta dish",
        ingredients: [
          "200g spaghetti",
          "100g pancetta",
          "2 eggs",
          "50g pecorino cheese",
          "Black pepper",
        ],
        instructions: [
          "Cook pasta",
          "Fry pancetta",
          "Mix eggs and cheese",
          "Combine all ingredients",
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        categoryId: italianCategory?.id,
      },
      {
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        ingredients: [
          "Ladyfingers",
          "Coffee",
          "Mascarpone cheese",
          "Eggs",
          "Sugar",
          "Cocoa powder",
        ],
        instructions: [
          "Dip ladyfingers in coffee",
          "Mix mascarpone with eggs and sugar",
          "Layer ingredients",
          "Refrigerate",
        ],
        prepTime: 30,
        cookTime: 0,
        servings: 8,
        categoryId: dessertCategory?.id,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
