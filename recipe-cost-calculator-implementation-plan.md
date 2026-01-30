# Recipe Cost Calculator - Implementation Plan

## Project Overview

A web application that allows users to track supermarket product prices, create recipes, and calculate the true cost of home cooking vs buying ready-made items.

**Tech Stack:**

- Frontend: Nuxt 3
- Database: Supabase
- Image Storage: Cloudinary
- Styling: Tailwind CSS
- Build Tool: Vite
- Code Quality: ESLint, Prettier, Husky
- Testing: Vitest (unit), Playwright (e2e)

---

## Phase 0: Project Setup & Infrastructure

**Goal:** Set up the development environment and foundational tools

### Task 0.1: Initialize Project Structure

**Status:** ✅ Complete

#### Subtasks:

- [x] Create new Nuxt 3 project with TypeScript
- [x] Configure Vite build settings
- [x] Set up project folder structure (`/components`, `/pages`, `/composables`, `/types`, `/utils`)
- [x] Create `.env.example` file with required environment variables
- [x] Initialize Git repository

**Acceptance Criteria:**

- Project runs with `npm run dev`
- TypeScript properly configured
- All folders created and organized

---

### Task 0.2: Configure Code Quality Tools

**Status:** ✅ Complete

#### Subtasks:

- [x] Install and configure ESLint with Vue/Nuxt rules
- [x] Install and configure Prettier
- [x] Set up ESLint + Prettier integration (no conflicts)
- [x] Configure Husky for pre-commit hooks
- [x] Add pre-commit hook for linting and formatting
- [x] Create `.eslintrc.js` and `.prettierrc` configuration files
- [x] Add scripts to `package.json`: `lint`, `format`, `type-check`

**Acceptance Criteria:**

- Pre-commit hooks prevent commits with linting errors
- Code auto-formats on save (if IDE configured)
- `npm run lint` passes without errors

---

### Task 0.3: Configure Tailwind CSS

**Status:** ✅ Complete

#### Subtasks:

- [x] Install Tailwind CSS and dependencies
- [x] Configure `tailwind.config.js` with custom theme
- [x] Set up CSS purge settings for production
- [x] Create base styles file (`assets/css/main.css`)
- [x] Import Tailwind directives
- [x] Configure Nuxt to use Tailwind

**Acceptance Criteria:**

- Tailwind utility classes work in components
- Custom theme colors accessible
- Production build purges unused CSS

---

### Task 0.4: Set Up Testing Framework

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Install Vitest and configure for unit testing
- [ ] Create `vitest.config.ts`
- [ ] Set up test utilities and helpers
- [ ] Install Playwright for e2e testing
- [ ] Configure Playwright (`playwright.config.ts`)
- [ ] Create test folder structure (`/tests/unit`, `/tests/e2e`)
- [ ] Write sample test to verify setup
- [ ] Add test scripts to `package.json`

**Acceptance Criteria:**

- `npm run test:unit` executes Vitest
- `npm run test:e2e` executes Playwright
- Sample tests pass

---

### Task 0.5: Configure Supabase

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create Supabase project
- [ ] Install Supabase client library
- [ ] Configure Supabase environment variables
- [ ] Create Supabase client composable (`/composables/useSupabase.ts`)
- [ ] Test connection to Supabase
- [ ] Enable Row Level Security (RLS) on Supabase

**Acceptance Criteria:**

- Supabase client successfully connects
- Environment variables properly loaded
- RLS enabled on database

---

### Task 0.6: Configure Cloudinary

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create Cloudinary account
- [ ] Install Cloudinary SDK
- [ ] Configure Cloudinary environment variables
- [ ] Create Cloudinary upload utility (`/utils/cloudinary.ts`)
- [ ] Test image upload functionality
- [ ] Configure upload presets and transformations

**Acceptance Criteria:**

- Images can be uploaded to Cloudinary
- Image URLs are returned correctly
- Transformations work (resize, optimize)

---

## Phase 1: Authentication & User Management

**Goal:** Implement user registration, login, and session management

### Task 1.1: Set Up Database Schema for Users

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `users` table in Supabase (extends auth.users)
- [ ] Define user profile fields (email, created_at, updated_at)
- [ ] Set up RLS policies for users table
- [ ] Create database migration file
- [ ] Test user table creation

**Database Schema:**

```sql
-- users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

**Acceptance Criteria:**

- Users table created with proper schema
- RLS policies prevent unauthorized access
- Migration file documented

---

### Task 1.2: Create Authentication Pages

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/login` page component
- [ ] Create `/app/register` page component
- [ ] Design login form (email, password)
- [ ] Design registration form (email, password, confirm password)
- [ ] Add form validation (email format, password strength)
- [ ] Style forms with Tailwind CSS
- [ ] Add loading states for form submission

**Acceptance Criteria:**

- Login page accessible at `/app/login`
- Register page accessible at `/app/register`
- Forms have proper validation
- UI is responsive and styled

---

### Task 1.3: Implement Authentication Logic

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create auth composable (`/composables/useAuth.ts`)
- [ ] Implement `signUp()` function
- [ ] Implement `signIn()` function
- [ ] Implement `signOut()` function
- [ ] Implement `getCurrentUser()` function
- [ ] Handle authentication errors (wrong password, email exists, etc.)
- [ ] Store user session in Supabase auth
- [ ] Create authenticated user state management

**Acceptance Criteria:**

- Users can register with email/password
- Users can log in with credentials
- Users can log out
- Session persists across page refreshes
- Errors displayed to user

---

### Task 1.4: Create Authentication Middleware

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create middleware file (`/middleware/auth.ts`)
- [ ] Check if user is authenticated
- [ ] Redirect unauthenticated users to `/app/login`
- [ ] Allow access to authenticated users
- [ ] Apply middleware to protected routes
- [ ] Create public middleware for login/register pages

**Acceptance Criteria:**

- Protected routes redirect to login if not authenticated
- Authenticated users can access `/app/*` routes
- Login/register pages accessible without authentication

---

### Task 1.5: Write Authentication Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write unit tests for `useAuth` composable
- [ ] Write e2e test for registration flow
- [ ] Write e2e test for login flow
- [ ] Write e2e test for logout flow
- [ ] Write e2e test for middleware redirect
- [ ] Test error handling scenarios

**Acceptance Criteria:**

- All unit tests pass
- E2E tests cover complete auth flows
- Edge cases tested (invalid email, weak password)

---

## Phase 2: Supermarket Management

**Goal:** Allow users to create, read, update, and delete supermarkets

### Task 2.1: Create Supermarkets Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `supermarkets` table in Supabase
- [ ] Define columns: id, user_id, name, location, logo_url, created_at, updated_at
- [ ] Set up foreign key constraint to users table
- [ ] Create RLS policies (users can only manage their own supermarkets)
- [ ] Create indexes on `user_id` for performance
- [ ] Create database migration file

**Database Schema:**

```sql
CREATE TABLE public.supermarkets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_supermarkets_user_id ON public.supermarkets(user_id);

-- RLS Policies
ALTER TABLE public.supermarkets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own supermarkets"
  ON public.supermarkets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supermarkets"
  ON public.supermarkets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own supermarkets"
  ON public.supermarkets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own supermarkets"
  ON public.supermarkets FOR DELETE
  USING (auth.uid() = user_id);
```

**Acceptance Criteria:**

- Table created with correct schema
- RLS policies enforce user isolation
- Indexes improve query performance

---

### Task 2.2: Create Supermarket TypeScript Types

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/types/supermarket.ts` file
- [ ] Define `Supermarket` interface
- [ ] Define `CreateSupermarketDTO` type
- [ ] Define `UpdateSupermarketDTO` type
- [ ] Export all types

**Type Definitions:**

```typescript
export interface Supermarket {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSupermarketDTO {
  name: string;
  location?: string;
  logo_url?: string;
}

export interface UpdateSupermarketDTO {
  name?: string;
  location?: string;
  logo_url?: string;
}
```

**Acceptance Criteria:**

- Types are properly defined
- Types match database schema
- Types are importable throughout project

---

### Task 2.3: Create Supermarket API Composable

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/composables/useSupermarkets.ts`
- [ ] Implement `getSupermarkets()` - fetch all user's supermarkets
- [ ] Implement `getSupermarketById(id)` - fetch single supermarket
- [ ] Implement `createSupermarket(data)` - create new supermarket
- [ ] Implement `updateSupermarket(id, data)` - update existing supermarket
- [ ] Implement `deleteSupermarket(id)` - delete supermarket
- [ ] Add error handling for all functions
- [ ] Add loading states

**Acceptance Criteria:**

- All CRUD operations work correctly
- Errors are handled gracefully
- Loading states are exposed
- Data is reactive

---

### Task 2.4: Create Supermarket List Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/supermarkets/index.vue` page
- [ ] Display list of user's supermarkets
- [ ] Create `SupermarketCard` component
- [ ] Show supermarket logo, name, location
- [ ] Add "Add New Supermarket" button
- [ ] Add edit and delete buttons to each card
- [ ] Implement delete confirmation modal
- [ ] Style with Tailwind CSS
- [ ] Add empty state (no supermarkets yet)

**Acceptance Criteria:**

- Supermarkets display in a grid/list
- Cards show all relevant info
- Delete confirmation prevents accidents
- Responsive design works on mobile

---

### Task 2.5: Create Supermarket Form Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `SupermarketForm.vue` component
- [ ] Add input for name (required)
- [ ] Add input for location (optional)
- [ ] Add image upload for logo (Cloudinary)
- [ ] Implement form validation
- [ ] Handle image upload to Cloudinary
- [ ] Emit form data to parent component
- [ ] Add loading state during submission
- [ ] Style form with Tailwind CSS

**Acceptance Criteria:**

- Form validates required fields
- Image uploads successfully to Cloudinary
- Form data emits correctly
- Error messages display for validation failures

---

### Task 2.6: Create Add Supermarket Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/supermarkets/new.vue` page
- [ ] Import and use `SupermarketForm` component
- [ ] Handle form submission
- [ ] Call `createSupermarket()` from composable
- [ ] Show success message on creation
- [ ] Redirect to supermarkets list after success
- [ ] Handle errors and display to user

**Acceptance Criteria:**

- New supermarket can be created
- User redirected after success
- Errors handled gracefully

---

### Task 2.7: Create Edit Supermarket Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/supermarkets/[id]/edit.vue` page
- [ ] Fetch existing supermarket data
- [ ] Populate `SupermarketForm` with existing data
- [ ] Handle form submission
- [ ] Call `updateSupermarket()` from composable
- [ ] Show success message on update
- [ ] Redirect to supermarkets list after success
- [ ] Handle errors and display to user

**Acceptance Criteria:**

- Existing data loads into form
- Supermarket updates successfully
- User redirected after success
- Errors handled gracefully

---

### Task 2.8: Create Supermarket Detail Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/supermarkets/[id]/index.vue` page
- [ ] Display supermarket details (name, location, logo)
- [ ] Show list of products from this supermarket
- [ ] Add "Edit" and "Delete" buttons
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All supermarket details display correctly
- Products associated with supermarket are shown
- Navigation to edit page works

---

### Task 2.9: Write Supermarket Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write unit tests for `useSupermarkets` composable
- [ ] Write e2e test for creating a supermarket
- [ ] Write e2e test for editing a supermarket
- [ ] Write e2e test for deleting a supermarket
- [ ] Write e2e test for viewing supermarket list
- [ ] Test image upload functionality

**Acceptance Criteria:**

- All unit tests pass
- E2E tests cover complete CRUD flows
- Image upload tested

---

## Phase 3: Unit Conversion System

**Goal:** Create a robust, tested system for converting between units

### Task 3.1: Design Unit System Architecture

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Define unit categories (volume, weight, count)
- [ ] Define base units for each category
- [ ] Define conversion factors
- [ ] Create unit configuration file
- [ ] Document unit system design

**Unit System Design:**

```typescript
// Unit categories and base units
const UNIT_SYSTEM = {
  volume: {
    baseUnit: "ml",
    units: {
      ml: { name: "Milliliters", factor: 1 },
      cl: { name: "Centiliters", factor: 10 },
      dl: { name: "Deciliters", factor: 100 },
      l: { name: "Liters", factor: 1000 },
    },
  },
  weight: {
    baseUnit: "g",
    units: {
      mg: { name: "Milligrams", factor: 0.001 },
      g: { name: "Grams", factor: 1 },
      kg: { name: "Kilograms", factor: 1000 },
    },
  },
  count: {
    baseUnit: "unit",
    units: {
      unit: { name: "Units", factor: 1 },
      dozen: { name: "Dozens", factor: 12 },
    },
  },
};
```

**Acceptance Criteria:**

- All common units are defined
- Conversion factors are accurate
- System is extensible for future units

---

### Task 3.2: Create Unit Types

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/types/units.ts` file
- [ ] Define `UnitCategory` type
- [ ] Define `Unit` type
- [ ] Define `UnitConversion` interface
- [ ] Export all types

**Type Definitions:**

```typescript
export type UnitCategory = "volume" | "weight" | "count";

export type VolumeUnit = "ml" | "cl" | "dl" | "l";
export type WeightUnit = "mg" | "g" | "kg";
export type CountUnit = "unit" | "dozen";

export type Unit = VolumeUnit | WeightUnit | CountUnit;

export interface UnitDefinition {
  name: string;
  factor: number;
  category: UnitCategory;
}

export interface Quantity {
  value: number;
  unit: Unit;
}
```

**Acceptance Criteria:**

- Types cover all unit categories
- Types are type-safe
- Types match unit system design

---

### Task 3.3: Create Unit Conversion Utilities

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/utils/units.ts` file
- [ ] Implement `getUnitCategory(unit)` function
- [ ] Implement `convertToBaseUnit(value, unit)` function
- [ ] Implement `convertFromBaseUnit(value, unit)` function
- [ ] Implement `convertUnit(value, fromUnit, toUnit)` function
- [ ] Implement `isSameCategory(unit1, unit2)` function
- [ ] Add validation for unit compatibility
- [ ] Handle edge cases (negative values, zero, very large numbers)

**Core Functions:**

```typescript
// Convert any unit to its base unit
export function convertToBaseUnit(value: number, unit: Unit): number;

// Convert from base unit to target unit
export function convertFromBaseUnit(value: number, unit: Unit): number;

// Convert between any two units (must be same category)
export function convertUnit(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
): number;

// Check if two units are in the same category
export function isSameCategory(unit1: Unit, unit2: Unit): boolean;

// Get category of a unit
export function getUnitCategory(unit: Unit): UnitCategory;
```

**Acceptance Criteria:**

- All conversion functions work correctly
- Invalid conversions throw errors
- Functions handle edge cases
- Performance is acceptable

---

### Task 3.4: Create Unit Display Utilities

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `formatQuantity(value, unit)` function
- [ ] Create `formatPrice(price, quantity, unit)` function - formats price per unit
- [ ] Create `getUnitLabel(unit)` function - returns display name
- [ ] Handle pluralization (1 liter vs 2 liters)
- [ ] Handle decimal formatting (1.5L vs 1L 500ml)

**Acceptance Criteria:**

- Quantities display in human-readable format
- Prices per unit are correctly formatted
- Pluralization works correctly

---

### Task 3.5: Write Comprehensive Unit Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Test all volume conversions (ml ↔ cl ↔ dl ↔ l)
- [ ] Test all weight conversions (mg ↔ g ↔ kg)
- [ ] Test count conversions (unit ↔ dozen)
- [ ] Test cross-category conversion errors
- [ ] Test edge cases (0, negative, very large numbers)
- [ ] Test formatting functions
- [ ] Achieve >95% code coverage on unit utilities

**Test Cases:**

```typescript
// Example tests
describe("Unit Conversion", () => {
  test("1L = 1000ml", () => {
    expect(convertUnit(1, "l", "ml")).toBe(1000);
  });

  test("500ml = 0.5L", () => {
    expect(convertUnit(500, "ml", "l")).toBe(0.5);
  });

  test("Cannot convert volume to weight", () => {
    expect(() => convertUnit(100, "ml", "g")).toThrow();
  });
});
```

**Acceptance Criteria:**

- All unit conversions tested
- Edge cases covered
- > 95% code coverage
- No rounding errors in conversions

---

### Task 3.6: Create Unit Selector Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `UnitSelector.vue` component
- [ ] Display dropdown of available units by category
- [ ] Filter units based on category prop
- [ ] Emit selected unit to parent
- [ ] Style with Tailwind CSS
- [ ] Add visual icons for unit types

**Acceptance Criteria:**

- Component displays correct units for category
- Selection emits properly
- Component is reusable

---

## Phase 4: Product Management

**Goal:** Allow users to create and manage products with prices and units

### Task 4.1: Create Products Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `products` table in Supabase
- [ ] Define columns: id, user_id, supermarket_id, name, description, current_price, quantity, unit, image_url, rating, created_at, updated_at
- [ ] Set up foreign key constraints
- [ ] Create RLS policies
- [ ] Create indexes on user_id and supermarket_id
- [ ] Create database migration file

**Database Schema:**

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supermarket_id UUID NOT NULL REFERENCES public.supermarkets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  current_price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 3) NOT NULL,
  unit TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_supermarket_id ON public.products(supermarket_id);

-- RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);
```

**Acceptance Criteria:**

- Table created with correct schema
- Foreign keys enforce data integrity
- RLS policies enforce user isolation

---

### Task 4.2: Create Price History Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `product_price_history` table
- [ ] Define columns: id, product_id, price, recorded_at
- [ ] Set up foreign key to products table
- [ ] Create RLS policies
- [ ] Create index on product_id and recorded_at
- [ ] Create database trigger to auto-insert on price change
- [ ] Create database migration file

**Database Schema:**

```sql
CREATE TABLE public.product_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_price_history_product_recorded
  ON public.product_price_history(product_id, recorded_at DESC);

-- RLS Policies
ALTER TABLE public.product_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price history of own products"
  ON public.product_price_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = product_price_history.product_id
      AND products.user_id = auth.uid()
    )
  );

-- Trigger to automatically record price changes
CREATE OR REPLACE FUNCTION record_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.current_price != NEW.current_price) THEN
    INSERT INTO public.product_price_history (product_id, price, recorded_at)
    VALUES (NEW.id, NEW.current_price, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_record_price_change
  AFTER INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION record_price_change();
```

**Acceptance Criteria:**

- Price history table created
- Trigger automatically records price changes
- Historical data preserved

---

### Task 4.3: Create Product TypeScript Types

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/types/product.ts` file
- [ ] Define `Product` interface
- [ ] Define `CreateProductDTO` type
- [ ] Define `UpdateProductDTO` type
- [ ] Define `ProductWithPricePerUnit` type
- [ ] Define `PriceHistory` interface
- [ ] Export all types

**Type Definitions:**

```typescript
export interface Product {
  id: string;
  user_id: string;
  supermarket_id: string;
  name: string;
  description?: string;
  current_price: number;
  quantity: number;
  unit: Unit;
  image_url?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDTO {
  supermarket_id: string;
  name: string;
  description?: string;
  current_price: number;
  quantity: number;
  unit: Unit;
  image_url?: string;
  rating?: number;
}

export interface UpdateProductDTO {
  supermarket_id?: string;
  name?: string;
  description?: string;
  current_price?: number;
  quantity?: number;
  unit?: Unit;
  image_url?: string;
  rating?: number;
}

export interface ProductWithPricePerUnit extends Product {
  price_per_base_unit: number; // e.g., price per ml for volume
  formatted_price_per_unit: string; // e.g., "€0.15 per 100ml"
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  recorded_at: string;
}
```

**Acceptance Criteria:**

- Types match database schema
- Calculated fields included
- Types are type-safe

---

### Task 4.4: Create Product Calculation Utilities

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/utils/productCalculations.ts` file
- [ ] Implement `calculatePricePerBaseUnit(product)` function
- [ ] Implement `formatPricePerUnit(product)` function
- [ ] Implement `calculateProductCost(product, requiredQuantity, requiredUnit)` function
- [ ] Handle unit conversions in calculations
- [ ] Add comprehensive tests for calculations

**Core Functions:**

```typescript
// Calculate price per base unit (e.g., per ml for volume)
export function calculatePricePerBaseUnit(product: Product): number;

// Format price per unit for display (e.g., "€0.15 per 100ml")
export function formatPricePerUnit(product: Product): string;

// Calculate cost for a specific quantity and unit
export function calculateProductCost(
  product: Product,
  requiredQuantity: number,
  requiredUnit: Unit,
): number;
```

**Acceptance Criteria:**

- Calculations are accurate
- Unit conversions work correctly
- Edge cases handled
- Comprehensive tests written

---

### Task 4.5: Create Product API Composable

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/composables/useProducts.ts`
- [ ] Implement `getProducts()` - fetch all user's products
- [ ] Implement `getProductById(id)` - fetch single product
- [ ] Implement `getProductsBySupermarket(supermarketId)` - filter by supermarket
- [ ] Implement `createProduct(data)` - create new product
- [ ] Implement `updateProduct(id, data)` - update existing product
- [ ] Implement `deleteProduct(id)` - delete product
- [ ] Implement `getProductPriceHistory(productId)` - fetch price history
- [ ] Add computed properties for price per unit
- [ ] Add error handling and loading states

**Acceptance Criteria:**

- All CRUD operations work
- Price per unit calculated automatically
- Filtering works correctly
- Price history fetched successfully

---

### Task 4.6: Create Product Form Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `ProductForm.vue` component
- [ ] Add input for name (required)
- [ ] Add textarea for description (optional)
- [ ] Add select for supermarket (required)
- [ ] Add input for price (required, number, min 0)
- [ ] Add input for quantity (required, number, min 0)
- [ ] Add `UnitSelector` for unit (required)
- [ ] Add image upload for product image (Cloudinary)
- [ ] Add star rating input (1-5)
- [ ] Implement form validation
- [ ] Display calculated price per unit (read-only)
- [ ] Emit form data to parent
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All fields validated correctly
- Price per unit displays in real-time
- Image uploads to Cloudinary
- Form is user-friendly

---

### Task 4.7: Create Product List Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/products/index.vue` page
- [ ] Display grid/list of user's products
- [ ] Create `ProductCard` component
- [ ] Show product image, name, price, price per unit
- [ ] Add filter by supermarket dropdown
- [ ] Add search by name functionality
- [ ] Add sort options (name, price, date created)
- [ ] Add "Add New Product" button
- [ ] Add edit and delete buttons to each card
- [ ] Implement delete confirmation modal
- [ ] Add empty state
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Products display correctly
- Filtering and searching work
- Sorting works correctly
- Delete confirmation prevents accidents

---

### Task 4.8: Create Add Product Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/products/new.vue` page
- [ ] Import and use `ProductForm` component
- [ ] Handle form submission
- [ ] Call `createProduct()` from composable
- [ ] Show success message
- [ ] Redirect to products list
- [ ] Handle errors

**Acceptance Criteria:**

- New product can be created
- Validation works
- Success and error states handled

---

### Task 4.9: Create Edit Product Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/products/[id]/edit.vue` page
- [ ] Fetch existing product data
- [ ] Populate form with existing data
- [ ] Handle form submission
- [ ] Call `updateProduct()` from composable
- [ ] Show success message
- [ ] Redirect to products list
- [ ] Handle errors

**Acceptance Criteria:**

- Product data loads into form
- Updates save correctly
- Price history recorded on price change

---

### Task 4.10: Create Product Detail Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/products/[id]/index.vue` page
- [ ] Display product details (image, name, description, price, rating)
- [ ] Display price per unit prominently
- [ ] Display supermarket information
- [ ] Add "Edit" and "Delete" buttons
- [ ] Create price history chart component
- [ ] Display price history timeline
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All product details display
- Price history visualized clearly
- Navigation works correctly

---

### Task 4.11: Create Price History Chart Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `PriceHistoryChart.vue` component
- [ ] Choose charting library (e.g., Chart.js, ApexCharts)
- [ ] Install and configure charting library
- [ ] Create line chart showing price over time
- [ ] Format dates on x-axis
- [ ] Format prices on y-axis (currency)
- [ ] Add tooltips showing exact price and date
- [ ] Handle empty state (no price history)
- [ ] Make chart responsive

**Acceptance Criteria:**

- Chart displays price history accurately
- Chart is responsive
- Tooltips show detailed information
- Empty state handled

---

### Task 4.12: Write Product Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write unit tests for product calculations
- [ ] Write unit tests for `useProducts` composable
- [ ] Write e2e test for creating a product
- [ ] Write e2e test for editing a product
- [ ] Write e2e test for deleting a product
- [ ] Write e2e test for viewing product list
- [ ] Write e2e test for filtering products
- [ ] Test price history recording

**Acceptance Criteria:**

- All unit tests pass
- E2E tests cover CRUD flows
- Price calculations tested thoroughly
- Price history trigger tested

---

## Phase 5: Recipe Management

**Goal:** Allow users to create recipes with products and calculate total cost

### Task 5.1: Create Recipes Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `recipes` table in Supabase
- [ ] Define columns: id, user_id, name, description, image_url, servings, prep_time_minutes, rating, created_at, updated_at
- [ ] Set up foreign key to users table
- [ ] Create RLS policies
- [ ] Create index on user_id
- [ ] Create database migration file

**Database Schema:**

```sql
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  servings INTEGER DEFAULT 1,
  prep_time_minutes INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);

-- RLS Policies
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes"
  ON public.recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON public.recipes FOR DELETE
  USING (auth.uid() = user_id);
```

**Acceptance Criteria:**

- Recipes table created
- RLS policies enforce user isolation

---

### Task 5.2: Create Recipe Ingredients Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `recipe_ingredients` table in Supabase
- [ ] Define columns: id, recipe_id, product_id, quantity, unit
- [ ] Set up foreign keys to recipes and products
- [ ] Create RLS policies (users can only manage ingredients for their own recipes)
- [ ] Create indexes on recipe_id and product_id
- [ ] Create database migration file

**Database Schema:**

```sql
CREATE TABLE public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 3) NOT NULL,
  unit TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_product_id ON public.recipe_ingredients(product_id);

-- RLS Policies
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ingredients of own recipes"
  ON public.recipe_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ingredients to own recipes"
  ON public.recipe_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ingredients of own recipes"
  ON public.recipe_ingredients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ingredients of own recipes"
  ON public.recipe_ingredients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );
```

**Acceptance Criteria:**

- Recipe ingredients table created
- Foreign keys enforce referential integrity
- RLS policies enforce proper access control

---

### Task 5.3: Create Recipe TypeScript Types

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/types/recipe.ts` file
- [ ] Define `Recipe` interface
- [ ] Define `RecipeIngredient` interface
- [ ] Define `RecipeWithIngredients` type
- [ ] Define `RecipeWithCost` type
- [ ] Define `CreateRecipeDTO` type
- [ ] Define `UpdateRecipeDTO` type
- [ ] Export all types

**Type Definitions:**

```typescript
export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  servings: number;
  prep_time_minutes?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  product_id: string;
  quantity: number;
  unit: Unit;
  product?: Product; // Populated via join
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

export interface IngredientCost {
  ingredient: RecipeIngredient;
  cost: number;
  formatted_cost: string;
}

export interface RecipeWithCost extends RecipeWithIngredients {
  total_cost: number;
  cost_per_serving: number;
  ingredient_costs: IngredientCost[];
}

export interface CreateRecipeDTO {
  name: string;
  description?: string;
  image_url?: string;
  servings: number;
  prep_time_minutes?: number;
  rating?: number;
}

export interface UpdateRecipeDTO {
  name?: string;
  description?: string;
  image_url?: string;
  servings?: number;
  prep_time_minutes?: number;
  rating?: number;
}

export interface CreateRecipeIngredientDTO {
  product_id: string;
  quantity: number;
  unit: Unit;
}
```

**Acceptance Criteria:**

- Types match database schema
- Calculated fields included
- Types support nested data

---

### Task 5.4: Create Recipe Calculation Utilities

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/utils/recipeCalculations.ts` file
- [ ] Implement `calculateIngredientCost(ingredient, product)` function
- [ ] Implement `calculateRecipeTotalCost(recipe)` function
- [ ] Implement `calculateCostPerServing(recipe)` function
- [ ] Handle unit conversions between recipe requirements and product units
- [ ] Add comprehensive tests

**Core Functions:**

```typescript
// Calculate cost of a single ingredient in the recipe
export function calculateIngredientCost(
  ingredient: RecipeIngredient,
  product: Product,
): number;

// Calculate total cost of recipe
export function calculateRecipeTotalCost(recipe: RecipeWithIngredients): number;

// Calculate cost per serving
export function calculateCostPerServing(recipe: RecipeWithIngredients): number;

// Get detailed cost breakdown
export function getRecipeCostBreakdown(
  recipe: RecipeWithIngredients,
): IngredientCost[];
```

**Acceptance Criteria:**

- Calculations are accurate
- Unit conversions handled correctly
- Edge cases handled
- Comprehensive tests written

---

### Task 5.5: Create Recipe API Composable

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/composables/useRecipes.ts`
- [ ] Implement `getRecipes()` - fetch all user's recipes
- [ ] Implement `getRecipeById(id)` - fetch single recipe with ingredients
- [ ] Implement `createRecipe(data)` - create new recipe
- [ ] Implement `updateRecipe(id, data)` - update existing recipe
- [ ] Implement `deleteRecipe(id)` - delete recipe
- [ ] Implement `addIngredient(recipeId, ingredient)` - add ingredient to recipe
- [ ] Implement `updateIngredient(ingredientId, data)` - update ingredient
- [ ] Implement `removeIngredient(ingredientId)` - remove ingredient
- [ ] Implement computed properties for total cost and cost per serving
- [ ] Add error handling and loading states

**Acceptance Criteria:**

- All CRUD operations work
- Ingredients can be managed
- Costs calculated automatically
- Data is reactive

---

### Task 5.6: Create Recipe Form Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `RecipeForm.vue` component
- [ ] Add input for name (required)
- [ ] Add textarea for description (optional)
- [ ] Add input for servings (required, number, min 1)
- [ ] Add input for prep time (optional, number)
- [ ] Add image upload for recipe image (Cloudinary)
- [ ] Add star rating input (1-5)
- [ ] Implement form validation
- [ ] Emit form data to parent
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All fields validated
- Image uploads to Cloudinary
- Form is user-friendly

---

### Task 5.7: Create Recipe Ingredient Selector Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `RecipeIngredientSelector.vue` component
- [ ] Display list of user's products in a searchable dropdown
- [ ] Add quantity input (number, min 0)
- [ ] Add `UnitSelector` for unit
- [ ] Validate that selected unit matches product category
- [ ] Display real-time cost calculation for ingredient
- [ ] Add "Add Ingredient" button
- [ ] Emit ingredient data to parent
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Products are searchable
- Unit validation works
- Cost displays in real-time
- Only compatible units selectable

---

### Task 5.8: Create Recipe Ingredient List Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `RecipeIngredientList.vue` component
- [ ] Display list of ingredients with product name, quantity, unit
- [ ] Show individual ingredient costs
- [ ] Add edit button for each ingredient
- [ ] Add remove button for each ingredient
- [ ] Display total recipe cost prominently
- [ ] Display cost per serving
- [ ] Handle empty state
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Ingredients display clearly
- Costs are accurate
- Edit and remove work
- Total cost displays prominently

---

### Task 5.9: Create Recipe List Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/recipes/index.vue` page
- [ ] Display grid/list of user's recipes
- [ ] Create `RecipeCard` component
- [ ] Show recipe image, name, servings, total cost
- [ ] Add search by name functionality
- [ ] Add sort options (name, cost, date created)
- [ ] Add "Add New Recipe" button
- [ ] Add edit and delete buttons to each card
- [ ] Implement delete confirmation modal
- [ ] Add empty state
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Recipes display correctly
- Search and sort work
- Total costs display
- Delete confirmation works

---

### Task 5.10: Create Add Recipe Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/recipes/new.vue` page
- [ ] Import `RecipeForm` component
- [ ] Import `RecipeIngredientSelector` component
- [ ] Import `RecipeIngredientList` component
- [ ] Handle recipe form submission
- [ ] Handle adding ingredients
- [ ] Save recipe and all ingredients in single transaction
- [ ] Show success message
- [ ] Redirect to recipe detail page
- [ ] Handle errors

**Acceptance Criteria:**

- Recipe and ingredients can be created together
- Transaction ensures data consistency
- Success and error states handled

---

### Task 5.11: Create Edit Recipe Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/recipes/[id]/edit.vue` page
- [ ] Fetch existing recipe data with ingredients
- [ ] Populate forms with existing data
- [ ] Handle recipe update
- [ ] Handle adding/removing/updating ingredients
- [ ] Show success message
- [ ] Redirect to recipe detail page
- [ ] Handle errors

**Acceptance Criteria:**

- Recipe data loads correctly
- Ingredients can be modified
- Updates save correctly

---

### Task 5.12: Create Recipe Detail Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/recipes/[id]/index.vue` page
- [ ] Display recipe details (image, name, description, servings, prep time, rating)
- [ ] Display ingredient list with quantities and units
- [ ] Display cost breakdown (total, per serving, per ingredient)
- [ ] Add "Edit" and "Delete" buttons
- [ ] Add "Scale Recipe" feature (adjust servings and recalculate)
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All recipe details display
- Cost breakdown is clear
- Scaling feature works
- Navigation works

---

### Task 5.13: Write Recipe Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write unit tests for recipe calculations
- [ ] Write unit tests for `useRecipes` composable
- [ ] Write e2e test for creating a recipe with ingredients
- [ ] Write e2e test for editing a recipe
- [ ] Write e2e test for adding/removing ingredients
- [ ] Write e2e test for deleting a recipe
- [ ] Write e2e test for recipe scaling
- [ ] Test cost calculations with various unit conversions

**Acceptance Criteria:**

- All unit tests pass
- E2E tests cover complete recipe flows
- Cost calculations tested thoroughly

---

## Phase 6: Recipe Sharing

**Goal:** Allow users to share recipes in view-only mode

### Task 6.1: Create Shared Recipes Database Schema

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Add `is_public` boolean column to recipes table
- [ ] Add `share_token` unique text column to recipes table
- [ ] Create index on share_token
- [ ] Update RLS policies to allow public read access if is_public=true
- [ ] Create database migration file

**Database Schema:**

```sql
-- Add columns to recipes table
ALTER TABLE public.recipes
  ADD COLUMN is_public BOOLEAN DEFAULT FALSE,
  ADD COLUMN share_token TEXT UNIQUE;

-- Index
CREATE INDEX idx_recipes_share_token ON public.recipes(share_token);

-- RLS Policy for public recipes
CREATE POLICY "Anyone can view public recipes"
  ON public.recipes FOR SELECT
  USING (is_public = true);

-- Update recipe_ingredients policy
CREATE POLICY "Anyone can view ingredients of public recipes"
  ON public.recipe_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = recipe_ingredients.recipe_id
      AND recipes.is_public = true
    )
  );
```

**Acceptance Criteria:**

- Columns added to recipes table
- Share tokens are unique
- Public recipes accessible without authentication

---

### Task 6.2: Create Share Token Generation Utility

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/utils/shareToken.ts` file
- [ ] Implement `generateShareToken()` function (random, URL-safe)
- [ ] Implement `isValidShareToken(token)` function
- [ ] Add tests for token generation

**Acceptance Criteria:**

- Tokens are random and unique
- Tokens are URL-safe
- Validation works correctly

---

### Task 6.3: Add Recipe Sharing Toggle to Recipe Detail Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Add "Share Recipe" toggle switch to recipe detail page
- [ ] Generate share token when toggled on
- [ ] Update recipe with is_public=true and share_token
- [ ] Display shareable link when enabled
- [ ] Add "Copy Link" button
- [ ] Add visual indicator that recipe is public
- [ ] Allow toggling off (removes public access but keeps token)

**Acceptance Criteria:**

- Toggle updates database correctly
- Share link is copyable
- Public indicator displays clearly

---

### Task 6.4: Create Public Recipe View Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/recipes/shared/[token].vue` page (no auth required)
- [ ] Fetch recipe by share token
- [ ] Display recipe details (read-only)
- [ ] Display ingredient list (read-only)
- [ ] Display cost breakdown
- [ ] Show "Created by [user]" (optional)
- [ ] Add "Create Account to Make Your Own" CTA
- [ ] Handle invalid token (404 page)
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Public recipe displays correctly
- No authentication required
- Invalid tokens show 404
- Read-only view enforced

---

### Task 6.5: Create Shared Recipe Product View

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Allow viewing product details from shared recipe (read-only)
- [ ] Display product name, quantity, unit, price
- [ ] Hide sensitive data (user info, supermarket specifics if desired)
- [ ] Style consistently with public recipe view

**Acceptance Criteria:**

- Product info displays correctly
- Sensitive data hidden
- View is read-only

---

### Task 6.6: Write Recipe Sharing Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write unit tests for share token generation
- [ ] Write e2e test for sharing a recipe
- [ ] Write e2e test for viewing shared recipe (unauthenticated)
- [ ] Write e2e test for copying share link
- [ ] Write e2e test for unsharing a recipe
- [ ] Test invalid share token handling

**Acceptance Criteria:**

- All tests pass
- Sharing flows tested
- Security verified (no unauthorized edits)

---

## Phase 7: Dashboard & Analytics

**Goal:** Create a central dashboard with insights and analytics

### Task 7.1: Create Dashboard Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/dashboard/index.vue` page
- [ ] Display summary statistics (total products, recipes, supermarkets)
- [ ] Show recent products added
- [ ] Show recent recipes created
- [ ] Display quick actions (Add Product, Add Recipe, Add Supermarket)
- [ ] Style with Tailwind CSS
- [ ] Make responsive

**Acceptance Criteria:**

- Dashboard displays all statistics
- Quick actions work
- Responsive design

---

### Task 7.2: Create Analytics Page

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/app/analytics/index.vue` page
- [ ] Display price trend charts for products
- [ ] Show most expensive ingredients
- [ ] Show average recipe costs
- [ ] Compare supermarket prices for same products
- [ ] Add date range filter
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- All analytics display correctly
- Charts are interactive
- Filtering works

---

### Task 7.3: Create Supermarket Comparison Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `SupermarketComparison.vue` component
- [ ] Allow selecting a product type (e.g., "milk")
- [ ] Display all user's products matching that type across supermarkets
- [ ] Show price per unit comparison
- [ ] Highlight cheapest option
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Comparison displays correctly
- Cheapest option highlighted
- User can compare products easily

---

### Task 7.4: Create Price Insights Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `PriceInsights.vue` component
- [ ] Calculate average price changes over time
- [ ] Identify products with significant price increases
- [ ] Suggest alternatives (cheaper products in same category)
- [ ] Display insights in cards
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Insights are accurate
- Recommendations are helpful
- Display is clear

---

### Task 7.5: Write Dashboard Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write e2e test for dashboard page
- [ ] Write e2e test for analytics page
- [ ] Write unit tests for analytics calculations
- [ ] Test supermarket comparison component

**Acceptance Criteria:**

- All tests pass
- Analytics verified for accuracy

---

## Phase 8: Landing Page

**Goal:** Create a marketing landing page to promote the app

### Task 8.1: Design Landing Page Structure

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create wireframe for landing page
- [ ] Plan sections: Hero, Features, How It Works, Benefits, CTA
- [ ] Choose color scheme and typography
- [ ] Find or create illustrations/icons

**Acceptance Criteria:**

- Wireframe complete
- Design approved
- Assets ready

---

### Task 8.2: Create Hero Section

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/pages/index.vue` landing page
- [ ] Create hero section component
- [ ] Add headline and subheadline
- [ ] Add CTA button (Sign Up / Get Started)
- [ ] Add hero image or illustration
- [ ] Make responsive
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Hero section is compelling
- CTA is prominent
- Responsive design

---

### Task 8.3: Create Features Section

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create features section component
- [ ] Highlight 3-4 key features with icons
  - Track product prices
  - Create recipes
  - Compare supermarkets
  - View price history
- [ ] Add descriptions for each feature
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Features clearly communicated
- Icons are relevant
- Section is visually appealing

---

### Task 8.4: Create How It Works Section

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create how-it-works section component
- [ ] Show 3-step process with visuals
  1. Add products from your supermarket
  2. Create recipes with your products
  3. See how much you save by cooking at home
- [ ] Add step-by-step illustrations
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Process is clear and simple
- Visuals support text
- Flow is logical

---

### Task 8.5: Create Benefits Section

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create benefits section component
- [ ] List key benefits (save money, track inflation, make informed decisions)
- [ ] Add supporting visuals or icons
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Benefits are compelling
- Section is engaging

---

### Task 8.6: Create Call-to-Action Section

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create CTA section component
- [ ] Add compelling CTA text
- [ ] Add sign-up button
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- CTA is clear and prominent
- Button links to registration

---

### Task 8.7: Create Footer

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create footer component
- [ ] Add links (About, Privacy Policy, Terms of Service, Contact)
- [ ] Add social media icons (if applicable)
- [ ] Add copyright notice
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Footer has all necessary links
- Footer is consistent across pages

---

### Task 8.8: Write Landing Page Tests

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write e2e test for landing page navigation
- [ ] Test CTA button redirects to registration
- [ ] Test responsive design on different screen sizes

**Acceptance Criteria:**

- All tests pass
- Landing page is fully functional

---

## Phase 9: Navigation & Layout

**Goal:** Create consistent navigation and layout across the app

### Task 9.1: Create Main Navigation Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `MainNav.vue` component
- [ ] Add logo/brand name
- [ ] Add navigation links (Dashboard, Products, Recipes, Supermarkets, Analytics)
- [ ] Add user menu (Profile, Logout)
- [ ] Show user email or name
- [ ] Make responsive (mobile hamburger menu)
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Navigation is accessible on all pages
- Mobile menu works
- Active link is highlighted

---

### Task 9.2: Create Layout Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/layouts/default.vue` layout
- [ ] Include `MainNav` component
- [ ] Include `Footer` component
- [ ] Set up slot for page content
- [ ] Apply consistent padding/margins
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Layout is consistent across pages
- Navigation and footer always visible

---

### Task 9.3: Create Public Layout Component

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `/layouts/public.vue` layout for landing page
- [ ] Simpler header without full navigation
- [ ] Include footer
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Public layout distinct from app layout
- Consistent branding

---

### Task 9.4: Apply Layouts to All Pages

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Apply `default` layout to all `/app/*` pages
- [ ] Apply `public` layout to landing page and shared recipe pages
- [ ] Verify consistency

**Acceptance Criteria:**

- All pages use appropriate layouts
- Navigation works across all pages

---

## Phase 10: User Experience Enhancements

**Goal:** Improve usability and polish the application

### Task 10.1: Add Loading States

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `LoadingSpinner.vue` component
- [ ] Add loading states to all data fetching operations
- [ ] Show spinner during form submissions
- [ ] Disable buttons during loading
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Loading indicators display during async operations
- User cannot submit forms multiple times

---

### Task 10.2: Add Error Handling & Messages

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `ErrorMessage.vue` component
- [ ] Display errors from API calls
- [ ] Add error boundaries for components
- [ ] Show user-friendly error messages
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Errors display clearly
- Users know what went wrong
- Errors are dismissable

---

### Task 10.3: Add Success Notifications

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `Toast.vue` notification component
- [ ] Show success messages after create/update/delete operations
- [ ] Auto-dismiss after 3-5 seconds
- [ ] Allow manual dismissal
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Success messages display
- Auto-dismiss works
- User can dismiss manually

---

### Task 10.4: Add Confirmation Modals

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `ConfirmModal.vue` component
- [ ] Use for delete operations
- [ ] Require explicit confirmation
- [ ] Support custom messages
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Confirmations prevent accidental deletes
- User can cancel confirmation

---

### Task 10.5: Improve Form Validation

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Add inline validation to all forms
- [ ] Show validation errors below fields
- [ ] Validate on blur and on submit
- [ ] Disable submit button if form invalid
- [ ] Style validation states with Tailwind CSS

**Acceptance Criteria:**

- Validation is immediate and clear
- Users know what to fix
- Invalid forms cannot be submitted

---

### Task 10.6: Add Empty States

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Create `EmptyState.vue` component
- [ ] Add to product list (no products yet)
- [ ] Add to recipe list (no recipes yet)
- [ ] Add to supermarket list (no supermarkets yet)
- [ ] Include helpful CTAs in empty states
- [ ] Style with Tailwind CSS

**Acceptance Criteria:**

- Empty states are friendly and helpful
- CTAs guide users to add content

---

### Task 10.7: Improve Accessibility

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader
- [ ] Improve color contrast ratios
- [ ] Add focus indicators
- [ ] Add alt text to all images

**Acceptance Criteria:**

- App is accessible via keyboard
- Screen reader can navigate app
- WCAG 2.1 AA compliance

---

### Task 10.8: Optimize Performance

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Implement lazy loading for routes
- [ ] Optimize images (use Cloudinary transformations)
- [ ] Add pagination to long lists
- [ ] Implement virtual scrolling if needed
- [ ] Minimize bundle size
- [ ] Run Lighthouse audit and fix issues

**Acceptance Criteria:**

- Lighthouse score >90 for performance
- Pages load quickly
- Images are optimized

---

## Phase 11: Polish & Bug Fixes

**Goal:** Fix bugs, refine UI, and prepare for launch

### Task 11.1: Comprehensive Testing

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Run all unit tests
- [ ] Run all e2e tests
- [ ] Fix any failing tests
- [ ] Achieve >80% code coverage

**Acceptance Criteria:**

- All tests pass
- Code coverage meets target

---

### Task 11.2: Cross-Browser Testing

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Fix browser-specific issues

**Acceptance Criteria:**

- App works on all major browsers

---

### Task 11.3: Responsive Design Testing

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on tablets
- [ ] Test on desktop (various resolutions)
- [ ] Fix responsive issues

**Acceptance Criteria:**

- App is fully responsive
- UI adapts to all screen sizes

---

### Task 11.4: User Acceptance Testing

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Recruit beta testers
- [ ] Collect feedback
- [ ] Prioritize feedback items
- [ ] Implement high-priority fixes
- [ ] Retest with users

**Acceptance Criteria:**

- User feedback collected
- Critical issues resolved

---

### Task 11.5: Security Audit

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Review all RLS policies
- [ ] Test authentication flows for vulnerabilities
- [ ] Ensure no sensitive data exposed in public routes
- [ ] Check for XSS vulnerabilities
- [ ] Validate all user inputs
- [ ] Run security scanning tools

**Acceptance Criteria:**

- No critical security vulnerabilities
- RLS policies properly restrict access

---

### Task 11.6: Performance Optimization

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Profile application for bottlenecks
- [ ] Optimize database queries
- [ ] Add database indexes where needed
- [ ] Optimize bundle size
- [ ] Enable caching where appropriate

**Acceptance Criteria:**

- App is performant under load
- Database queries optimized

---

### Task 11.7: Documentation

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Write README with setup instructions
- [ ] Document environment variables
- [ ] Create user guide
- [ ] Document API composables
- [ ] Add code comments where needed

**Acceptance Criteria:**

- README is complete
- New developers can set up project easily

---

### Task 11.8: Final UI Polish

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Review all pages for visual consistency
- [ ] Refine spacing and typography
- [ ] Ensure color palette is consistent
- [ ] Add micro-interactions (hover states, transitions)
- [ ] Polish animations

**Acceptance Criteria:**

- UI is polished and professional
- Consistent visual language

---

## Phase 12: Deployment

**Goal:** Deploy the application to production

### Task 12.1: Set Up Production Environment

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Choose hosting platform (Vercel, Netlify, etc.)
- [ ] Set up production Supabase project
- [ ] Set up production Cloudinary account
- [ ] Configure environment variables for production
- [ ] Set up custom domain (if applicable)

**Acceptance Criteria:**

- Production environment configured
- Environment variables set

---

### Task 12.2: Configure Build & Deployment Pipeline

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Configure build settings
- [ ] Set up CI/CD pipeline (GitHub Actions, etc.)
- [ ] Configure automatic deployments on push
- [ ] Set up staging environment (optional)
- [ ] Test deployment process

**Acceptance Criteria:**

- Deployment pipeline works
- Automatic deployments configured

---

### Task 12.3: Migrate Database to Production

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Run all database migrations on production Supabase
- [ ] Verify all tables created correctly
- [ ] Verify all RLS policies enabled
- [ ] Test database connections

**Acceptance Criteria:**

- Production database matches schema
- RLS policies active

---

### Task 12.4: Deploy Application

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Build production bundle
- [ ] Deploy to hosting platform
- [ ] Verify deployment successful
- [ ] Test all features in production
- [ ] Monitor for errors

**Acceptance Criteria:**

- Application deployed successfully
- All features work in production

---

### Task 12.5: Configure Monitoring & Analytics

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Configure performance monitoring
- [ ] Set up logging

**Acceptance Criteria:**

- Errors tracked and reported
- User analytics collected
- Performance monitored

---

### Task 12.6: Launch Checklist

**Status:** ⏳ Pending

#### Subtasks:

- [ ] Verify SSL certificate active
- [ ] Test all features in production one final time
- [ ] Verify email notifications work (if applicable)
- [ ] Check SEO meta tags on landing page
- [ ] Test share links
- [ ] Announce launch

**Acceptance Criteria:**

- All systems operational
- Launch successful

---

## Future Enhancements (Post-Launch)

### Shopping List Feature

- Allow users to generate shopping lists from recipes
- Calculate total cost before shopping
- Check off items while shopping

### Meal Planning Feature

- Weekly meal planner
- Drag-and-drop recipes to days
- Automatic shopping list generation
- Weekly cost calculation

### Barcode Scanning

- Mobile app feature to scan product barcodes
- Auto-fill product information
- Quick product addition

### Export Functionality

- Export recipes as PDF
- Export product lists as CSV
- Export cost reports

### Notifications

- Price change alerts
- Recipe suggestions based on available products
- Weekly cost summary emails

### Multi-Language Support

- Add i18n
- Support for multiple currencies
- Regional unit preferences

---

## Appendix

### Git Workflow

1. Create feature branch from `main`
2. Implement task
3. Write tests
4. Create pull request
5. Review and merge

### Branch Naming Convention

- `feature/task-X.Y-short-description`
- `bugfix/issue-number-short-description`
- `hotfix/critical-issue`

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types: feat, fix, docs, style, refactor, test, chore

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests written and passing
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Accessibility considered
- [ ] Performance considered
- [ ] Documentation updated

---

**Total Estimated Tasks:** 150+
**Estimated Timeline:** 12-16 weeks (solo developer, part-time)

---

## Task Status Legend

- ⏳ **Pending** - Not started
- 🚧 **In Progress** - Currently being worked on
- ✅ **Completed** - Task finished and tested
- 🔄 **Blocked** - Waiting on dependencies
- ⚠️ **Needs Review** - Completed but requires review

---

_This implementation plan is a living document and should be updated as the project progresses._
