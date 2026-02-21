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
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t("dashboard.heading") }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("dashboard.welcome", { email: user?.email }) }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
          @click="handleSignOut"
        >
          <Icon name="ph:sign-out" size="18" />
          {{ t("auth.signOut") }}
        </button>
      </div>

      <!-- Dashboard Content Placeholder -->
      <div
        class="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800"
      >
        <Icon
          name="ph:chart-line"
          size="48"
          class="mx-auto text-gray-400 dark:text-gray-500"
        />
        <h2 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          {{ t("dashboard.empty.title") }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ t("dashboard.empty.description") }}
        </p>
      </div>
    </div>
  </div>
</template>
