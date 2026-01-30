<script setup lang="ts">
/**
 * BasePasswordInput - Password input field with visibility toggle
 *
 * @example
 * <BasePasswordInput v-model="password" label="Password" :error="errors.password" />
 */

interface Props {
  /** Input value (use v-model) */
  modelValue?: string;
  /** Input label */
  label?: string;
  /** Input placeholder */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Autocomplete attribute */
  autocomplete?: string;
  /** Input ID */
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: undefined,
  placeholder: undefined,
  error: undefined,
  required: false,
  disabled: false,
  autocomplete: "current-password",
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
}>();

// Show/hide password state
const showPassword = ref(false);

// Generate unique ID if not provided
const inputId = computed(
  () => props.id || `password-${Math.random().toString(36).substr(2, 9)}`,
);

// Update model value
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

// Handle blur event
const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Compute input classes
const inputClasses = computed(() => {
  const baseClasses =
    "w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500";

  const stateClasses = props.error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-600 dark:focus:border-emerald-500";

  return [baseClasses, stateClasses].join(" ");
});
</script>

<template>
  <div>
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Lock Icon -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <Icon
          name="ph:lock"
          size="18"
          class="text-gray-400 dark:text-gray-500"
        />
      </div>

      <!-- Password Input Field -->
      <input
        :id="inputId"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="updateValue"
        @blur="handleBlur"
      />

      <!-- Toggle Visibility Button -->
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        @click="togglePasswordVisibility"
      >
        <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" size="18" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1.5 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>
