import fs from 'fs';

let data = fs.readFileSync('src/data/nutrients.ts', 'utf8');

// 1. Add height to UserProfile
data = data.replace(/export interface UserProfile \{([\s\S]*?)\}/, (match, inner) => {
    return 'export interface UserProfile {' + inner + '\n  height?: number;\n}';
});

// 2. Add 'calories' to static NutrientInfo array
data = data.replace(
    /export const nutrients: NutrientInfo\[\] = \[/, 
    'export const nutrients: NutrientInfo[] = [\n  { id: "calories", name: "Calories", unit: "kcal" },'
);

// 3. Calorie dictionary per food (approx per minQuantity)
const caloriesMap = {
  oats: 150, dark_chocolate: 120, pumpkin_seeds: 110, sardines: 200, sunflower_seeds: 115, egg: 70, milk: 150, spinach: 23, banana: 105, shrimp: 99, blueberries: 42, strawberries: 32, apple: 95, almonds: 115, walnuts: 130, peanuts: 170, chicken_breast: 165, salmon: 208, tuna: 130, tofu: 144, brown_rice: 110, white_rice: 130, potato: 90, sweet_potato: 100, broccoli: 34, carrot: 41, flaxseeds: 80, green_beans: 31, sprouts: 40, orange: 60, turmeric: 10, kale: 50, olive_oil: 119, dal: 170, paneer: 150, roti: 120, idli: 40, dosa: 110, upma: 200, poha: 150, chole: 240, curd: 100, besan_chilla: 110, greek_yogurt: 100, cottage_cheese: 120, quinoa: 60, black_beans: 130, kidney_beans: 120, peanut_butter: 190, avocado: 120, turkey: 150, soy_milk: 110, pear: 100, beetroot: 43, dates: 85, almond_milk: 40, sesame_seeds: 85, cashews: 110, cucumber: 15, bell_pepper: 30, peas: 81, cabbage: 25, papaya: 60, muskmelon: 50, zucchini: 17, lettuce: 8, eggplant: 25, chia_seeds: 70, whole_wheat_bread: 80, whole_wheat_pasta: 260, cheddar_cheese: 120, mozzarella: 140, plain_yogurt: 90, mushrooms: 22, soy_chunks: 170, tempeh: 190, bok_choy: 15, edamame: 120, miso: 40
};

// Replace each food item's nutrients object to include calories
for (const [id, cals] of Object.entries(caloriesMap)) {
    const rx = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?nutrients:\\s*\\{)`);
    data = data.replace(rx, `$1 calories: ${cals}, `);
}

// 4. Update calculateRequirement to support Mifflin-St Jeor
const oldCalcReq = `export const calculateRequirement = (nutrientId: string, profile: UserProfile | null): number => {
  if (!profile) return 0;`;

const newCalcReq = `export const calculateRequirement = (nutrientId: string, profile: UserProfile | null): number => {
  if (!profile) return 0;
  
  if (nutrientId === "calories") {
    const height = profile.height || 170; // fallback
    let bmr = 10 * profile.weight + 6.25 * height - 5 * profile.age;
    if (profile.gender === "Female") bmr -= 161;
    else bmr += 5; // Male or Other
    
    let activityMultiplier = 1.2;
    if (profile.activityLevel === "Light activity") activityMultiplier = 1.375;
    else if (profile.activityLevel === "Moderate activity") activityMultiplier = 1.55;
    else if (profile.activityLevel === "Active") activityMultiplier = 1.725;
    else if (profile.activityLevel === "Very active") activityMultiplier = 1.9;
    
    return Math.round(bmr * activityMultiplier);
  }`;

data = data.replace(oldCalcReq, newCalcReq);

fs.writeFileSync('src/data/nutrients.ts', data);
console.log("nutrients.ts updated successfully!");
