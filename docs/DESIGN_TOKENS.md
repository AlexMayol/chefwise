# ChefWise Design Tokens

This document defines the design tokens (color palette, spacing, typography, etc.) that must be used consistently across all components in ChefWise.

## Color System

Based on the landing page design, ChefWise uses a vibrant, modern color palette centered around emerald, teal, and cyan gradients.

### Primary Colors

These are the main brand colors used for primary actions, buttons, and key UI elements.

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `primary-50` | emerald-50 | emerald-950 | Subtle backgrounds |
| `primary-100` | emerald-100 | emerald-900 | Light backgrounds, hover states |
| `primary-500` | emerald-500 | emerald-500 | Primary actions, icons |
| `primary-600` | emerald-600 | emerald-400 | Primary buttons, links (main) |
| `primary-700` | emerald-700 | emerald-300 | Button hover states |

### Secondary Colors

Secondary colors for additional UI elements and gradients.

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `secondary-50` | teal-50 | teal-950 | Subtle backgrounds |
| `secondary-100` | teal-100 | teal-900 | Light backgrounds |
| `secondary-500` | teal-500 | teal-500 | Secondary actions |
| `secondary-600` | teal-600 | teal-400 | Secondary buttons, accents |
| `secondary-700` | teal-700 | teal-300 | Hover states |

### Accent Colors

Accent colors for variety and feature differentiation.

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `accent-50` | cyan-50 | cyan-950 | Subtle accents |
| `accent-100` | cyan-100 | cyan-900 | Light accent backgrounds |
| `accent-500` | cyan-500 | cyan-500 | Accent elements |
| `accent-600` | cyan-600 | cyan-400 | Accent highlights |
| `accent-700` | cyan-700 | cyan-300 | Accent hover states |

### Neutral Colors

Neutral colors for text, borders, and backgrounds.

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `neutral-50` | gray-50 | gray-950 | Page background |
| `neutral-100` | gray-100 | gray-900 | Card backgrounds |
| `neutral-200` | gray-200 | gray-800 | Borders, dividers |
| `neutral-400` | gray-400 | gray-600 | Disabled text, placeholders |
| `neutral-600` | gray-600 | gray-400 | Secondary text |
| `neutral-700` | gray-700 | gray-300 | Body text |
| `neutral-900` | gray-900 | white | Headings, primary text |

### Feature Colors

Special colors for specific features (matching landing page features).

| Token Name | Colors | Usage |
|------------|--------|-------|
| `feature-1` | emerald→teal | Product tracking, cost management |
| `feature-2` | teal→cyan | Recipe creation, cooking |
| `feature-3` | cyan→blue | Price comparison, analytics |
| `feature-4` | blue→indigo | Sharing, collaboration |
| `feature-5` | indigo→purple | History, tracking |
| `feature-6` | purple→pink | Social features |

### Status Colors

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `success` | emerald-600 | emerald-500 | Success messages, confirmations |
| `error` | red-600 | red-500 | Errors, destructive actions |
| `warning` | amber-600 | amber-500 | Warnings, cautions |
| `info` | blue-600 | blue-500 | Informational messages |

## Gradients

### Primary Gradient
**Class**: `bg-gradient-to-r from-emerald-500 to-teal-600`
- **Usage**: Primary CTAs, hero sections, main action buttons
- **Dark Mode**: `dark:from-emerald-600 dark:to-teal-700`

### Secondary Gradient
**Class**: `bg-gradient-to-r from-teal-500 to-cyan-600`
- **Usage**: Secondary features, cards, highlights
- **Dark Mode**: `dark:from-teal-600 dark:to-cyan-700`

### Background Gradient
**Class**: `bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50`
- **Usage**: Page backgrounds, sections
- **Dark Mode**: `dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950`

### CTA Gradient
**Class**: `bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600`
- **Usage**: Call-to-action sections, emphasis areas
- **Dark Mode**: `dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900`

## Typography

### Font Family
- **All text**: Inter (defined in `tailwind.config.ts`)
- **Fallback**: system fonts

### Font Sizes
| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem | Small labels, captions |
| `text-sm` | 0.875rem | Body text, form inputs |
| `text-base` | 1rem | Default body text |
| `text-lg` | 1.125rem | Emphasized text |
| `text-xl` | 1.25rem | Small headings |
| `text-2xl` | 1.5rem | Section headings |
| `text-3xl` | 1.875rem | Page titles |
| `text-4xl` | 2.25rem | Hero titles |
| `text-5xl` | 3rem | Large hero text |

### Font Weights
| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text |
| `font-semibold` | 600 | Buttons, labels |
| `font-bold` | 700 | Headings, titles |

## Spacing

Use Tailwind's default spacing scale (0.25rem = 4px increments).

### Common Spacing Patterns
- **Card padding**: `p-6` or `p-8`
- **Section padding**: `py-20 lg:py-32`
- **Container padding**: `px-4 sm:px-6 lg:px-8`
- **Gap between elements**: `gap-4` or `gap-6`
- **Margin between sections**: `mb-8` or `mb-16`

## Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `rounded-md` | 0.375rem | Small elements, inputs |
| `rounded-lg` | 0.5rem | Buttons, small cards |
| `rounded-xl` | 0.75rem | Medium cards, modals |
| `rounded-2xl` | 1rem | Large cards, sections |
| `rounded-3xl` | 1.5rem | Feature cards, hero elements |

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation (cards) |
| `shadow-md` | Medium elevation (dropdowns) |
| `shadow-lg` | High elevation (modals) |
| `shadow-xl` | Prominent elevation (hero elements) |
| `shadow-2xl` | Maximum elevation (CTAs) |

### Special Shadows
- **Gradient shadow**: `shadow-lg shadow-emerald-500/25` for primary buttons
- **Card hover**: `hover:shadow-md` for interactive cards

## Component-Specific Tokens

### Buttons

#### Primary Button
```html
<button class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
  Button Text
</button>
```

#### Secondary Button
```html
<button class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300">
  Button Text
</button>
```

### Cards

#### Feature Card
```html
<div class="group p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 rounded-2xl border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
  <!-- Card content -->
</div>
```

#### Content Card
```html
<div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-8 shadow-sm hover:shadow-md transition-shadow">
  <!-- Card content -->
</div>
```

### Icons

#### Icon Sizes
- **Small**: `size="16"` or `size="18"` for inline icons
- **Medium**: `size="24"` for section icons
- **Large**: `size="48"` for feature icons

#### Icon Colors
- **Primary**: `text-emerald-600 dark:text-emerald-400`
- **Secondary**: `text-teal-600 dark:text-teal-400`
- **Accent**: `text-cyan-600 dark:text-cyan-400`
- **Neutral**: `text-gray-600 dark:text-gray-400`

### Page Backgrounds

#### Light Background
```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
```

#### Gradient Background
```html
<div class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
```

## Animations & Transitions

### Standard Transition
```css
transition-all duration-300
```

### Slow Transition
```css
transition-all duration-500
```

### Hover Effects
- **Scale up**: `hover:scale-105`
- **Translate up**: `hover:-translate-y-2`
- **Shadow increase**: `hover:shadow-xl`

### Scroll Animations
```css
transition-all duration-1000
opacity-0 translate-y-10 /* Initial state */
opacity-100 translate-y-0 /* Visible state */
```

## Dark Mode

ChefWise uses class-based dark mode (`darkMode: "class"` in Tailwind config).

### Dark Mode Patterns
- Always provide both light and dark variants for colors
- Use darker shades (900/950) for dark mode backgrounds
- Use lighter shades (300/400) for dark mode text/accents
- Maintain contrast ratios for accessibility

### Example
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800">
```

## Usage Guidelines

1. **Consistency**: Always use these tokens instead of arbitrary values
2. **Gradients**: Use primary gradient for main CTAs, secondary for features
3. **Spacing**: Use consistent spacing patterns (4px increments)
4. **Borders**: Keep border radius consistent per component type
5. **Shadows**: Use appropriate shadow elevation for visual hierarchy
6. **Dark Mode**: Always include dark mode variants
7. **Transitions**: Add smooth transitions for interactive elements
8. **Accessibility**: Maintain WCAG 2.1 AA contrast ratios

## Examples in Code

### Page Header
```vue
<div class="mb-8 flex items-center justify-between">
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Page Title
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
      Subtitle text
    </p>
  </div>
  <button class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
    Action
  </button>
</div>
```

### Feature Grid
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div class="group p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 rounded-2xl border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
    <!-- Feature content -->
  </div>
</div>
```
