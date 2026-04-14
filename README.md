# MicroTrack | Precision Micronutrient Tracker

MicroTrack is a high-performance, minimalist luxury web application designed for people who want more than just calorie counting. It focuses on **micronutrient optimization**, helping users identify nutritional gaps, maintain consistency streaks, and reach their biological peak through data-driven nutrition.

---

## 🛠 Tech Stack

| Technology | Purpose | Rationale |
| :--- | :--- | :--- |
| **React** | Core Framework | Component-based architecture for a highly interactive and modular UI. |
| **TypeScript** | Type Safety | Ensures reliability in nutrient calculations and data synchronization logic. |
| **Vite** | Build Tool | Optimized development experience with lightning-fast HMR and build times. |
| **Tailwind CSS** | Styling | Utility-first styling enabling the "minimal luxury" aesthetic with high flexibility. |
| **shadcn/ui** | UI Components | Accessible, headless components that maintain design consistency. |
| **Zustand** | State Management | Lightweight, dev-friendly state logic with built-in persistence and low boilerplate. |
| **React Router** | Routing | Seamless SPA navigation with protected route management. |
| **Supabase** | Backend | Rapid integration of Auth, Real-time Database, and API services. |
| **PostgreSQL** | Database | Relational storage for profiles and history, with JSONB support for flexible nutrient logs. |
| **jspdf** | PDF Generation | Client-side generation of professional nutrition reports. |
| **Recharts** | Data Visualization | Dynamic charts for daily and weekly nutrient trend analysis. |

---

## 🏗 Architecture Overview

MicroTrack follows a **Client-Side First** architecture with a robust persistence layer.

### Data Flow
1. **User Input:** User adjusts food quantities via sliders on the Dashboard or Detail pages.
2. **Local State (Zustand):** Updates the `foodQuantities` map reactively.
3. **UI Sync:** Progress bars and daily totals recalculate instantly across all views.
4. **Cloud Sync (Supabase):** Clicking "Save Day" triggers an upsert to the `history` table.
5. **Persistence Loop:** The store reloads the history from Supabase, recalculates streaks, and resets daily progress for a fresh start.

---

## 📂 Folder Structure

```text
src/
├── components/   # Reusable UI parts (Progress bars, Charts, Layouts)
├── data/         # Core datasets (Nutrients, Food Items, Safety Limits)
├── hooks/        # Custom React hooks for Auth and Tracking logic
├── lib/          # External library initializations (Supabase Client)
├── pages/        # Main application views (Dashboard, History, etc.)
├── store/        # Zustand store definitions (The brain of the app)
└── utils/        # Helper functions (Formatting, Date manipulation)
```

---

## 🧠 State Management Logic

The application state is centralized in `trackingStore.ts` using **Zustand**.

### Managed Entities:
- **`userProfile`**: Stores bio-metric data (Weight, Height, Age, Activity) used for requirement math.
- **`foodQuantities`**: Temporary daily log of consumed foods.
- **`history`**: Array of snapshots for previous days.
- **`streaks`**: Dynamically calculated current and longest consistency records.
- **`requirements`**: Nutrient targets calculated based on the active profile.

**Why Centralized?**
Micronutrient tracking involves many-to-many relationships (one food affects 15+ nutrients). Centralized state ensures that changing a quantity in a sub-page is reflected globally in the dashboard headers and progress indicators without prop drilling.

---

## ⚖️ Nutrient Calculation Logic

### Dynamic Requirements
Targets are not static. MicroTrack calculates them based on:
- **Calories:** Harris-Benedict BMR formula adjusted by activity level.
- **Protein:** 0.8g to 1.8g per kg of body weight based on activity.
- **Micros:** Gender-specific RDA (Recommended Dietary Allowance) values for Iron, Calcium, Zinc, etc.

### Implementation Highlights
- **Cross-Nutrient Updates:** Each `FoodItem` contains a mapping of multiple nutrients. Updating one quantity loops through all nutrient IDs to recalculate totals.
- **Safety Limits:** Each food has `maxQuantity` and `maxSuggestionQuantity` caps to prevent the algorithm from suggesting unhealthy intakes.
- **Duplicate Prevention:** The database utilizes a composite unique constraint on `(user_id, date_key)` to ensure only one entry exists per calendar day.

---

## 🔐 Authentication Flow

1. **Login/Signup:** Managed via Supabase Auth (supports Email/Password and Google OAuth).
2. **Session Persistence:** Auth state is monitored via `onAuthStateChange`.
3. **Profile Loading:** On initial load, the app fetches the user's profile from the `profiles` table and hydrates the Zustand store.
4. **Protected Routes:** Unauthorized users are redirected to the Landing page to preserve data privacy.

---

## 🗄 Database Schema

### `profiles` Table
Stores user configuration and bio-metrics.
- `id`: UUID (Primary Key)
- `height`, `weight`, `age`, `gender`, `activity_level`, `country`

### `history` Table
Stores historical nutrition snapshots.
- `user_id`: UUID (Foreign Key)
- `date_key`: TEXT (Unique identifier formatted as `YYYY-MM-DD`)
- `nutrient_totals`: JSONB (Snapshot of all nutrient values at save time)
- `foods`: JSONB (Mapping of food IDs to quantities consumed)

---

## 🚀 Key Features

- **Daily Save System:** Atomic upsert operation that preserves history even if a user saves multiple times in one day.
- **Streak Algorithm:** Scans the sorted history array for consecutive `date_key` gaps and determines continuity.
- **Food Suggestions:** A gap-filling algorithm that ranks foods by nutrient density relative to the user's remaining requirement for a specific nutrient.
- **PDF Export:** Translates internal JSONB history data into a formatted report for doctors or nutritionists.
- **Deficiency Insights:** Real-time identification of nutrients under 100% target, providing prioritized corrective actions.

---

## 🚢 Deployment Readiness

### Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your project anonymous API key.

### Configuration
- **Supabase:** Enable Email and Google providers in the Auth settings.
- **Build Process:** Run `npm run build` to generate the optimized static bundle in the `/dist` directory.

---

## 📖 Developer Onboarding

1. **Clone & Install:**
   ```bash
   git clone <repo-url>
   npm install
   ```
2. **Logic Entry Point:**
   - Modify `src/data/nutrients.ts` to add new foods or adjust requirements.
   - Modify `src/store/trackingStore.ts` to add new global state or sync logic.
3. **UI Customization:**
   - Components are built using `shadcn/ui`. Check `components.json` for base configurations.
   - Tailwind theme is located in `tailwind.config.ts`.
