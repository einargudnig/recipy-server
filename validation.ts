import { z } from "zod";

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
});

// Recipe validation schema
export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required").max(255),
  description: z.string().optional(),
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string())
    .min(1, "At least one instruction is required"),
  prepTime: z.number().int().min(0, "Prep time cannot be negative"),
  cookTime: z.number().int().min(0, "Cook time cannot be negative"),
  servings: z.number().int().min(1, "Servings must be at least 1"),
  categoryId: z.string().uuid("Category ID must be a valid UUID"),
});

// Partial schema for PATCH updates
export const recipeUpdateSchema = recipeSchema.partial();

export const ratingSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  comment: z.string().optional(),
});
