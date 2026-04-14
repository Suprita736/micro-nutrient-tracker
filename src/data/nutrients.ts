export interface NutrientInfo {
  id: string;
  name: string;
  unit: string;
  baseRequired?: number; // fallback or default
  femaleRequired?: number;
  maleRequired?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  image: string;
  minQuantity: number;
  maxQuantity?: number;
  maxSuggestionQuantity?: number;
  regionTags: string[];
  calories: number;
  nutrients: Record<string, number>; // nutrient id -> amount per minQuantity serving
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  gender: string;
  activityLevel: string;
  country?: string;

  height?: number;
}

export const nutrients: NutrientInfo[] = [
  { id: "calories", name: "Calories", unit: "kcal" },
  { id: "protein", name: "Protein", unit: "g" }, // Dynamic check
  { id: "fiber", name: "Fiber", unit: "g", femaleRequired: 25, maleRequired: 38 },
  { id: "iron", name: "Iron", unit: "mg", femaleRequired: 18, maleRequired: 8 },
  { id: "calcium", name: "Calcium", unit: "mg", baseRequired: 1000 },
  { id: "magnesium", name: "Magnesium", unit: "mg", femaleRequired: 310, maleRequired: 400 },
  { id: "zinc", name: "Zinc", unit: "mg", femaleRequired: 8, maleRequired: 11 },
  { id: "vitaminB12", name: "Vitamin B12", unit: "mcg", baseRequired: 2.4 },
  { id: "omega3", name: "Omega 3", unit: "g", femaleRequired: 1.1, maleRequired: 1.6 },
  { id: "selenium", name: "Selenium", unit: "mcg", baseRequired: 55 },
  { id: "vitaminD", name: "Vitamin D", unit: "mcg", baseRequired: 15 },
  { id: "vitaminC", name: "Vitamin C", unit: "mg", baseRequired: 90 },
  { id: "folate", name: "Folate", unit: "mcg", baseRequired: 400 },
  { id: "potassium", name: "Potassium", unit: "mg", baseRequired: 3500 },
  { id: "vitaminA", name: "Vitamin A", unit: "mcg", baseRequired: 900 },
  { id: "vitaminE", name: "Vitamin E", unit: "mg", baseRequired: 15 },
  { id: "curcumin", name: "Curcumin", unit: "mg", baseRequired: 200 },
];

export const foods: FoodItem[] = [
  // ─── GLOBAL ────────────────────────────────────────────────────
  {
    id: "oats",
    name: "Oats",
    image: "/images/oats.jpg",
    minQuantity: 40,
    maxQuantity: 120,
    maxSuggestionQuantity: 80,
    regionTags: ["global"],
    calories: 150,
    nutrients: { protein: 5, fiber: 4, iron: 1.5, magnesium: 40, zinc: 1.1, selenium: 8, folate: 14, potassium: 150 },
  },
  {
    id: "protein_powder",
    name: "Protein Powder (1 scoop)",
    image: "/images/protein_powder.jpg",
    minQuantity: 1,
    maxQuantity: 3,
    maxSuggestionQuantity: 2,
    regionTags: ["global"],
    calories: 120,
    nutrients: {
      protein: 25,
      magnesium: 30,
      zinc: 0.9,
      selenium: 10,
      potassium: 150
    }
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    image: "/images/pomegranate.jpg",
    minQuantity: 100,
    maxQuantity: 250,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 83,
    nutrients: {
      fiber: 4,
      vitaminC: 10,
      potassium: 236,
      folate: 38,
      magnesium: 12
    }
  },
  {
    id: "kiwi",
    name: "Kiwi",
    image: "/images/kiwi.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 61,
    nutrients: {
      fiber: 3,
      vitaminC: 92,
      potassium: 312,
      folate: 25,
      magnesium: 17
    }
  },
  {
    id: "dark_chocolate",
    name: "Dark Chocolate (70-85%)",
    image: "/images/dark_chocolate.jpg",
    minQuantity: 20,
    maxQuantity: 40,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 120,
    nutrients: {
      fiber: 3,
      iron: 3.3,
      magnesium: 65,
      zinc: 0.9,
      selenium: 2,
      potassium: 230,
      vitaminE: 0.6
    }
  },
  {
    id: "pumpkin_seeds",
    name: "Pumpkin Seeds",
    image: "/images/pumpkin_seeds.jpg",
    minQuantity: 20,
    maxQuantity: 40,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 110,
    nutrients: {
      protein: 7,
      magnesium: 150,
      zinc: 2.2,
      iron: 2.5,
      fiber: 2,
      potassium: 230,
      vitaminE: 2
    }
  },
  {
    id: "sardines",
    name: "Sardines",
    image: "/images/sardines.jpg",
    minQuantity: 100,
    maxQuantity: 150,
    maxSuggestionQuantity: 120,
    regionTags: ["global"],
    calories: 200,
    nutrients: {
      protein: 25,
      calcium: 382,
      omega3: 1.5,
      vitaminB12: 8.9,
      selenium: 45,
      zinc: 1.3
    }
  },
  {
    id: "sunflower_seeds",
    name: "Sunflower Seeds",
    image: "/images/sunflower_seeds.jpg",
    minQuantity: 20,
    maxQuantity: 40,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 115,
    nutrients: {
      magnesium: 80,
      zinc: 1.5,
      selenium: 15,
      protein: 6,
      fiber: 2.5,
      vitaminE: 7,
      folate: 65
    }
  },
  {
    id: "egg",
    name: "Egg",
    image: "/images/egg.jpg",
    minQuantity: 1,
    maxQuantity: 4,
    maxSuggestionQuantity: 3,
    regionTags: ["global"],
    calories: 70,
    nutrients: { protein: 6, vitaminB12: 0.6, vitaminD: 1, selenium: 15, zinc: 0.6, calcium: 28, vitaminA: 80 },
  },
  {
    id: "milk",
    name: "Milk",
    image: "/images/milk.jpg",
    minQuantity: 250,
    maxQuantity: 500,
    maxSuggestionQuantity: 500,
    regionTags: ["global"],
    calories: 150,
    nutrients: {
      protein: 8, calcium: 300, vitaminB12: 1.2, vitaminD: 2.5, magnesium: 27, zinc: 1, potassium: 322,
      vitaminA: 68
    },
  },
  {
    id: "spinach",
    name: "Spinach",
    image: "/images/spinach.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 100,
    regionTags: ["global"],
    calories: 23,
    nutrients: { iron: 2.7, calcium: 99, magnesium: 79, fiber: 2.2, zinc: 0.5, folate: 194, vitaminA: 469, vitaminC: 28, potassium: 558, vitaminE: 2 },
  },
  {
    id: "banana",
    name: "Banana",
    image: "/images/banana.jpg",
    minQuantity: 1,
    maxQuantity: 3,
    maxSuggestionQuantity: 2,
    regionTags: ["global"],
    calories: 105,
    nutrients: {
      fiber: 2.6,
      magnesium: 27,
      vitaminB12: 0,
      potassium: 422,
      vitaminC: 10,
      vitaminA: 3,
    },
  },
  {
    id: "shrimp",
    name: "Shrimp",
    image: "/images/shrimp.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 99,
    nutrients: {
      protein: 20,
      selenium: 48,
      vitaminB12: 1.1,
      zinc: 1.3,
      magnesium: 35
    }
  },
  {
    id: "blueberries",
    name: "Blueberries",
    image: "/images/blueberries.jpg",
    minQuantity: 75,
    maxQuantity: 150,
    maxSuggestionQuantity: 100,
    regionTags: ["global"],
    calories: 42,
    nutrients: {
      fiber: 2.4,
      magnesium: 6,
      calcium: 6,
      zinc: 0.2,
      vitaminC: 9,
      vitaminA: 3,
      potassium: 77
    }
  },
  {
    id: "strawberries",
    name: "Strawberries",
    image: "/images/strawberries.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 32,
    nutrients: {
      fiber: 2,
      magnesium: 13,
      calcium: 16,
      iron: 0.4,
      vitaminC: 59,
      folate: 24,
      potassium: 153
    }
  },
  {
    id: "apple",
    name: "Apple",
    image: "/images/apple.jpg",
    minQuantity: 1,
    maxQuantity: 3,
    maxSuggestionQuantity: 2,
    regionTags: ["global"],
    calories: 95,
    nutrients: {
      fiber: 3.5, magnesium: 9, iron: 0.2, vitaminC: 5,
      potassium: 195
    },
  },
  {
    id: "almonds",
    name: "Almonds",
    image: "/images/almonds.jpg",
    minQuantity: 20,
    maxQuantity: 30,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 115,
    nutrients: {
      protein: 5, fiber: 3, magnesium: 60, calcium: 60, zinc: 0.7, selenium: 1, vitaminE: 7,
      folate: 14
    },
  },
  {
    id: "walnuts",
    name: "Walnuts",
    image: "/images/walnuts.jpg",
    minQuantity: 20,
    maxQuantity: 30,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 130,
    nutrients: {
      protein: 4, fiber: 2, omega3: 2.6, magnesium: 40, zinc: 0.9, vitaminE: 0.7,
      folate: 28
    },
  },
  {
    id: "peanuts",
    name: "Peanuts",
    image: "/images/peanuts.jpg",
    minQuantity: 30,
    maxQuantity: 60,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 170,
    nutrients: {
      protein: 8, fiber: 2.5, magnesium: 50, zinc: 1, selenium: 3, folate: 68,
      vitaminE: 2
    },
  },
  {
    id: "chicken_breast",
    name: "Chicken Breast",
    image: "/images/chicken.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 165,
    nutrients: { protein: 25, vitaminB12: 0.3, selenium: 27, zinc: 1, magnesium: 30, potassium: 256 },
  },
  {
    id: "salmon",
    name: "Salmon",
    image: "/images/salmon.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 208,
    nutrients: { protein: 20, omega3: 1.8, vitaminD: 11, vitaminB12: 3.2, selenium: 36, magnesium: 29, vitaminE: 2 },
  },
  {
    id: "tuna",
    name: "Tuna",
    image: "/images/tuna.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 130,
    nutrients: { protein: 23, vitaminD: 4, vitaminB12: 2.1, selenium: 90, omega3: 1.2, vitaminE: 1 },
  },
  {
    id: "tofu",
    name: "Tofu",
    image: "/images/tofu.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global", "asia"],
    calories: 144,
    nutrients: {
      protein: 8, calcium: 230, iron: 3.6, magnesium: 20, zinc: 0.7, potassium: 121,
      folate: 27
    },
  },
  {
    id: "brown_rice",
    name: "Brown Rice",
    image: "/images/brown_rice.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 110,
    nutrients: {
      protein: 3, fiber: 1.8, magnesium: 44, zinc: 0.6, selenium: 5, folate: 9,
      potassium: 79
    },
  },
  {
    id: "white_rice",
    name: "White Rice",
    image: "/images/white_rice.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 130,
    nutrients: {
      protein: 2.5, magnesium: 13, selenium: 7, iron: 0.4, folate: 4,
      potassium: 26
    },
  },
  {
    id: "potato",
    name: "Potato",
    image: "/images/potato.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 90,
    nutrients: {
      fiber: 2, magnesium: 23, vitaminB12: 0, iron: 0.8, zinc: 0.4, potassium: 421,
      vitaminC: 20
    },
  },
  {
    id: "sweet_potato",
    name: "Sweet Potato",
    image: "/images/sweet_potato.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 100,
    nutrients: {
      fiber: 3, magnesium: 27, iron: 0.7, calcium: 38, vitaminA: 709,
      potassium: 337,
      vitaminC: 22
    },
  },
  {
    id: "broccoli",
    name: "Broccoli",
    image: "/images/broccoli.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 34,
    nutrients: {
      fiber: 2.6, calcium: 47, iron: 0.7, magnesium: 21, zinc: 0.4, vitaminC: 89, folate: 63,
      potassium: 316,
      vitaminA: 31,
      vitaminE: 0.8
    },
  },
  {
    id: "carrot",
    name: "Carrot",
    image: "/images/carrot.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 41,
    nutrients: {
      fiber: 2.8, magnesium: 12, calcium: 33, iron: 0.3, vitaminA: 835,
      potassium: 320,
      vitaminC: 6
    },
  },
  {
    id: "flaxseeds",
    name: "Flaxseeds",
    image: "/images/flaxseeds.jpg",
    minQuantity: 15,
    maxQuantity: 30,
    maxSuggestionQuantity: 25,
    regionTags: ["global"],
    calories: 80,
    nutrients: {
      omega3: 3.4, fiber: 4.1, magnesium: 59, iron: 0.9, vitaminE: 0.6,
      potassium: 85
    },
  },
  {
    id: "green_beans",
    name: "Green Beans",
    image: "/images/green_beans.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 31,
    nutrients: {
      protein: 2,
      fiber: 3.4,
      iron: 1,
      calcium: 37,
      magnesium: 25,
      zinc: 0.2,
      selenium: 0.6, vitaminC: 12,
      folate: 33,
      potassium: 209
    },
  },
  {
    id: "sprouts",
    name: "Sprouts",
    image: "/images/sprouts.jpg",
    minQuantity: 100,
    maxQuantity: 250,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 40,
    nutrients: {
      protein: 7,
      fiber: 2.5,
      iron: 1.4,
      calcium: 25,
      magnesium: 21,
      zinc: 0.4,
      selenium: 2.5, vitaminC: 14,
      folate: 61,
      potassium: 149
    },
  },
  {
    id: "orange",
    name: "Orange",
    image: "/images/orange.jpg",
    minQuantity: 1,
    maxQuantity: 3,
    maxSuggestionQuantity: 2,
    regionTags: ["global"],
    calories: 60,
    nutrients: {
      fiber: 2.4, calcium: 40, magnesium: 10, vitaminC: 70,
      folate: 30,
      potassium: 181
    }
  },
  {
    id: "turmeric",
    name: "Turmeric",
    image: "/images/turmeric.jpg",
    minQuantity: 2,
    maxQuantity: 5,
    maxSuggestionQuantity: 3,
    regionTags: ["global"],
    calories: 10,
    nutrients: {
      curcumin: 60,
      iron: 0.5,
      magnesium: 8,
      potassium: 50,
      vitaminC: 0.7,
      vitaminE: 0.3
    }
  },
  {
    id: "kale",
    name: "Kale",
    image: "/images/kale.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 50,
    nutrients: {
      iron: 1.5, calcium: 150, magnesium: 33, fiber: 2, vitaminA: 241,
      vitaminC: 93,
      potassium: 228,
      vitaminE: 1.5,
      folate: 62
    }
  },
  {
    id: "olive_oil",
    name: "Olive Oil",
    image: "/images/olive_oil.jpg",
    minQuantity: 10,
    maxQuantity: 30,
    maxSuggestionQuantity: 20,
    regionTags: ["global"],
    calories: 119,
    nutrients: { omega3: 0.1, vitaminE: 2 }
  },
  // ─── INDIA ─────────────────────────────────────────────────────
  {
    id: "dal",
    name: "Lentils",
    image: "/images/dal.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 170,
    nutrients: {
      protein: 9, fiber: 8, iron: 3.3, magnesium: 36, zinc: 1.3, selenium: 2.8, folate: 181,
      potassium: 369
    },
  },
  {
    id: "paneer",
    name: "Paneer",
    image: "/images/paneer.jpg",
    minQuantity: 50,
    maxQuantity: 150,
    maxSuggestionQuantity: 150,
    regionTags: ["india"],
    calories: 150,
    nutrients: { protein: 9, calcium: 104, zinc: 1, vitaminB12: 0.5, vitaminA: 85 },
  },
  {
    id: "roti",
    name: "Roti (Whole Wheat)",
    image: "/images/roti.jpg",
    minQuantity: 1,
    maxQuantity: 4,
    maxSuggestionQuantity: 3,
    regionTags: ["india"],
    calories: 120,
    nutrients: {
      protein: 3, fiber: 2.5, iron: 0.9, magnesium: 24, zinc: 0.6, folate: 44,
      potassium: 96
    },
  },
  {
    id: "idli",
    name: "Idli",
    image: "/images/idli.jpg",
    minQuantity: 2,
    maxQuantity: 6,
    maxSuggestionQuantity: 4,
    regionTags: ["india"],
    calories: 40,
    nutrients: { protein: 4, fiber: 1, iron: 0.8, magnesium: 14, folate: 10 },
  },
  {
    id: "dosa",
    name: "Dosa",
    image: "/images/dosa.jpg",
    minQuantity: 1,
    maxQuantity: 3,
    maxSuggestionQuantity: 2,
    regionTags: ["india"],
    calories: 110,
    nutrients: { protein: 3, fiber: 1.2, iron: 0.6, magnesium: 18, folate: 8 },
  },
  {
    id: "upma",
    name: "Upma",
    image: "/images/upma.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["india"],
    calories: 200,
    nutrients: { protein: 4, fiber: 2, iron: 0.9, magnesium: 20, folate: 15 },
  },
  {
    id: "poha",
    name: "Poha",
    image: "/images/poha.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["india"],
    calories: 150,
    nutrients: { protein: 3, fiber: 1.5, iron: 1.2, magnesium: 15, folate: 12 },
  },
  {
    id: "chole",
    name: "Chickpeas",
    image: "/images/chole.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 240,
    nutrients: {
      protein: 9, fiber: 7.5, iron: 2.5, magnesium: 48, zinc: 1.5, calcium: 49, folate: 172,
      potassium: 291
    },
  },
  {
    id: "curd",
    name: "Curd (Dahi)",
    image: "/images/curd.jpg",
    minQuantity: 150,
    maxQuantity: 200,
    maxSuggestionQuantity: 200,
    regionTags: ["india"],
    calories: 100,
    nutrients: {
      protein: 5, calcium: 183, vitaminB12: 0.5, zinc: 0.8, magnesium: 17, vitaminA: 75,
      potassium: 234
    },
  },
  {
    id: "besan_chilla",
    name: "Besan Chilla",
    image: "/images/besan_chilla.jpg",
    minQuantity: 2,
    maxQuantity: 4,
    maxSuggestionQuantity: 3,
    regionTags: ["india"],
    calories: 110,
    nutrients: {
      protein: 8, iron: 1.8, magnesium: 40, folate: 80
    }
  },
  // ─── US / WESTERN ───────────────────────────────────────────────
  {
    id: "greek_yogurt",
    name: "Greek Yogurt",
    image: "/images/greek_yogurt.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["us", "global"],
    calories: 100,
    nutrients: {
      protein: 15, calcium: 150, vitaminB12: 0.7, zinc: 1, magnesium: 17, potassium: 240,
      vitaminA: 60
    },
  },
  {
    id: "cottage_cheese",
    name: "Cottage Cheese",
    image: "/images/cottage_cheese.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 200,
    regionTags: ["us", "global"],
    calories: 120,
    nutrients: { protein: 11, calcium: 83, vitaminB12: 0.4, selenium: 9, zinc: 0.5, potassium: 104 },
  },
  {
    id: "quinoa",
    name: "Quinoa",
    image: "/images/quinoa.jpg",
    minQuantity: 50,
    maxQuantity: 150,
    maxSuggestionQuantity: 100,
    regionTags: ["us", "global"],
    calories: 60,
    nutrients: {
      protein: 7, fiber: 3, iron: 1.4, magnesium: 64, zinc: 1, selenium: 5, folate: 42,
      potassium: 172
    },
  },
  {
    id: "black_beans",
    name: "Black Beans",
    image: "/images/black_beans.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["us", "global"],
    calories: 130,
    nutrients: {
      protein: 9, fiber: 7.5, iron: 2.5, magnesium: 60, zinc: 1.1, calcium: 46, folate: 149,
      potassium: 355
    },
  },
  {
    id: "kidney_beans",
    name: "Kidney Beans",
    image: "/images/kidney_beans.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["us", "global"],
    calories: 120,
    nutrients: {
      protein: 9, fiber: 7, iron: 2.6, magnesium: 44, zinc: 1.3, calcium: 50, folate: 130,
      potassium: 405
    },
  },
  {
    id: "peanut_butter",
    name: "Peanut Butter",
    image: "/images/peanut_butter.jpg",
    minQuantity: 30,
    maxQuantity: 60,
    maxSuggestionQuantity: 30,
    regionTags: ["us", "global"],
    calories: 190,
    nutrients: {
      protein: 8, fiber: 1.2, magnesium: 49, zinc: 0.9, vitaminE: 2,
      folate: 45
    },
  },
  {
    id: "avocado",
    name: "Avocado",
    image: "/images/avocado.jpg",
    minQuantity: 75,
    maxQuantity: 150,
    maxSuggestionQuantity: 150,
    regionTags: ["us", "global"],
    calories: 120,
    nutrients: {
      fiber: 5, magnesium: 29, omega3: 0.1, iron: 0.6, potassium: 485,
      vitaminE: 2,
      folate: 81
    },
  },
  {
    id: "turkey",
    name: "Turkey",
    image: "/images/turkey.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["us", "global"],
    calories: 150,
    nutrients: { protein: 24, zinc: 2.5, selenium: 27, vitaminB12: 1.5, potassium: 239 }
  },
  {
    id: "soy_milk",
    name: "Soy Milk",
    image: "/images/soy_milk.jpg",
    minQuantity: 250,
    maxQuantity: 500,
    maxSuggestionQuantity: 400,
    regionTags: ["global"],
    calories: 110,
    nutrients: {
      protein: 7, calcium: 300, vitaminB12: 1.2, magnesium: 25, potassium: 300,
      vitaminE: 1
    }
  },
  {
    id: "pear",
    name: "Pear",
    image: "/images/pear.jpg",
    minQuantity: 1,
    maxQuantity: 2,
    maxSuggestionQuantity: 2,
    regionTags: ["global"],
    calories: 100,
    nutrients: {
      fiber: 5.5, magnesium: 12, vitaminC: 7,
      potassium: 116
    }
  },
  {
    id: "beetroot",
    name: "Beetroot",
    image: "/images/beetroot.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 43,
    nutrients: {
      iron: 0.8, magnesium: 23, fiber: 2.8, folate: 109,
      potassium: 305
    }
  },
  {
    id: "dates",
    name: "Dates",
    image: "/images/dates.jpg",
    minQuantity: 30,
    maxQuantity: 60,
    maxSuggestionQuantity: 40,
    regionTags: ["global"],
    calories: 85,
    nutrients: { iron: 0.9, magnesium: 13, fiber: 3, potassium: 167 }
  },
  {
    id: "almond_milk",
    name: "Almond Milk",
    image: "/images/almond_milk.jpg",
    minQuantity: 250,
    maxQuantity: 500,
    maxSuggestionQuantity: 400,
    regionTags: ["global"],
    calories: 40,
    nutrients: {
      calcium: 300, magnesium: 18, vitaminE: 3,
      potassium: 170
    }
  },
  {
    id: "sesame_seeds",
    name: "Sesame Seeds",
    image: "/images/sesame_seeds.jpg",
    minQuantity: 15,
    maxQuantity: 30,
    maxSuggestionQuantity: 20,
    regionTags: ["global"],
    calories: 85,
    nutrients: {
      calcium: 88, iron: 1.3, magnesium: 32, zinc: 1, vitaminE: 0.3,
      folate: 25
    }
  },
  {
    id: "cashews",
    name: "Cashews",
    image: "/images/cashews.jpg",
    minQuantity: 20,
    maxQuantity: 40,
    maxSuggestionQuantity: 30,
    regionTags: ["global"],
    calories: 110,
    nutrients: {
      protein: 5, magnesium: 82, zinc: 1.6, iron: 1.9, vitaminE: 0.9,
      folate: 25
    }
  },
  {
    id: "cucumber",
    name: "Cucumber",
    image: "/images/cucumber.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 15,
    nutrients: {
      fiber: 1.5, magnesium: 13, vitaminC: 3,
      potassium: 147
    }
  },
  {
    id: "bell_pepper",
    name: "Bell Pepper",
    image: "/images/bell_pepper.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 30,
    nutrients: {
      fiber: 2.1, magnesium: 12, iron: 0.5, vitaminC: 128,
      vitaminA: 157,
      folate: 46,
      potassium: 211
    }
  },
  {
    id: "peas",
    name: "Green Peas",
    image: "/images/peas.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 81,
    nutrients: {
      protein: 5,
      fiber: 5,
      iron: 1.5,
      magnesium: 33, folate: 65,
      potassium: 244
    }
  },
  {
    id: "cabbage",
    name: "Cabbage",
    image: "/images/cabbage.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 25,
    nutrients: {
      fiber: 2.5,
      magnesium: 12,
      iron: 0.5, vitaminC: 36,
      folate: 43,
      potassium: 170
    }
  },
  {
    id: "papaya",
    name: "Papaya",
    image: "/images/papaya.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 60,
    nutrients: {
      fiber: 2.5,
      magnesium: 21,
      calcium: 20,
      iron: 0.4, vitaminC: 60,
      vitaminA: 47,
      folate: 37,
      potassium: 182
    }
  },
  {
    id: "muskmelon",
    name: "Muskmelon",
    image: "/images/muskmelon.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["global"],
    calories: 50,
    nutrients: {
      fiber: 1.8,
      magnesium: 12,
      calcium: 9,
      iron: 0.2,
      vitaminC: 36,
      vitaminA: 169,
      potassium: 267,
      folate: 21
    }
  },
  {
    id: "zucchini",
    name: "Zucchini",
    image: "/images/zucchini.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 17,
    nutrients: {
      fiber: 1, magnesium: 18, vitaminC: 17,
      potassium: 261,
      vitaminA: 10,
      folate: 24
    }
  },
  {
    id: "lettuce",
    name: "Lettuce",
    image: "/images/lettuce.jpg",
    minQuantity: 50,
    maxQuantity: 150,
    maxSuggestionQuantity: 100,
    regionTags: ["global"],
    calories: 8,
    nutrients: {
      fiber: 1.3, magnesium: 13, vitaminA: 166,
      folate: 73,
      potassium: 194
    }
  },
  {
    id: "eggplant",
    name: "Eggplant",
    image: "/images/eggplant.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["global"],
    calories: 25,
    nutrients: {
      fiber: 3, magnesium: 14, iron: 0.2, potassium: 229,
      folate: 22
    }
  },
  {
    id: "chia_seeds",
    name: "Chia Seeds",
    image: "/images/chia_seeds.jpg",
    minQuantity: 15,
    maxQuantity: 30,
    maxSuggestionQuantity: 20,
    regionTags: ["us", "global"],
    calories: 70,
    nutrients: {
      omega3: 5, fiber: 5.5, calcium: 179, iron: 1.1, magnesium: 47, zinc: 0.6, potassium: 115,
      vitaminE: 0.5
    },
  },
  {
    id: "whole_wheat_bread",
    name: "Whole Wheat Bread",
    image: "/images/whole_wheat_bread.jpg",
    minQuantity: 2,
    maxQuantity: 4,
    maxSuggestionQuantity: 4,
    regionTags: ["us", "global"],
    calories: 80,
    nutrients: {
      protein: 5, fiber: 3.8, iron: 1.8, magnesium: 24, selenium: 14, zinc: 0.8, folate: 60,
      potassium: 120
    },
  },

  // ─── EUROPE ─────────────────────────────────────────────────────
  {
    id: "whole_wheat_pasta",
    name: "Whole Wheat Pasta",
    image: "/images/pasta.jpg",
    minQuantity: 75,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["europe", "global"],
    calories: 260,
    nutrients: {
      protein: 7, fiber: 4.5, iron: 1.5, magnesium: 36, selenium: 26, zinc: 1.2, folate: 70,
      potassium: 120
    },
  },
  {
    id: "cheddar_cheese",
    name: "Cheddar Cheese",
    image: "/images/cheddar.jpg",
    minQuantity: 30,
    maxQuantity: 60,
    maxSuggestionQuantity: 60,
    regionTags: ["europe", "global"],
    calories: 120,
    nutrients: { protein: 7, calcium: 200, vitaminB12: 0.4, selenium: 4, zinc: 1, vitaminA: 265 },
  },
  {
    id: "mozzarella",
    name: "Mozzarella",
    image: "/images/mozzarella.jpg",
    minQuantity: 50,
    maxQuantity: 100,
    maxSuggestionQuantity: 100,
    regionTags: ["europe", "global"],
    calories: 140,
    nutrients: { protein: 7, calcium: 186, zinc: 1.1, vitaminB12: 0.5, vitaminA: 179 },
  },
  {
    id: "plain_yogurt",
    name: "Plain Yogurt",
    image: "/images/yogurt.jpg",
    minQuantity: 150,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["europe", "global"],
    calories: 90,
    nutrients: {
      protein: 6, calcium: 190, vitaminB12: 0.6, magnesium: 17, zinc: 0.9, vitaminA: 90,
      potassium: 240
    },
  },
  {
    id: "mushrooms",
    name: "Mushrooms",
    image: "/images/mushrooms.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["europe", "global"],
    calories: 22,
    nutrients: {
      vitaminD: 2, selenium: 9, zinc: 0.5, iron: 0.5, fiber: 1, protein: 3, potassium: 318,
      folate: 17
    },
  },

  // ─── ASIA ────────────────────────────────────────────────────────
  {
    id: "soy_chunks",
    name: "Soy Chunks",
    image: "/images/soy_chunks.jpg",
    minQuantity: 50,
    maxQuantity: 100,
    maxSuggestionQuantity: 60,
    regionTags: ["india", "asia"],
    calories: 170,
    nutrients: {
      protein: 26, fiber: 3, iron: 4, calcium: 60, magnesium: 60, zinc: 1.5, potassium: 350,
      folate: 90
    },
  },
  {
    id: "tempeh",
    name: "Tempeh",
    image: "/images/tempeh.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["asia", "global"],
    calories: 190,
    nutrients: {
      protein: 19, calcium: 111, iron: 2.1, magnesium: 81, zinc: 1.7, vitaminB12: 0.1, potassium: 412,
      folate: 24
    },
  },
  {
    id: "bok_choy",
    name: "Bok Choy",
    image: "/images/bok_choy.jpg",
    minQuantity: 100,
    maxQuantity: 300,
    maxSuggestionQuantity: 200,
    regionTags: ["asia"],
    calories: 15,
    nutrients: {
      calcium: 105, iron: 0.8, magnesium: 19, fiber: 1, vitaminC: 45,
      vitaminA: 223,
      folate: 66,
      potassium: 252
    },
  },
  {
    id: "edamame",
    name: "Edamame",
    image: "/images/edamame.jpg",
    minQuantity: 100,
    maxQuantity: 200,
    maxSuggestionQuantity: 150,
    regionTags: ["asia"],
    calories: 120,
    nutrients: {
      protein: 11, fiber: 4.5, iron: 2.3, calcium: 60, magnesium: 64, zinc: 1.4, omega3: 0.6, folate: 311,
      potassium: 436
    },
  },
  {
    id: "miso",
    name: "Miso",
    image: "/images/miso.jpg",
    minQuantity: 20,
    maxQuantity: 60,
    maxSuggestionQuantity: 40,
    regionTags: ["asia"],
    calories: 40,
    nutrients: { protein: 2.5, iron: 0.7, calcium: 24, zinc: 0.6, selenium: 3, potassium: 57 },
  },
];

export const calculateCaloriesRequirement = (profile: UserProfile | null): number => {
  if (!profile) return 0;

  const height = profile.height || 170;
  let bmr = 0;

  if (profile.gender === "Male") {
    bmr = 10 * profile.weight + 6.25 * height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * height - 5 * profile.age - 161;
  }

  const activityFactors: Record<string, number> = {
    "Sedentary": 1.2,
    "Light activity": 1.375,
    "Moderate activity": 1.55,
    "Active": 1.725,
    "Very active": 1.9
  };

  const factor = activityFactors[profile.activityLevel] || 1.2;
  return Math.round(bmr * factor);
};

export const calculateRequirement = (nutrientId: string, profile: UserProfile | null): number => {
  if (!profile) return 0;

  const nutrient = nutrients.find((n) => n.id === nutrientId);
  if (!nutrient) return 0;

  if (nutrientId === "protein") {
    const multipliers: Record<string, number> = {
      Sedentary: 0.8,
      "Light activity": 1.0,
      "Moderate activity": 1.2,
      Active: 1.5,
      "Very active": 1.8,
    };
    return profile.weight * (multipliers[profile.activityLevel] || 0.8);
  }

  if (profile.gender === "Female") {
    return nutrient.femaleRequired ?? nutrient.baseRequired ?? 0;
  } else if (profile.gender === "Male") {
    return nutrient.maleRequired ?? nutrient.baseRequired ?? 0;
  }

  return nutrient.baseRequired ?? 0;
};

// Map country name -> region tag used in food data
export const COUNTRY_REGION_MAP: Record<string, string> = {
  "India": "india",
  "United States": "us",
  "United Kingdom": "uk",
  "Canada": "canada",
  "Australia": "australia",
  "Germany": "europe",
  "France": "europe",
  "Italy": "europe",
  "Spain": "europe",
  "Netherlands": "europe",
  "Japan": "japan",
  "China": "china",
  "South Korea": "korea",
  "Singapore": "asia",
  "UAE": "asia",
  "Other": "global",
};

export const COUNTRIES = Object.keys(COUNTRY_REGION_MAP);

// Get foods filtered by user's country
export const getRegionFoods = (country?: string): FoodItem[] => {
  if (!country) return foods.filter(f => f.regionTags.includes("global"));
  const tag = COUNTRY_REGION_MAP[country];
  if (!tag) return foods.filter(f => f.regionTags.includes("global"));
  return foods.filter(f => f.regionTags.includes("global") || f.regionTags.includes(tag));
};

// Get foods relevant to a specific nutrient
export const getFoodsForNutrient = (nutrientId: string, country?: string): FoodItem[] => {
  const regionFoods = getRegionFoods(country);
  return regionFoods.filter((f) => (f.nutrients[nutrientId] ?? 0) > 0);
};

export interface Suggestion {
  food: FoodItem;
  neededServings: number;
  meetsGoal: boolean;
}

export const getNutrientSuggestions = (
  nutrientId: string,
  remaining: number,
  currentQuantities: Record<string, number>,
  country?: string
): Suggestion[] => {
  const relevant = getFoodsForNutrient(nutrientId, country);

  return relevant
    .map((food) => {
      const perServing = food.nutrients[nutrientId] || 0;
      const currentQty = currentQuantities[food.id] || 0;

      // Determine the hard safety limit for suggestions
      const absoluteMax = food.maxQuantity || 9999;
      const suggestionCap = food.maxSuggestionQuantity || absoluteMax;
      const finalCap = Math.min(absoluteMax, suggestionCap);

      // Capacity available for more food today
      const capacityAvailable = Math.max(0, finalCap - currentQty);
      if (capacityAvailable <= 0) return null;

      // Servings needed theoretically to fill the gap
      let servingsNeeded = remaining / perServing;

      // Apply safety cap FIRST
      servingsNeeded = Math.min(servingsNeeded, capacityAvailable / food.minQuantity);

      // Quantity for rounding
      let rawQty = servingsNeeded * food.minQuantity;

      // Apply realistic rounding
      if (food.id === 'egg' || food.id === 'banana') {
        rawQty = Math.ceil(servingsNeeded);
      } else if (['paneer', 'tofu', 'dal', 'spinach', 'salmon'].includes(food.id)) {
        rawQty = Math.round(rawQty / 25) * 25;
      } else if (food.id === 'oats') {
        rawQty = Math.round(rawQty / 10) * 10;
      } else if (food.id === 'milk') {
        rawQty = Math.round(rawQty / 100) * 100;
      } else if (food.id === 'chicken') {
        rawQty = Math.round(rawQty / 50) * 50;
      } else {
        rawQty = Math.round(rawQty / 5) * 5;
      }

      // Ensure rounding didn't exceed the safety limit
      const finalQty = Math.min(rawQty, capacityAvailable);
      const finalNeededServings = finalQty / food.minQuantity;

      return {
        food,
        neededServings: finalNeededServings,
        density: perServing,
        meetsGoal: (finalQty * (perServing / food.minQuantity)) >= remaining * 0.95 // almost completes
      };
    })
    .filter((s): s is (Suggestion & { density: number; meetsGoal: boolean }) => s !== null && s.neededServings > 0)
    .sort((a, b) => b.density - a.density)
    .slice(0, 3)
    .map(({ food, neededServings, meetsGoal }) => ({ food, neededServings, meetsGoal }));
};
