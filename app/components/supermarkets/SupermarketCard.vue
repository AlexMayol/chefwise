<script setup lang="ts">
import type { Supermarket } from "~/types/supermarket";

const { t } = useI18n();

const props = defineProps<{
  supermarket: Supermarket;
}>();

const emit = defineEmits<{
  delete: [id: string, name: string];
}>();

const handleDelete = () => {
  emit("delete", props.supermarket.id, props.supermarket.name);
};
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Card Content -->
    <NuxtLink :to="`/supermarkets/${supermarket.id}`" class="block p-6">
      <div class="flex items-start gap-4">
        <!-- Logo -->
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900"
        >
          <NuxtImg
            v-if="supermarket.logo_url"
            :src="supermarket.logo_url"
            :alt="supermarket.name"
            class="h-12 w-12 rounded-lg object-cover"
          />
          <Icon
            v-else
            name="ph:storefront"
            size="32"
            class="text-primary-600 dark:text-primary-400"
          />
        </div>

        <!-- Details -->
        <div class="min-w-0 flex-1">
          <h3
            class="truncate text-lg font-semibold text-gray-900 dark:text-white"
          >
            {{ supermarket.name }}
          </h3>
          <p
            v-if="supermarket.location"
            class="mt-1 flex items-center gap-1 truncate text-sm text-gray-500 dark:text-gray-400"
          >
            <Icon name="ph:map-pin" size="14" class="flex-shrink-0" />
            <span class="truncate">{{ supermarket.location }}</span>
          </p>
          <p
            v-else
            class="mt-1 text-sm italic text-gray-400 dark:text-gray-500"
          >
            {{ t("supermarkets.noLocation") }}
          </p>
        </div>
      </div>
    </NuxtLink>

    <!-- Actions -->
    <div
      class="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
    >
      <NuxtLink
        :to="`/supermarkets/${supermarket.id}/edit`"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-primary-400"
      >
        <Icon name="ph:pencil-simple" size="16" />
        {{ t("common.edit") }}
      </NuxtLink>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        @click.prevent="handleDelete"
      >
        <Icon name="ph:trash" size="16" />
        {{ t("common.delete") }}
      </button>
    </div>
  </div>
</template>
