# Base UI Components

This directory contains reusable UI components that form the ChefWise UI Kit.

## Components

- **BaseButton** - Flexible button with variants and loading states
- **BaseInput** - Text input with icon, label, and validation
- **BasePasswordInput** - Password field with visibility toggle
- **BaseAlert** - Alert messages (success, error, warning, info)
- **BaseModal** - Modal dialog with customizable header and actions

## Documentation

For complete documentation, examples, and usage guidelines, see [/docs/UI_KIT.md](../../docs/UI_KIT.md)

## Auto-Import

All components in this directory are automatically imported by Nuxt. You can use them anywhere in the app without explicit imports:

```vue
<template>
  <BaseButton variant="primary" @click="handleClick"> Click Me </BaseButton>
</template>
```

## Naming Convention

- Prefix: `Base` - indicates core UI component
- PascalCase: follows Vue component naming convention
- Descriptive: clearly indicates component purpose
