# UI Kit - Before & After Comparison

## Code Reduction Examples

### Example 1: Button Component

**BEFORE** (inline button in every page):

```vue
<button
  type="submit"
  :disabled="isLoading"
  class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-800"
>
  <Icon
    v-if="isLoading"
    name="ph:spinner"
    size="20"
    class="animate-spin"
  />
  <span>{{
    isLoading ? t("common.loading") : t("auth.login.submit")
  }}</span>
</button>
```

**14 lines of repetitive code per button**

**AFTER** (using BaseButton):

```vue
<BaseButton type="submit" variant="primary" :loading="isLoading" full-width>
  {{ isLoading ? t("common.loading") : t("auth.login.submit") }}
</BaseButton>
```

**8 lines - 57% reduction!**

---

### Example 2: Input Field

**BEFORE** (repeated in login, register, forms):

```vue
<div>
  <label
    for="email"
    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {{ t("auth.fields.email") }}
  </label>
  <div class="relative">
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <Icon
        name="ph:envelope"
        size="18"
        class="text-gray-400 dark:text-gray-500"
      />
    </div>
<input
  id="email"
  v-model="email"
  type="email"
  autocomplete="email"
  :placeholder="t('auth.placeholders.email')"
  class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-emerald-500"
  :class="{
    'border-red-500 focus:border-red-500 focus:ring-red-500/20': errors.email,
  }"
  @blur="validateEmail(email)"
/>

<p v-if="errors.email" class="mt-1.5 text-xs text-red-500">
    {{ errors.email }}
  </p>
```

**35 lines per input field!**

**AFTER** (using BaseInput):

```vue
<BaseInput
  id="email"
  v-model="email"
  type="email"
  :label="t('auth.fields.email')"
  :placeholder="t('auth.placeholders.email')"
  icon="ph:envelope"
  autocomplete="email"
  :error="errors.email"
  @blur="validateEmail(email)"
/>
```

**11 lines - 69% reduction!**

---

### Example 3: Password Field

**BEFORE** (password with toggle visibility):

```vue
<div>
  <label
    for="password"
    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {{ t("auth.fields.password") }}
  </label>
  <div class="relative">
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <Icon
        name="ph:lock"
        size="18"
        class="text-gray-400 dark:text-gray-500"
      />
    </div>
<input
  id="password"
  v-model="password"
  :type="showPassword ? 'text' : 'password'"
  autocomplete="current-password"
  :placeholder="t('auth.placeholders.password')"
  class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-emerald-500"
  :class="{
    'border-red-500 focus:border-red-500 focus:ring-red-500/20':
      errors.password,
  }"
  @blur="validatePassword(password)"
/>
<button
  type="button"
  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
  @click="showPassword = !showPassword"
>
      <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" size="18" />
    </button>

<p v-if="errors.password" class="mt-1.5 text-xs text-red-500">
    {{ errors.password }}
  </p>
```

**42 lines + need to manage `showPassword` ref**

**AFTER** (using BasePasswordInput):

```vue
<BasePasswordInput
  id="password"
  v-model="password"
  :label="t('auth.fields.password')"
  :placeholder="t('auth.placeholders.password')"
  autocomplete="current-password"
  :error="errors.password"
  @blur="validatePassword(password)"
/>
```

**9 lines - 79% reduction! No need to manage showPassword state**

---

### Example 4: Alert Messages

**BEFORE**:

```vue
<div
  v-if="errorMessage"
  class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
>
  <Icon name="ph:warning-circle" size="18" />
  <span>{{ errorMessage }}</span>
</div>
```

**8 lines per alert**

**AFTER**:

```vue
<BaseAlert variant="error" class="mb-4">
  {{ errorMessage }}
</BaseAlert>
```

**3 lines - 63% reduction!**

---

### Example 5: Modal Dialog

**BEFORE** (delete confirmation modal):

```vue
<Teleport to="body">
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 transition-opacity"
      @click="closeDeleteModal"
    />

    <!-- Modal -->
    <div
      class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
        >
          <Icon
            name="ph:warning"
            size="24"
            class="text-red-600 dark:text-red-400"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t("supermarkets.delete.title") }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              t("supermarkets.delete.message", {
                name: supermarketToDelete?.name,
              })
            }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          :disabled="isDeleting"
          @click="closeDeleteModal"
        >
          {{ t("common.cancel") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isDeleting"
          @click="confirmDelete"
        >
          <Icon
            v-if="isDeleting"
            name="ph:spinner"
            size="18"
            class="animate-spin"
          />
          {{ t("common.delete") }}
        </button>
      </div>
    </div>
  </div>
</Teleport>
```

**67 lines of modal code**

**AFTER**:

```vue
<BaseModal
  v-model="showDeleteModal"
  :title="t('supermarkets.delete.title')"
  icon="ph:warning"
  icon-variant="danger"
  max-width="md"
>
  <template #subtitle>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{
        t("supermarkets.delete.message", {
          name: supermarketToDelete?.name,
        })
      }}
    </p>
  </template>

  <template #actions="{ close }">
    <BaseButton
      variant="secondary"
      :disabled="isDeleting"
      @click="close"
    >
      {{ t("common.cancel") }}
    </BaseButton>
    <BaseButton
      variant="danger"
      :loading="isDeleting"
      @click="confirmDelete"
    >
      {{ t("common.delete") }}
    </BaseButton>
  </template>
</BaseModal>
```

**32 lines - 52% reduction!**

---

## Summary of Improvements

| Component | Before (lines) | After (lines) | Reduction |
| --------- | -------------- | ------------- | --------- |
| Button    | 14             | 8             | 57%       |
| Input     | 35             | 11            | 69%       |
| Password  | 42             | 9             | 79%       |
| Alert     | 8              | 3             | 63%       |
| Modal     | 67             | 32            | 52%       |

## Additional Benefits

Beyond code reduction, the UI Kit provides:

1. **Consistency**: Identical styling across all pages
2. **Maintainability**: One place to update all buttons/inputs
3. **Type Safety**: Full TypeScript support
4. **Accessibility**: Built-in ARIA labels and keyboard support
5. **Dark Mode**: Automatic support in all components
6. **Validation**: Standardized error display
7. **Loading States**: Consistent loading indicators
8. **Documentation**: Comprehensive examples for all components

## Developer Experience

**Before**: Copy-paste large blocks of template code, adjust classes, hope for consistency

**After**: Import component, pass props, done! IntelliSense provides all available options.
