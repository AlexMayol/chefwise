<script setup lang="ts">
/**
 * BaseButton - Reusable button component with multiple variants and states
 *
 * @example
 * <BaseButton variant="primary" @click="handleClick">Save</BaseButton>
 * <BaseButton variant="danger" :loading="isDeleting">Delete</BaseButton>
 */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface Props {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button shows a loading state */
  loading?: boolean;
  /** Button type attribute */
  type?: "button" | "submit" | "reset";
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Icon name to display before the text */
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  type: "button",
  fullWidth: false,
  icon: undefined,
});

// Compute button classes based on variant and size
const buttonClasses = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500 dark:focus:ring-offset-slate-800",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-emerald-500 dark:text-gray-300 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-800",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = props.fullWidth ? "w-full" : "";

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    widthClass,
  ].join(" ");
});
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses">
    <!-- Loading Spinner -->
    <Icon
      v-if="loading"
      name="ph:spinner"
      :size="size === 'sm' ? '16' : size === 'lg' ? '22' : '18'"
      class="animate-spin"
    />

    <!-- Icon (if provided and not loading) -->
    <Icon
      v-else-if="icon"
      :name="icon"
      :size="size === 'sm' ? '16' : size === 'lg' ? '22' : '18'"
    />

    <!-- Button Content -->
    <slot />
  </button>
</template>
