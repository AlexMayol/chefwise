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
    class="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
  >
    <!-- Card Content -->
    <NuxtLink :to="`/supermarkets/${supermarket.id}`" class="block p-6">
      <div class="flex items-start gap-4">
        <!-- Logo -->
        <div
          class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700"
        >
          <NuxtImg
            v-if="supermarket.logo_url"
            :src="supermarket.logo_url"
            :alt="supermarket.name"
            class="h-10 w-10 rounded object-cover"
          />
          <Icon
            v-else
            name="ph:storefront"
            size="28"
            class="text-gray-400 dark:text-gray-500"
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
      class="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-slate-700"
    >
      <NuxtLink
        :to="`/supermarkets/${supermarket.id}/edit`"
        class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"
      >
        <Icon name="ph:pencil-simple" size="16" />
        {{ t("common.edit") }}
      </NuxtLink>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        @click.prevent="handleDelete"
      >
        <Icon name="ph:trash" size="16" />
        {{ t("common.delete") }}
      </button>
    </div>
  </div>
</template>
