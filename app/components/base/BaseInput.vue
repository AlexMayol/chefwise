<script setup lang="ts">
/**
 * BaseInput - Reusable input field component with icon, validation, and error states
 *
 * @example
 * <BaseInput v-model="email" type="email" icon="ph:envelope" placeholder="Enter email" />
 * <BaseInput v-model="name" label="Name" :error="errors.name" required />
 */

interface Props {
  /** Input value (use v-model) */
  modelValue?: string;
  /** Input type */
  type?: string;
  /** Input label */
  label?: string;
  /** Input placeholder */
  placeholder?: string;
  /** Icon name to display in the input */
  icon?: string;
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
  type: "text",
  label: undefined,
  placeholder: undefined,
  icon: undefined,
  error: undefined,
  required: false,
  disabled: false,
  autocomplete: undefined,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
}>();

// Generate unique ID if not provided
const inputId = computed(
  () => props.id || `input-${Math.random().toString(36).substring(2, 11)}`,
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

// Compute input classes
const inputClasses = computed(() => {
  const baseClasses =
    "w-full rounded-lg border bg-white py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500";

  const paddingClasses = props.icon ? "pl-10 pr-4" : "px-4";

  const stateClasses = props.error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-600 dark:focus:border-emerald-500";

  return [baseClasses, paddingClasses, stateClasses].join(" ");
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
      <!-- Icon -->
      <div
        v-if="icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <Icon :name="icon" size="18" class="text-gray-400 dark:text-gray-500" />
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="updateValue"
        @blur="handleBlur"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="mt-1.5 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>
