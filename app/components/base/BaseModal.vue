<script setup lang="ts">
/**
 * BaseModal - Reusable modal dialog component
 * 
 * @example
 * <BaseModal v-model="showModal" title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <template #actions>
 *     <BaseButton @click="handleConfirm">Confirm</BaseButton>
 *   </template>
 * </BaseModal>
 */

interface Props {
  /** Whether the modal is visible (use v-model) */
  modelValue: boolean;
  /** Modal title */
  title?: string;
  /** Icon name to display in the header */
  icon?: string;
  /** Icon background color variant */
  iconVariant?: "default" | "danger" | "warning" | "success";
  /** Maximum width of the modal */
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  icon: undefined,
  iconVariant: "default",
  maxWidth: "md",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// Close modal
const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

// Icon background classes
const iconBackgroundClasses = computed(() => {
  const variants = {
    default: "bg-emerald-100 dark:bg-emerald-900/30",
    danger: "bg-red-100 dark:bg-red-900/30",
    warning: "bg-yellow-100 dark:bg-yellow-900/30",
    success: "bg-emerald-100 dark:bg-emerald-900/30",
  };
  return variants[props.iconVariant];
});

// Icon color classes
const iconColorClasses = computed(() => {
  const variants = {
    default: "text-emerald-600 dark:text-emerald-400",
    danger: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    success: "text-emerald-600 dark:text-emerald-400",
  };
  return variants[props.iconVariant];
});

// Modal width classes
const modalWidthClasses = computed(() => {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };
  return widths[props.maxWidth];
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity"
        @click="closeModal"
      />

      <!-- Modal -->
      <div
        class="relative z-10 w-full rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800"
        :class="modalWidthClasses"
      >
        <!-- Header -->
        <div v-if="title || icon" class="flex items-center gap-4">
          <!-- Icon -->
          <div
            v-if="icon"
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
            :class="iconBackgroundClasses"
          >
            <Icon
              :name="icon"
              size="24"
              :class="iconColorClasses"
            />
          </div>

          <!-- Title -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <!-- Subtitle slot -->
            <slot name="subtitle" />
          </div>

          <!-- Close button (if no actions slot) -->
          <button
            v-if="!$slots.actions"
            type="button"
            class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            @click="closeModal"
          >
            <Icon name="ph:x" size="20" />
          </button>
        </div>

        <!-- Content -->
        <div
          class="text-gray-600 dark:text-gray-300"
          :class="{ 'mt-4': title || icon }"
        >
          <slot />
        </div>

        <!-- Actions -->
        <div v-if="$slots.actions" class="mt-6 flex justify-end gap-3">
          <slot name="actions" :close="closeModal" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
