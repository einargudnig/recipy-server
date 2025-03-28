// test-db.ts
import { db } from "./db";
import { categories } from "./schema";

async function testDB() {
  try {
    // Insert a test category
    const [category] = await db
      .insert(categories)
      .values({
        name: "Test Category",
        description: "A test category",
      })
      .returning();

    console.log("Inserted category:", category);

    // Query all categories
    const allCategories = await db.select().from(categories);
    console.log("All categories:", allCategories);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDB();
