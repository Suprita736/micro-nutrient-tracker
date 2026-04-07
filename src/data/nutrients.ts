export interface NutrientInfo {
  id: string;
  name: string;
  unit: string;
  dailyRequired: number;
}

export interface FoodItem {
  id: string;
  name: string;
  image: string;
  minDailyQuantity: string;
  nutrients: Record<string, number>; // nutrient id -> amount per serving
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  gender: string;
  activityLevel: string;
}

export const nutrients: NutrientInfo[] = [
  { id: "protein", name: "Protein", unit: "g", dailyRequired: 44 },
  { id: "fiber", name: "Fiber", unit: "g", dailyRequired: 25 },
  { id: "iron", name: "Iron", unit: "mg", dailyRequired: 18 },
  { id: "calcium", name: "Calcium", unit: "mg", dailyRequired: 1000 },
  { id: "magnesium", name: "Magnesium", unit: "mg", dailyRequired: 400 },
  { id: "vitaminB12", name: "Vitamin B12", unit: "mcg", dailyRequired: 2.4 },
  { id: "omega3", name: "Omega 3", unit: "g", dailyRequired: 1.6 },
  { id: "vitaminD", name: "Vitamin D", unit: "mcg", dailyRequired: 15 },
  { id: "zinc", name: "Zinc", unit: "mg", dailyRequired: 11 },
  { id: "selenium", name: "Selenium", unit: "mcg", dailyRequired: 55 },
];

export const foods: FoodItem[] = [
  {
    id: "oats",
    name: "Oats",
    image: "/images/oats.jpg",
    minDailyQuantity: "40g per day",
    nutrients: { protein: 5, fiber: 4, iron: 1.5, magnesium: 28 },
  },
  {
    id: "egg",
    name: "Egg",
    image: "/images/egg.jpg",
    minDailyQuantity: "2 eggs per day",
    nutrients: { protein: 6, vitaminB12: 0.6, vitaminD: 1, selenium: 15, zinc: 0.6 },
  },
  {
    id: "paneer",
    name: "Paneer",
    image: "/images/paneer.jpg",
    minDailyQuantity: "100g per day",
    nutrients: { protein: 18, calcium: 208, zinc: 2 },
  },
  {
    id: "spinach",
    name: "Spinach",
    image: "/images/spinach.jpg",
    minDailyQuantity: "100g per day",
    nutrients: { iron: 2.7, calcium: 99, magnesium: 79, fiber: 2.2 },
  },
  {
    id: "milk",
    name: "Milk",
    image: "/images/milk.jpg",
    minDailyQuantity: "250ml per day",
    nutrients: { protein: 8, calcium: 300, vitaminB12: 1.2, vitaminD: 2.5 },
  },
  {
    id: "dal",
    name: "Dal (Lentils)",
    image: "/images/dal.jpg",
    minDailyQuantity: "50g per day",
    nutrients: { protein: 9, fiber: 8, iron: 3.3, magnesium: 36, zinc: 1.3, selenium: 2.8 },
  },
  {
    id: "tofu",
    name: "Tofu",
    image: "/images/tofu.jpg",
    minDailyQuantity: "150g per day",
    nutrients: { protein: 12, calcium: 350, iron: 5.4, magnesium: 30, zinc: 1 },
  },
  {
    id: "banana",
    name: "Banana",
    image: "/images/banana.jpg",
    minDailyQuantity: "1 banana per day",
    nutrients: { fiber: 2.6, magnesium: 27, vitaminB12: 0 },
  },
  {
    id: "almonds",
    name: "Almonds",
    image: "/images/almonds.jpg",
    minDailyQuantity: "30g per day",
    nutrients: { protein: 6, fiber: 3.5, magnesium: 76, calcium: 76, vitaminD: 0, omega3: 0, zinc: 0.9, selenium: 1.2 },
  },
  {
    id: "salmon",
    name: "Salmon",
    image: "/images/salmon.jpg",
    minDailyQuantity: "100g per day",
    nutrients: { protein: 20, omega3: 1.8, vitaminD: 11, vitaminB12: 3.2, selenium: 36 },
  },
  {
    id: "flaxseeds",
    name: "Flaxseeds",
    image: "/images/flaxseeds.jpg",
    minDailyQuantity: "15g per day",
    nutrients: { omega3: 3.4, fiber: 4.1, magnesium: 59, iron: 0.9 },
  },
];

// Get foods relevant to a specific nutrient
export const getFoodsForNutrient = (nutrientId: string): FoodItem[] => {
  return foods.filter((f) => (f.nutrients[nutrientId] ?? 0) > 0);
};
