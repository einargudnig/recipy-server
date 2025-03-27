export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
