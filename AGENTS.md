# ChefWise - Recipe Cost Calculator

## Project Summary

ChefWise is a web application that allows users to:

- **Track supermarket product prices** with quantity and unit information
- **Create recipes** by combining products as ingredients
- **Calculate the true cost** of home cooking vs buying ready-made items
- **Compare prices** across different supermarkets
- **Track price history** to see how costs change over time
- **Share recipes** publicly via unique share links

---

## Tech Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Frontend      | Nuxt 3 (Vue 3 + TypeScript)     |
| Database      | Supabase (PostgreSQL + Auth)    |
| Image Storage | Cloudinary                      |
| Styling       | Tailwind CSS                    |
| Build Tool    | Vite                            |
| Code Quality  | ESLint, Prettier, Husky         |
| Testing       | Vitest (unit), Playwright (e2e) |
| i18n          | @nuxtjs/i18n (en-US, es-ES)     |

---

## Project Structure

```
app/
├── assets/css/          # Global styles (Tailwind)
├── components/          # Vue components organized by domain
│   ├── global/          # Shared UI components (ThemeSwitcher, LanguageSelector)
│   └── supermarkets/    # Supermarket-specific components
├── composables/         # Vue composables for data fetching and state
├── layouts/             # Page layouts (default, auth, fullscreen)
├── middleware/          # Route middleware (auth, guest)
├── pages/               # File-based routing
├── types/               # TypeScript interfaces and types
└── utils/               # Utility functions
i18n/locales/            # Translation files (en-US.json, es-ES.json)
supabase/migrations/     # Database migration files
```

---

## Common Patterns

### 1. Composables Pattern

All data fetching and state management uses Vue composables located in `/composables/`.

```typescript
// Example: useSupermarkets.ts
export function useSupermarkets() {
  const supermarkets = ref<Supermarket[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getSupermarkets() {
    /* ... */
  }
  async function createSupermarket(data: CreateSupermarketDTO) {
    /* ... */
  }
  async function updateSupermarket(id: string, data: UpdateSupermarketDTO) {
    /* ... */
  }
  async function deleteSupermarket(id: string) {
    /* ... */
  }

  return {
    supermarkets,
    loading,
    error,
    getSupermarkets,
    createSupermarket,
    updateSupermarket,
    deleteSupermarket,
  };
}
```

### 2. DTO Pattern for CRUD Operations

Use Data Transfer Objects for create/update operations:

- `Create[Entity]DTO` - Fields required to create an entity
- `Update[Entity]DTO` - Partial fields for updating (all optional)

### 3. Route Middleware

```typescript
// Protected routes (requires authentication)
definePageMeta({
  middleware: "auth",
});

// Guest-only routes (redirects if authenticated)
definePageMeta({
  middleware: "guest",
});
```

### 4. Layouts

- `default` - Main app layout with navigation (authenticated pages)
- `auth` - Minimal layout for login/register pages
- `fullscreen` - No navigation, full viewport

### 5. Component File Structure

Each Vue component follows this structure:

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props and emits
// 3. Composables
// 4. Refs and reactive state
// 5. Computed properties
// 6. Functions
// 7. Lifecycle hooks
</script>

<template>
  <!-- Template with Tailwind classes -->
</template>
```

### 6. Form Handling Pattern

Forms emit data to parent components:

```typescript
const emit = defineEmits<{
  submit: [data: CreateSupermarketDTO];
  cancel: [];
}>();
```

---

## Business Logic Rules

### Unit System

The app uses a standardized unit system with three categories:

| Category | Base Unit | Available Units |
| -------- | --------- | --------------- |
| Volume   | ml        | ml, cl, dl, l   |
| Weight   | g         | mg, g, kg       |
| Count    | unit      | unit, dozen     |

**Conversion Rules:**

- Units can only be converted within the same category
- All prices are calculated by converting to base unit first
- Cross-category conversions (e.g., ml to g) are not allowed

### Price Calculation

1. **Price per base unit** = `product.current_price / convertToBaseUnit(product.quantity, product.unit)`
2. **Ingredient cost** = `pricePerBaseUnit * convertToBaseUnit(ingredient.quantity, ingredient.unit)`
3. **Recipe total cost** = Sum of all ingredient costs
4. **Cost per serving** = `totalCost / recipe.servings`

### Data Ownership (RLS)

All user data is protected by Supabase Row Level Security:

- Users can only view/edit/delete their own data
- Foreign keys cascade on delete (deleting a supermarket deletes its products)
- Public recipes are readable by anyone via share token

### Price History

- Price history is automatically recorded via database trigger
- Trigger fires on INSERT and when `current_price` changes on UPDATE
- History is read-only (no manual edits)

---

## Database Schema

### Core Tables

| Table                   | Purpose                            |
| ----------------------- | ---------------------------------- |
| `users`                 | User profiles (extends auth.users) |
| `supermarkets`          | Stores where products are bought   |
| `products`              | Items with prices and quantities   |
| `product_price_history` | Historical price tracking          |
| `recipes`               | User-created recipes               |
| `recipe_ingredients`    | Products used in recipes           |

### Key Relationships

```
users (1) ─── (n) supermarkets
users (1) ─── (n) products
users (1) ─── (n) recipes
supermarkets (1) ─── (n) products
products (1) ─── (n) recipe_ingredients
recipes (1) ─── (n) recipe_ingredients
products (1) ─── (n) product_price_history
```

---

## Coding Standards

### TypeScript

- Always use strict typing, avoid `any`
- Define interfaces in `/types/` directory
- Use type guards for runtime checks

### Vue/Nuxt

- Use `<script setup lang="ts">` syntax
- Prefer composition API over options API
- Use auto-imported composables (no manual imports for Vue/Nuxt)

### Tailwind CSS

- Use utility classes directly in templates
- Custom colors and spacing defined in `tailwind.config.ts`
- Dark mode supported via class strategy

### Internationalization (i18n)

- All user-facing text must use `$t('key')` translation function
- Translation keys organized by feature in JSON files
- Support English (en-US) and Spanish (es-ES)

### Git Workflow

- Branch naming: `feature/task-X.Y-description`, `bugfix/issue-description`
- Commit format: `type(scope): subject` (feat, fix, docs, style, refactor, test, chore)
- Pre-commit hooks run ESLint and Prettier

### Error Handling

- Wrap async operations in try/catch
- Expose error state from composables
- Show user-friendly error messages via toast/alert components

---

## Environment Variables

Required environment variables (see `.env.example`):

```
SUPABASE_URL=
SUPABASE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run type-check   # Run TypeScript checks
npm run test:unit    # Run Vitest unit tests
npm run test:e2e     # Run Playwright e2e tests
```

---

## Feature Status

| Phase | Feature                     | Status      |
| ----- | --------------------------- | ----------- |
| 0     | Project Setup               | ✅ Complete |
| 1     | Authentication              | 🚧 Partial  |
| 2     | Supermarket Management      | 🚧 Partial  |
| 3     | Unit Conversion System      | ⏳ Pending  |
| 4     | Product Management          | ⏳ Pending  |
| 5     | Recipe Management           | ⏳ Pending  |
| 6     | Recipe Sharing              | ⏳ Pending  |
| 7     | Dashboard & Analytics       | ⏳ Pending  |
| 8-12  | Landing, Navigation, Polish | ⏳ Pending  |
