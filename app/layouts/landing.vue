<script setup lang="ts">
const { t } = useI18n();
const colorMode = useColorMode();
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
          : 'bg-transparent',
      ]"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          <!-- Logo -->
          <NuxtLink
            :to="localePath('/')"
            class="flex items-center space-x-2 group"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="mdi:chef-hat"
                class="text-white text-2xl"
              />
            </div>
            <span
              class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
            >
              {{ $t("site.name") }}
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.features") }}
            </a>
            <a
              href="#how-it-works"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.howItWorks") }}
            </a>
            <a
              href="#benefits"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.benefits") }}
            </a>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center space-x-2 lg:space-x-4">
            <!-- Theme Switcher -->
            <ThemeSwitcher class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" />
            
            <!-- Language Selector -->
            <LanguageSelector />

            <!-- Auth buttons (Desktop) -->
            <div class="hidden lg:flex items-center space-x-2">
              <NuxtLink
                :to="localePath('/login')"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
              >
                {{ $t("landing.nav.login") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/register')"
                class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {{ $t("landing.nav.getStarted") }}
              </NuxtLink>
            </div>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
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
          class="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800"
        >
          <div class="flex flex-col space-y-4">
            <a
              href="#features"
              @click="mobileMenuOpen = false"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.features") }}
            </a>
            <a
              href="#how-it-works"
              @click="mobileMenuOpen = false"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.howItWorks") }}
            </a>
            <a
              href="#benefits"
              @click="mobileMenuOpen = false"
              class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              {{ $t("landing.nav.benefits") }}
            </a>
            <div class="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
              <NuxtLink
                :to="localePath('/login')"
                class="w-full px-4 py-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                {{ $t("landing.nav.login") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/register')"
                class="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all duration-300 text-center"
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
    <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <div
                class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
              >
                <Icon name="mdi:chef-hat" class="text-white text-2xl" />
              </div>
              <span
                class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
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
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t("landing.footer.product") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#features"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.nav.features") }}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.nav.howItWorks") }}
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.nav.benefits") }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t("landing.footer.company") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.footer.about") }}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.footer.contact") }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
              {{ $t("landing.footer.legal") }}
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.footer.privacy") }}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {{ $t("landing.footer.terms") }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <p>© {{ new Date().getFullYear() }} {{ $t("site.name") }}. {{ $t("landing.footer.rights") }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>
