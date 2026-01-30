<script setup lang="ts">
/**
 * BaseAlert - Reusable alert component for displaying messages
 * 
 * @example
 * <BaseAlert variant="error" dismissible @dismiss="handleDismiss">Error message</BaseAlert>
 * <BaseAlert variant="success">Success message</BaseAlert>
 */

type AlertVariant = "success" | "error" | "warning" | "info";

interface Props {
  /** Alert visual variant */
  variant?: AlertVariant;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "info",
  dismissible: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

// Compute alert classes and icon based on variant
const alertConfig = computed(() => {
  const configs = {
    success: {
      containerClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      iconClass: "text-emerald-600 dark:text-emerald-400",
      iconName: "ph:check-circle",
      dismissClass:
        "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300",
    },
    error: {
      containerClass:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
      iconClass: "text-red-600 dark:text-red-400",
      iconName: "ph:warning-circle",
      dismissClass:
        "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300",
    },
    warning: {
      containerClass:
        "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      iconClass: "text-yellow-600 dark:text-yellow-400",
      iconName: "ph:warning",
      dismissClass:
        "text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300",
    },
    info: {
      containerClass:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      iconClass: "text-blue-600 dark:text-blue-400",
      iconName: "ph:info",
      dismissClass:
        "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
    },
  };

  return configs[props.variant];
});

// Handle dismiss
const handleDismiss = () => {
  emit("dismiss");
};
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg border p-4"
    :class="alertConfig.containerClass"
  >
    <!-- Icon -->
    <Icon
      :name="alertConfig.iconName"
      size="20"
      :class="alertConfig.iconClass"
    />

    <!-- Message Content -->
    <div class="flex-1 text-sm">
      <slot />
    </div>

    <!-- Dismiss Button -->
    <button
      v-if="dismissible"
      type="button"
      :class="alertConfig.dismissClass"
      @click="handleDismiss"
    >
      <Icon name="ph:x" size="18" />
    </button>
  </div>
</template>
