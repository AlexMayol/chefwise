<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
  >
    <!-- Header -->
    <header class="flex items-center justify-between p-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <Icon name="ph:arrow-left" size="20" />
        <span class="text-sm font-medium">{{ t("common.backToHome") }}</span>
      </NuxtLink>
      <div class="flex items-center gap-2">
        <ThemeSwitcher
          class="rounded-lg p-2 text-gray-600 hover:bg-white/50 dark:text-white dark:hover:bg-slate-700/50"
        />
        <LanguageSelector />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Logo/Brand -->
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg"
          >
            <Icon name="ph:chef-hat" size="28" class="text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            ChefWise
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("auth.tagline") }}
          </p>
        </div>

        <!-- Auth Card -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
          <slot />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>© {{ new Date().getFullYear() }} ChefWise</p>
    </footer>
  </div>
</template>
