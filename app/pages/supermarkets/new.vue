<script setup lang="ts">
import type { CreateSupermarketDTO } from "~/types/supermarket";

const { t } = useI18n();
const router = useRouter();
const { createSupermarket, loading, error, clearError } = useSupermarkets();

// Page meta
useHead({
  title: t("supermarkets.create.title"),
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Form submission state
const isSubmitting = ref(false);
const successMessage = ref("");

// Handle form submission
const handleSubmit = async (data: CreateSupermarketDTO) => {
  isSubmitting.value = true;
  clearError();
  successMessage.value = "";

  try {
    await createSupermarket(data);
    successMessage.value = t("supermarkets.create.success");

    // Redirect to supermarkets list after a brief delay to show success message
    setTimeout(() => {
      router.push("/supermarkets");
    }, 1000);
  } catch {
    // Error is handled by the composable and displayed below
  } finally {
    isSubmitting.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  router.push("/supermarkets");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Back Link -->
      <NuxtLink
        to="/supermarkets"
        class="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <Icon name="ph:arrow-left" size="18" />
        {{ t("supermarkets.heading") }}
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("supermarkets.create.heading") }}
        </h1>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20"
      >
        <Icon
          name="ph:check-circle"
          size="20"
          class="text-emerald-600 dark:text-emerald-400"
        />
        <p class="flex-1 text-sm text-emerald-600 dark:text-emerald-400">
          {{ successMessage }}
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="error"
        class="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
      >
        <Icon
          name="ph:warning-circle"
          size="20"
          class="text-red-600 dark:text-red-400"
        />
        <p class="flex-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          type="button"
          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          @click="clearError"
        >
          <Icon name="ph:x" size="18" />
        </button>
      </div>

      <!-- Form Card -->
      <div
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <SupermarketForm
          :is-submitting="isSubmitting || loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
