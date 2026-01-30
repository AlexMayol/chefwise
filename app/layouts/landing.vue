<script setup lang="ts">
const localePath = useLocalePath();

// Navigation scroll state
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Navigation -->
    <nav
      :class="[
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 shadow-lg backdrop-blur-lg dark:bg-gray-900/80'
          : 'bg-transparent',
      ]"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between lg:h-20">
          <!-- Logo -->
          <NuxtLink
            :to="localePath('/')"
            class="group flex items-center space-x-2"
          >
            <div
              class="flex h-10 w-10 transform items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:chef-hat" class="text-2xl text-white" />
            </div>
            <span
              class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400"
            >
              {{ $t("site.name") }}
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden items-center space-x-8 lg:flex">
            <a
              href="#features"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
            >
              {{ $t("landing.nav.features") }}
            </a>
            <a
              href="#how-it-works"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
            >
              {{ $t("landing.nav.howItWorks") }}
            </a>
            <a
              href="#benefits"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
            >
              {{ $t("landing.nav.benefits") }}
            </a>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center space-x-2 lg:space-x-4">
            <!-- Theme Switcher -->
            <ThemeSwitcher
              class="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            />

            <!-- Language Selector -->
            <LanguageSelector />

            <!-- Auth buttons (Desktop) -->
            <div class="hidden items-center space-x-2 lg:flex">
              <NuxtLink
                :to="localePath('/login')"
                class="px-4 py-2 text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
              >
                {{ $t("landing.nav.login") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/register')"
                class="transform rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl"
              >
                {{ $t("landing.nav.getStarted") }}
              </NuxtLink>
            </div>

            <!-- Mobile menu button -->
            <button
              class="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
              :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <Icon
                :name="mobileMenuOpen ? 'mdi:close' : 'mdi:menu'"
                class="text-2xl text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          v-show="mobileMenuOpen"
          class="border-t border-gray-200 py-4 lg:hidden dark:border-gray-800"
        >
          <div class="flex flex-col space-y-4">
            <a
              href="#features"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
              @click="mobileMenuOpen = false"
            >
              {{ $t("landing.nav.features") }}
            </a>
            <a
              href="#how-it-works"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
              @click="mobileMenuOpen = false"
            >
              {{ $t("landing.nav.howItWorks") }}
            </a>
            <a
              href="#benefits"
              class="text-gray-700 transition-colors duration-200 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
              @click="mobileMenuOpen = false"
            >
              {{ $t("landing.nav.benefits") }}
            </a>
            <div
              class="flex flex-col space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800"
            >
              <NuxtLink
                :to="localePath('/login')"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {{ $t("landing.nav.login") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/register')"
                class="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2 text-center font-semibold text-white transition-all duration-300 hover:from-emerald-600 hover:to-teal-700"
              >
                {{ $t("landing.nav.getStarted") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <!-- Brand -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600"
              >
                <Icon name="mdi:chef-hat" class="text-2xl text-white" />
              </div>
              <span
                class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400"
              >
                {{ $t("site.name") }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t("landing.footer.tagline") }}
            </p>
          </div>

          <!-- Product -->
          <div>
            <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">
              {{ $t("landing.footer.product") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#features"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.nav.features") }}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.nav.howItWorks") }}
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.nav.benefits") }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">
              {{ $t("landing.footer.company") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.footer.about") }}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.footer.contact") }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="mb-4 font-semibold text-gray-900 dark:text-white">
              {{ $t("landing.footer.legal") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.footer.privacy") }}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {{ $t("landing.footer.terms") }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400"
        >
          <p>
            © {{ new Date().getFullYear() }} {{ $t("site.name") }}.
            {{ $t("landing.footer.rights") }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
