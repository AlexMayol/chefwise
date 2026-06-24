# Grocery Cost Tracker

Version: 1.0
Status: Approved for Development
Release: MVP / First Version

---

# 1. Product Overview

Grocery Cost Tracker is a local-first mobile application that allows users to track product prices across multiple markets, calculate recipe costs, manage shopping lists, maintain a pantry inventory, and monitor price evolution over time.

The application is designed to operate completely offline.

All user data is stored locally on the device.

---

# 2. Goals

The application must allow users to:

1. Organize products into categories.
2. Track product prices across multiple markets.
3. Maintain historical price records.
4. Create recipes using products.
5. Calculate recipe costs automatically.
6. Create and manage shopping lists.
7. Update prices while shopping.
8. Maintain pantry inventory.
9. Reuse previous shopping lists.
10. Rate and annotate products.
11. Use the application in English and Spanish.
12. Export and import complete local backups.

---

# 3. Non-Goals

The following features are explicitly excluded from V1:

* Cloud synchronization
* User accounts
* Authentication
* Barcode scanning
* Receipt OCR
* Shared shopping lists
* Multi-user support
* Product variants
* AI recommendations
* Push notifications
* Cloud backup
* Automatic backup
* Backup encryption
* Backup merge/conflict resolution

---

# 4. Technology Stack

## Mobile

* Expo
* React Native
* TypeScript

## Database

* SQLite

## Storage

* Expo File System

## Navigation

* Expo Router

## Forms & Validation

* React Hook Form
* Zod

## UI

* NativeWind
* React Native Reusables

## Internationalization

* i18next
* react-i18next

---

# 5. Core Entities

## Market

Represents a physical store.

Examples:

* Mercadona
* Lidl
* Carrefour

Fields:

* id
* name
* address
* createdAt

---

## Category

Represents a user-defined grouping of products.

Examples:

* Vegetables
* Dairy
* Cleaning

Fields:

* id
* name
* sortOrder
* createdAt

---

## Product

Represents a purchasable item.

Examples:

* Tomato
* Olive Oil
* Milk
* Dish Soap

Fields:

* id

* name

* categoryId (optional)

* defaultUnit

* imageUri (optional)

* rating (optional)

* notes (optional)

* isFavorite

* createdAt

* updatedAt

### Rating

Allowed values:

* 1
* 2
* 3
* 4
* 5

### Notes

Free-text user observations.

Examples:

* Good quality but expensive.
* Best value at Lidl.
* Kids prefer this brand.

### Favorite

Boolean value.

Default:

```txt
false
```

---

## ProductPrice

Represents the price of a product at a specific moment in time.

Prices are immutable.

Creating a new price never modifies previous prices.

Fields:

* id
* productId
* marketId
* price
* quantity
* unit
* normalizedPrice
* normalizedUnit
* observedAt

Example:

Tomato

* €2.20/kg on May 10
* €2.80/kg on June 23

---

## Recipe

Represents a collection of products.

Examples:

* Pasta Bolognese
* Pancakes

Fields:

* id
* name
* description
* servings
* pricingStrategy
* imageUri (optional)
* createdAt
* updatedAt

### Pricing Strategies

Supported values:

* manual
* cheapest_available

---

## RecipeProduct

Represents a product used in a recipe.

Fields:

* id
* recipeId
* productId
* quantity
* unit

---

## RecipeProductMarket

Used only when a recipe uses manual pricing.

Fields:

* id
* recipeProductId
* marketId

---

## ShoppingList

Represents a shopping session.

Fields:

* id
* name
* status
* createdAt
* completedAt (optional)

### Statuses

* draft
* active
* completed
* archived

---

## ShoppingListItem

Represents a product inside a shopping list.

Fields:

* id
* shoppingListId
* productId

Planned:

* plannedQuantity
* plannedUnit

Actual:

* actualQuantity
* actualUnit
* actualPrice

References:

* marketId (optional)
* productPriceId (optional)

Status:

* pending
* bought
* skipped

---

## PantryItem

Represents inventory currently owned by the user.

Fields:

* id
* productId
* quantity
* unit
* createdAt
* updatedAt

---

## PantryTransaction

Represents a pantry inventory change.

Fields:

* id
* pantryItemId
* productId
* quantity
* unit
* type
* createdAt

### Types

* purchase
* consume
* adjustment
* waste

---

# 6. Units

Supported dimensions:

## Mass

* g
* kg

## Volume

* ml
* l
* tsp
* tbsp

## Count

* unit

The application must prevent invalid conversions between dimensions.

---

# 7. Product Management

Users can:

* Create products
* Edit products
* Delete products
* Assign categories
* Upload product images
* Rate products
* Add notes
* Mark products as favorites

## Product Detail

Must display:

* Product information
* Favorite status
* Product rating
* Product notes
* Latest price
* Price history
* Markets where prices exist

---

# 8. Category Management

Users can:

* Create categories
* Edit categories
* Delete categories

Products without a category appear under:

* Uncategorized

---

# 9. Market Management

Users can:

* Create markets
* Edit markets
* Delete markets

Fields:

* Name
* Address

---

# 10. Price Management

Users can:

* Add prices manually
* View price history
* Add prices while shopping

Requirements:

* Prices are immutable.
* New prices create new records.
* Historical prices remain available.

---

# 11. Recipe Management

Users can:

* Create recipes
* Edit recipes
* Delete recipes
* Upload recipe images

Users can add products to recipes.

Recipe cost is calculated automatically.

## Manual Pricing

Users select the market for each recipe product.

The application uses the latest available price from the selected market.

Example:

* Pasta → Lidl
* Tomato → Mercadona
* Beef → Local Butcher

## Cheapest Available Pricing

The application automatically chooses the cheapest available price across all markets.

Example:

* Pasta → Lidl
* Tomato → Carrefour
* Beef → Local Butcher

## Recipe Detail

Must display:

* Pricing strategy
* Total cost
* Cost per serving
* Product cost breakdown
* Market used for each product

Example:

* Pasta · Lidl · €0.72
* Tomato · Mercadona · €1.40
* Beef · Local Butcher · €3.80

---

# 12. Shopping Lists

Users can:

* Create shopping lists
* Edit shopping lists
* Complete shopping lists
* Archive shopping lists
* Duplicate shopping lists
* Buy Again from previous lists

## Item States

* Pending
* Bought
* Skipped

## Favorite Product Support

Product selectors should prioritize favorite products.

---

# 13. Shopping Workflow

For each shopping list item users can:

* Mark as bought
* Skip
* Edit actual quantity
* Edit actual price
* Select market

When an item is marked as bought:

1. Item status becomes Bought.
2. A new ProductPrice record is created.
3. Pantry inventory is updated.

---

# 14. Pantry

Users can:

* View inventory
* Add inventory manually
* Remove inventory manually
* Adjust inventory

When shopping list items are bought:

* Pantry inventory increases.

When recipes are cooked:

* Pantry inventory decreases.

All inventory changes create PantryTransactions.

---

# 15. Images

Supported entities:

* Product
* Recipe

Images are stored locally.

The database stores relative image paths only.

Examples:

```txt
images/products/product-id.jpg
images/recipes/recipe-id.jpg
```

Absolute filesystem paths must not be stored.

---

# 16. Internationalization

The application must support:

* English
* Spanish

Supported locales:

* en
* es

## Requirements

All user-facing text must be translatable.

Examples:

* Buttons
* Navigation
* Validation messages
* Empty states
* Error messages
* Status labels

No hardcoded user-facing strings are allowed.

## Language Detection

The application must:

1. Detect device language on first launch.
2. Use Spanish when device language is Spanish.
3. Use English when device language is unsupported.
4. Allow manual language switching.

## User Content

The following content is never translated:

* Product names
* Product notes
* Category names
* Market names
* Recipe names
* Recipe descriptions

## Formatting

The application must use locale-aware formatting for:

* Currency
* Numbers
* Dates

---

# 17. Data Import & Export

The application must support complete local backups.

## Export

Users can export a complete backup archive.

The backup must include:

* SQLite database
* Product images
* Recipe images
* Manifest file

Recommended archive structure:

```txt
backup.zip
  manifest.json
  database.sqlite
  images/
    products/
    recipes/
```

## Manifest

Fields:

* appName
* backupVersion
* exportedAt
* databaseFile
* imageDirectory

## Import

Import performs a full restore.

Current application data is replaced by imported data.

The user must explicitly confirm before import begins.

Warning:

```txt
Importing this backup will replace all current local data.
```

## Validation

Before import the application must validate:

* Backup archive exists
* Manifest exists
* Backup version is supported
* Database file exists

Import must be cancelled if validation fails.

---

# 18. Main Screens

## Products

Category-based catalog.

Displays:

* Categories
* Products
* Ratings
* Favorite indicators

Supports:

* Product CRUD
* Category CRUD

### Filtering

* Favorites only
* Minimum rating

### Sorting

* Name
* Highest rated
* Lowest rated
* Favorites first

---

## Product Detail

Displays:

* Product information
* Rating
* Notes
* Favorite status
* Latest price
* Price history
* Markets

---

## Markets

Displays all markets.

Supports:

* Market CRUD

---

## Recipes

Displays:

* Recipe list
* Recipe costs

Supports:

* Recipe CRUD

---

## Recipe Detail

Displays:

* Recipe products
* Pricing strategy
* Total cost
* Cost per serving
* Product cost breakdown

---

## Shopping Lists

Displays:

* Active lists
* Completed lists
* Archived lists

Supports:

* Shopping workflow
* Buy Again

---

## Pantry

Displays:

* Current inventory

Supports:

* Inventory adjustments

---

## Settings

Displays:

* Language selector
* Export data
* Import data
* Application version

---

# 19. Success Criteria

Users can:

* Manage products and categories.
* Track historical product prices.
* Rate products and add notes.
* Mark products as favorites.
* Create recipes and calculate costs.
* Use manual or cheapest-available pricing.
* Shop using reusable shopping lists.
* Update prices while shopping.
* Maintain pantry inventory.
* Export complete backups.
* Import complete backups.
* Switch between English and Spanish.
* Use the application entirely offline.
