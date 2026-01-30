<script setup lang="ts">
const { t } = useI18n();
const user = useSupabaseUser();
const client = useSupabaseClient();

// Page meta
useHead({
  title: t("dashboard.title"),
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});

// Handle sign out
const handleSignOut = async () => {
  await client.auth.signOut();
  navigateTo("/login");
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-primary-950 dark:to-secondary-950">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t("dashboard.heading") }}
          </h1>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-400">
            {{ t("dashboard.welcome", { email: user?.email }) }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-primary-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:bg-gray-700"
          @click="handleSignOut"
        >
          <Icon name="ph:sign-out" size="18" />
          {{ t("auth.signOut") }}
        </button>
      </div>

      <!-- Dashboard Content Placeholder -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
          <Icon
            name="ph:chart-line"
            size="40"
            class="text-white"
          />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("dashboard.empty.title") }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          {{ t("dashboard.empty.description") }}
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/supermarkets"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-600 hover:from-primary-600 hover:to-secondary-700 text-white rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/25"
          >
            <Icon name="ph:storefront" size="20" />
            {{ t("supermarkets.title") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
