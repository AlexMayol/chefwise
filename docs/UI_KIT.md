# ChefWise UI Kit

A collection of reusable Vue components for the ChefWise application. All components are located in `app/components/base/` and are auto-imported by Nuxt.

## Components

### BaseButton

A flexible button component with multiple variants, sizes, and states.

**Props:**

- `variant?: "primary" | "secondary" | "danger" | "ghost"` - Visual style (default: `"primary"`)
- `size?: "sm" | "md" | "lg"` - Button size (default: `"md"`)
- `disabled?: boolean` - Whether button is disabled (default: `false`)
- `loading?: boolean` - Shows loading spinner (default: `false`)
- `type?: "button" | "submit" | "reset"` - Button type (default: `"button"`)
- `fullWidth?: boolean` - Makes button full width (default: `false`)
- `icon?: string` - Icon name to display before text (default: `undefined`)

**Examples:**

```vue
<!-- Primary button -->
<BaseButton variant="primary" @click="handleSave">
  Save Changes
</BaseButton>

<!-- Button with loading state -->
<BaseButton variant="primary" :loading="isSubmitting">
  Submit
</BaseButton>

<!-- Full width button with icon -->
<BaseButton variant="primary" icon="ph:plus" full-width>
  Add New Item
</BaseButton>

<!-- Secondary and danger buttons -->
<BaseButton variant="secondary" @click="handleCancel">
  Cancel
</BaseButton>

<BaseButton variant="danger" @click="handleDelete">
  Delete
</BaseButton>
```

---

### BaseInput

A text input component with icon, label, validation, and error states.

**Props:**

- `modelValue?: string` - Input value (use with `v-model`)
- `type?: string` - Input type (default: `"text"`)
- `label?: string` - Input label text
- `placeholder?: string` - Placeholder text
- `icon?: string` - Icon name to display in input
- `error?: string` - Error message to display
- `required?: boolean` - Marks field as required (default: `false`)
- `disabled?: boolean` - Whether input is disabled (default: `false`)
- `autocomplete?: string` - Autocomplete attribute
- `id?: string` - Input ID (auto-generated if not provided)

**Emits:**

- `update:modelValue` - Emits when value changes
- `blur` - Emits on blur event

**Examples:**

```vue
<!-- Basic input with label and icon -->
<BaseInput
  v-model="email"
  type="email"
  label="Email Address"
  icon="ph:envelope"
  placeholder="Enter your email"
/>

<!-- Input with error state -->
<BaseInput
  v-model="name"
  label="Name"
  icon="ph:user"
  :error="errors.name"
  required
  @blur="validateName"
/>

<!-- Input with custom autocomplete -->
<BaseInput
  v-model="username"
  label="Username"
  icon="ph:user-circle"
  autocomplete="username"
/>
```

---

### BasePasswordInput

A password input component with visibility toggle functionality.

**Props:**

- `modelValue?: string` - Input value (use with `v-model`)
- `label?: string` - Input label text
- `placeholder?: string` - Placeholder text
- `error?: string` - Error message to display
- `required?: boolean` - Marks field as required (default: `false`)
- `disabled?: boolean` - Whether input is disabled (default: `false`)
- `autocomplete?: string` - Autocomplete attribute (default: `"current-password"`)
- `id?: string` - Input ID (auto-generated if not provided)

**Emits:**

- `update:modelValue` - Emits when value changes
- `blur` - Emits on blur event

**Examples:**

```vue
<!-- Password input with label -->
<BasePasswordInput
  v-model="password"
  label="Password"
  placeholder="Enter your password"
/>

<!-- Password input with error -->
<BasePasswordInput
  v-model="newPassword"
  label="New Password"
  :error="errors.password"
  autocomplete="new-password"
  @blur="validatePassword"
/>
```

---

### BaseAlert

An alert component for displaying success, error, warning, or info messages.

**Props:**

- `variant?: "success" | "error" | "warning" | "info"` - Alert type (default: `"info"`)
- `dismissible?: boolean` - Whether alert can be dismissed (default: `false`)

**Emits:**

- `dismiss` - Emits when dismiss button is clicked

**Examples:**

```vue
<!-- Error alert -->
<BaseAlert variant="error">
  An error occurred while processing your request.
</BaseAlert>

<!-- Success alert with dismiss button -->
<BaseAlert variant="success" dismissible @dismiss="handleDismiss">
  Your changes have been saved successfully!
</BaseAlert>

<!-- Warning alert -->
<BaseAlert variant="warning">
  This action cannot be undone.
</BaseAlert>

<!-- Info alert -->
<BaseAlert variant="info">
  Your session will expire in 5 minutes.
</BaseAlert>
```

---

### BaseModal

A modal dialog component with customizable header, content, and actions.

**Props:**

- `modelValue: boolean` - Whether modal is visible (use with `v-model`)
- `title?: string` - Modal title text
- `icon?: string` - Icon name to display in header
- `iconVariant?: "default" | "danger" | "warning" | "success"` - Icon background color (default: `"default"`)
- `maxWidth?: "sm" | "md" | "lg" | "xl"` - Maximum width of modal (default: `"md"`)

**Emits:**

- `update:modelValue` - Emits when modal visibility changes
- `close` - Emits when modal is closed

**Slots:**

- `default` - Modal content
- `subtitle` - Subtitle below the title
- `actions` - Modal action buttons (receives `close` function as prop)

**Examples:**

```vue
<!-- Basic confirmation modal -->
<BaseModal
  v-model="showModal"
  title="Confirm Action"
  icon="ph:warning"
  icon-variant="danger"
>
  <p>Are you sure you want to delete this item?</p>
  
  <template #actions="{ close }">
    <BaseButton variant="secondary" @click="close">
      Cancel
    </BaseButton>
    <BaseButton variant="danger" @click="handleConfirm">
      Delete
    </BaseButton>
  </template>
</BaseModal>

<!-- Modal with subtitle -->
<BaseModal
  v-model="showDetailsModal"
  title="User Details"
  icon="ph:user-circle"
  max-width="lg"
>
  <template #subtitle>
    <p class="text-sm text-gray-500">View and edit user information</p>
  </template>

  <!-- Modal content here -->
  
  <template #actions="{ close }">
    <BaseButton variant="primary" @click="handleSave">
      Save Changes
    </BaseButton>
  </template>
</BaseModal>
```

---

## Design System

### Colors

- **Primary**: Emerald (green) - used for primary actions
- **Secondary**: Gray - used for secondary actions
- **Danger**: Red - used for destructive actions
- **Success**: Emerald/Green - used for success messages
- **Warning**: Yellow - used for warnings
- **Info**: Blue - used for informational messages

### Sizes

Components support three standard sizes:

- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

### Dark Mode

All components support dark mode automatically through Tailwind's dark mode classes.

---

## Usage Guidelines

1. **Consistency**: Always use these base components instead of creating custom buttons, inputs, or alerts
2. **Accessibility**: Components include proper ARIA attributes and keyboard navigation
3. **Validation**: Use the error prop on input components to display validation messages
4. **Loading States**: Use the loading prop on buttons during async operations
5. **Icons**: Use Phosphor icons (e.g., `"ph:icon-name"`) for consistency

---

## Code Reduction

By implementing this UI Kit, we've reduced code duplication across the application:

- **login.vue**: Reduced from 235 lines to ~130 lines
- **register.vue**: Reduced from 354 lines to ~220 lines
- **supermarkets/index.vue**: Reduced from 217 lines to ~150 lines
- **SupermarketForm.vue**: Reduced from 255 lines to ~180 lines

**Total reduction**: ~255 lines of code removed while maintaining all functionality.

---

## Future Enhancements

Potential components to add in the future:

- `BaseCard` - Reusable card wrapper
- `BaseSelect` - Custom select/dropdown component
- `BaseTextarea` - Textarea with similar styling to BaseInput
- `BaseCheckbox` - Checkbox input component
- `BaseRadio` - Radio input component
- `BaseToast` - Toast notification system
- `BaseSpinner` - Loading spinner component
- `BaseBadge` - Badge/tag component
- `BaseEmptyState` - Empty state placeholder
