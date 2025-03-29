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

    const [mexicanCategory] = await db
      .insert(categories)
      .values({
        name: "Mexican",
        description: "Authentic Mexican dishes",
      })
      .returning();

    const [asianCategory] = await db
      .insert(categories)
      .values({
        name: "Asian",
        description: "Dishes from across Asia",
      })
      .returning();

    const [vegetarianCategory] = await db
      .insert(categories)
      .values({
        name: "Vegetarian",
        description: "Meat-free recipes",
      })
      .returning();

    const [quickMealsCategory] = await db
      .insert(categories)
      .values({
        name: "Quick Meals",
        description: "Ready in 30 minutes or less",
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
      {
        name: "Margherita Pizza",
        description: "Simple and delicious traditional pizza",
        ingredients: [
          "Pizza dough",
          "San Marzano tomatoes",
          "Fresh mozzarella",
          "Fresh basil",
          "Olive oil",
          "Salt",
        ],
        instructions: [
          "Preheat oven to 250°C",
          "Roll out dough",
          "Spread tomato sauce",
          "Add torn mozzarella pieces",
          "Bake for 10-12 minutes",
          "Garnish with fresh basil and olive oil",
        ],
        prepTime: 20,
        cookTime: 12,
        servings: 2,
        categoryId: italianCategory?.id,
      },
      {
        name: "Chicken Enchiladas",
        description: "Spicy Mexican comfort food",
        ingredients: [
          "Corn tortillas",
          "Shredded chicken",
          "Enchilada sauce",
          "Cheese",
          "Onion",
          "Garlic",
          "Cumin",
          "Sour cream",
        ],
        instructions: [
          "Cook chicken with spices",
          "Dip tortillas in sauce",
          "Fill with chicken mixture",
          "Roll and place in baking dish",
          "Top with more sauce and cheese",
          "Bake until bubbly",
        ],
        prepTime: 25,
        cookTime: 20,
        servings: 4,
        categoryId: mexicanCategory?.id,
      },
      {
        name: "Pad Thai",
        description: "Popular Thai stir-fried noodle dish",
        ingredients: [
          "Rice noodles",
          "Tofu or chicken",
          "Bean sprouts",
          "Eggs",
          "Peanuts",
          "Lime",
          "Fish sauce",
          "Tamarind paste",
          "Palm sugar",
          "Garlic",
          "Shallots",
        ],
        instructions: [
          "Soak noodles in warm water",
          "Make sauce with tamarind, fish sauce, and sugar",
          "Stir-fry protein with garlic and shallots",
          "Add eggs and scramble",
          "Add noodles and sauce",
          "Toss with bean sprouts",
          "Garnish with peanuts and lime",
        ],
        prepTime: 20,
        cookTime: 15,
        servings: 2,
        categoryId: asianCategory?.id,
      },
      {
        name: "Chocolate Chip Cookies",
        description: "Classic homemade cookies",
        ingredients: [
          "Butter",
          "White sugar",
          "Brown sugar",
          "Eggs",
          "Vanilla extract",
          "Flour",
          "Baking soda",
          "Salt",
          "Chocolate chips",
        ],
        instructions: [
          "Cream butter and sugars",
          "Add eggs and vanilla",
          "Mix in dry ingredients",
          "Fold in chocolate chips",
          "Drop spoonfuls onto baking sheet",
          "Bake at 180°C for 10-12 minutes",
        ],
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        categoryId: dessertCategory?.id,
      },
      {
        name: "Vegetable Stir Fry",
        description: "Quick and healthy vegetarian meal",
        ingredients: [
          "Mixed vegetables (bell peppers, broccoli, carrots, snap peas)",
          "Tofu",
          "Garlic",
          "Ginger",
          "Soy sauce",
          "Sesame oil",
          "Rice or noodles",
        ],
        instructions: [
          "Press and cube tofu",
          "Chop vegetables",
          "Stir-fry tofu until golden",
          "Add vegetables and stir-fry",
          "Add sauce ingredients",
          "Serve over rice or noodles",
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 2,
        categoryId: vegetarianCategory?.id,
      },
      {
        name: "Avocado Toast",
        description: "Simple and nutritious breakfast",
        ingredients: [
          "Whole grain bread",
          "Ripe avocado",
          "Lemon juice",
          "Red pepper flakes",
          "Salt",
          "Optional toppings (eggs, tomatoes, feta)",
        ],
        instructions: [
          "Toast bread",
          "Mash avocado with lemon juice and salt",
          "Spread on toast",
          "Add desired toppings",
          "Sprinkle with red pepper flakes",
        ],
        prepTime: 5,
        cookTime: 5,
        servings: 1,
        categoryId: quickMealsCategory?.id,
      },
      {
        name: "Guacamole",
        description: "Fresh Mexican avocado dip",
        ingredients: [
          "Ripe avocados",
          "Lime juice",
          "Red onion",
          "Tomatoes",
          "Cilantro",
          "Jalapeño",
          "Salt",
          "Cumin",
        ],
        instructions: [
          "Mash avocados",
          "Finely chop onion, tomatoes, cilantro, and jalapeño",
          "Mix all ingredients",
          "Season with lime juice, salt, and cumin",
          "Serve with tortilla chips",
        ],
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        categoryId: mexicanCategory?.id,
      },
      {
        name: "Mushroom Risotto",
        description: "Creamy Italian rice dish",
        ingredients: [
          "Arborio rice",
          "Mixed mushrooms",
          "Onion",
          "Garlic",
          "White wine",
          "Vegetable stock",
          "Parmesan cheese",
          "Butter",
          "Olive oil",
          "Fresh thyme",
        ],
        instructions: [
          "Sauté mushrooms and set aside",
          "Cook onion and garlic in butter and oil",
          "Add rice and toast lightly",
          "Add wine and let absorb",
          "Gradually add hot stock, stirring frequently",
          "Cook until rice is creamy but al dente",
          "Stir in mushrooms, parmesan, and butter",
          "Garnish with thyme",
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        categoryId: italianCategory?.id,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
