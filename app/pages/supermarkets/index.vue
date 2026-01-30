<script setup lang="ts">
const { t } = useI18n();
const {
  supermarkets,
  loading,
  error,
  getSupermarkets,
  deleteSupermarket,
  clearError,
} = useSupermarkets();

// Page meta
useHead({
  title: t("supermarkets.title"),
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Delete confirmation modal state
const showDeleteModal = ref(false);
const supermarketToDelete = ref<{ id: string; name: string } | null>(null);
const isDeleting = ref(false);

// Fetch supermarkets on mount
onMounted(async () => {
  await getSupermarkets();
});

// Open delete confirmation modal
const openDeleteModal = (id: string, name: string) => {
  supermarketToDelete.value = { id, name };
  showDeleteModal.value = true;
};

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  supermarketToDelete.value = null;
};

// Confirm delete
const confirmDelete = async () => {
  if (!supermarketToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteSupermarket(supermarketToDelete.value.id);
    closeDeleteModal();
  } catch {
    // Error is handled by the composable
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t("supermarkets.heading") }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("supermarkets.subheading") }}
          </p>
        </div>
        <NuxtLink
          to="/supermarkets/new"
          class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Icon name="ph:plus" size="18" />
          {{ t("supermarkets.addNew") }}
        </NuxtLink>
      </div>

      <!-- Error Alert -->
      <BaseAlert
        v-if="error"
        variant="error"
        dismissible
        class="mb-6"
        @dismiss="clearError"
      >
        {{ error }}
      </BaseAlert>

      <!-- Loading State -->
      <div
        v-if="loading && supermarkets.length === 0"
        class="flex justify-center py-12"
      >
        <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Icon name="ph:spinner" size="24" class="animate-spin" />
          <span>{{ t("common.loading") }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && supermarkets.length === 0"
        class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800"
      >
        <Icon
          name="ph:storefront"
          size="48"
          class="mx-auto text-gray-400 dark:text-gray-500"
        />
        <h2 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          {{ t("supermarkets.empty.title") }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ t("supermarkets.empty.description") }}
        </p>
        <NuxtLink
          to="/supermarkets/new"
          class="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <Icon name="ph:plus" size="18" />
          {{ t("supermarkets.addFirst") }}
        </NuxtLink>
      </div>

      <!-- Supermarkets Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SupermarketCard
          v-for="supermarket in supermarkets"
          :key="supermarket.id"
          :supermarket="supermarket"
          @delete="openDeleteModal(supermarket.id, supermarket.name)"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
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
        <BaseButton variant="secondary" :disabled="isDeleting" @click="close">
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
  </div>
</template>
