<script setup lang="ts">
const { t } = useI18n();
</script>
<template>
  <div>
    <nav
      class="border-b-4 border-gradient-to-r from-primary-500 to-secondary-600 bg-white dark:bg-gray-900 p-3 py-3 flex justify-between shadow-sm"
      :class="t('locale.dir') === 'rtl' ? 'flex-row-reverse' : 'flex-row'"
    >
      <ul class="flex justify-center items-center align-middle gap-2">
        <li>
          <NuxtLink
            class="rounded-lg px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-all duration-200"
            to="/dashboard"
            >{{ t("pages.index.link") }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            class="rounded-lg px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-secondary-50 hover:text-secondary-600 dark:hover:bg-gray-800 dark:hover:text-secondary-400 transition-all duration-200"
            to="/supermarkets"
            >{{ t("supermarkets.title") }}</NuxtLink
          >
        </li>
      </ul>
      <div class="flex justify-end">
        <div class="flex w-full items-center justify-center gap-2">
          <ThemeSwitcher
            class="rounded-lg hover:bg-gray-100 p-2.5 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
          />
          <LanguageSelector />
        </div>
      </div>
    </nav>
    <header class="mx-auto w-full max-w-4xl pt-10 pb-6">
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="mdi:chef-hat" size="36" class="text-white" />
        </div>
        <div>
          <div class="flex flex-col gap-2 text-center">
            <div
              class="items-center text-base font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent"
            >
              {{ $t("pages.index.hero.subtitle") }}
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ $t("pages.index.hero.title") }}
            </div>
            <div class="text-base text-gray-600 dark:text-gray-400">
              {{ $t("pages.index.hero.description") }}
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="flex min-h-64 w-full justify-center">
      <div class="container max-w-4xl">
        <slot />
      </div>
    </main>
    <footer
      class="py-20 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-12"
    >
      <p>© {{ new Date().getFullYear() }} - {{ $t("site.name") }}</p>
    </footer>
  </div>
</template>
<style lang="postcss">
ul .router-link-exact-active {
  @apply bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-md;
}
</style>
