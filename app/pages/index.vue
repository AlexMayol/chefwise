<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

// SEO setup
useHead({
  title: t("landing.meta.title"),
  meta: [
    { name: "description", content: t("landing.meta.description") },
    { property: "og:title", content: t("landing.meta.title") },
    { property: "og:description", content: t("landing.meta.description") },
    { property: "og:type", content: "website" },
  ],
});

useSeoMeta({
  title: t("landing.meta.title"),
  description: t("landing.meta.description"),
  ogTitle: t("landing.meta.title"),
  ogDescription: t("landing.meta.description"),
});

definePageMeta({
  layout: "landing",
  middleware: [],
});

// Scroll animations
const heroRef = ref<HTMLElement | null>(null);
const featuresRef = ref<HTMLElement | null>(null);
const howItWorksRef = ref<HTMLElement | null>(null);
const benefitsRef = ref<HTMLElement | null>(null);

const isVisible = (el: HTMLElement | null) => {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
};

const animatedSections = reactive({
  hero: false,
  features: false,
  howItWorks: false,
  benefits: false,
});

const handleScroll = () => {
  animatedSections.hero = isVisible(heroRef.value);
  animatedSections.features = isVisible(featuresRef.value);
  animatedSections.howItWorks = isVisible(howItWorksRef.value);
  animatedSections.benefits = isVisible(benefitsRef.value);
};

onMounted(() => {
  animatedSections.hero = true;
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      ref="heroRef"
      class="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      <!-- Gradient Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950"
      />
      
      <!-- Animated Blob Shapes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-duration: 4s"
        />
        <div
          class="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style="animation-duration: 6s; animation-delay: 1s"
        />
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div
            :class="[
              'transition-all duration-1000',
              animatedSections.hero
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            <h1
              class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {{ $t("landing.hero.title") }}
              <span
                class="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
              >
                {{ $t("landing.hero.highlight") }}
              </span>
            </h1>
            <p
              class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
              {{ $t("landing.hero.subtitle") }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink
                :to="localePath('/register')"
                class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-center"
              >
                {{ $t("landing.hero.cta") }}
              </NuxtLink>
              <a
                href="#features"
                class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 text-center"
              >
                {{ $t("landing.hero.learnMore") }}
              </a>
            </div>
          </div>

          <!-- Hero Image/Illustration -->
          <div
            :class="[
              'transition-all duration-1000 delay-300',
              animatedSections.hero
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10',
            ]"
          >
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-3xl blur-2xl"
              />
              <div
                class="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
              >
                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
                  >
                    <Icon
                      name="mdi:food-apple"
                      class="text-5xl text-emerald-600 dark:text-emerald-400 mb-3"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature1") }}
                    </p>
                  </div>
                  <div
                    class="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
                  >
                    <Icon
                      name="mdi:chart-line"
                      class="text-5xl text-teal-600 dark:text-teal-400 mb-3"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature2") }}
                    </p>
                  </div>
                  <div
                    class="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
                  >
                    <Icon
                      name="mdi:shopping"
                      class="text-5xl text-cyan-600 dark:text-cyan-400 mb-3"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature3") }}
                    </p>
                  </div>
                  <div
                    class="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
                  >
                    <Icon
                      name="mdi:share-variant"
                      class="text-5xl text-blue-600 dark:text-blue-400 mb-3"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature4") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
      id="features"
      ref="featuresRef"
      class="py-20 lg:py-32 bg-white dark:bg-gray-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            :class="[
              'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-1000',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.features.title") }}
          </h2>
          <p
            :class="[
              'text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.features.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950 rounded-2xl border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:cart" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature1.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature1.description") }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-teal-950 rounded-2xl border border-teal-100 dark:border-teal-900 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 100ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:chef-hat" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature2.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature2.description") }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-cyan-950 rounded-2xl border border-cyan-100 dark:border-cyan-900 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:calculator" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature3.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature3.description") }}
            </p>
          </div>

          <!-- Feature 4 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950 rounded-2xl border border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 300ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:compare" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature4.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature4.description") }}
            </p>
          </div>

          <!-- Feature 5 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 rounded-2xl border border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 400ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:history" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature5.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature5.description") }}
            </p>
          </div>

          <!-- Feature 6 -->
          <div
            :class="[
              'group p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950 rounded-2xl border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-2',
              animatedSections.features
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 500ms"
          >
            <div
              class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon name="mdi:share-variant" class="text-3xl text-white" />
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {{ $t("landing.features.feature6.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature6.description") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section
      id="how-it-works"
      ref="howItWorksRef"
      class="py-20 lg:py-32 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            :class="[
              'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-1000',
              animatedSections.howItWorks
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.howItWorks.title") }}
          </h2>
          <p
            :class="[
              'text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200',
              animatedSections.howItWorks
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.howItWorks.subtitle") }}
          </p>
        </div>

        <div class="max-w-4xl mx-auto space-y-12">
          <!-- Step 1 -->
          <div
            :class="[
              'flex flex-col md:flex-row items-center gap-8 transition-all duration-1000',
              animatedSections.howItWorks
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">1</span>
            </div>
            <div
              class="flex-1 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {{ $t("landing.howItWorks.step1.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.howItWorks.step1.description") }}
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div
            :class="[
              'flex flex-col md:flex-row items-center gap-8 transition-all duration-1000',
              animatedSections.howItWorks
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">2</span>
            </div>
            <div
              class="flex-1 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {{ $t("landing.howItWorks.step2.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.howItWorks.step2.description") }}
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div
            :class="[
              'flex flex-col md:flex-row items-center gap-8 transition-all duration-1000',
              animatedSections.howItWorks
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10',
            ]"
            style="transition-delay: 400ms"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">3</span>
            </div>
            <div
              class="flex-1 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {{ $t("landing.howItWorks.step3.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.howItWorks.step3.description") }}
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div
            :class="[
              'flex flex-col md:flex-row items-center gap-8 transition-all duration-1000',
              animatedSections.howItWorks
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10',
            ]"
            style="transition-delay: 600ms"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">4</span>
            </div>
            <div
              class="flex-1 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <h3
                class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {{ $t("landing.howItWorks.step4.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.howItWorks.step4.description") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section
      id="benefits"
      ref="benefitsRef"
      class="py-20 lg:py-32 bg-white dark:bg-gray-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2
            :class="[
              'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-1000',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.benefits.title") }}
          </h2>
          <p
            :class="[
              'text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
          >
            {{ $t("landing.benefits.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <!-- Benefit 1 -->
          <div
            :class="[
              'group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-500',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="mdi:currency-usd"
                class="text-2xl text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2"
              >
                {{ $t("landing.benefits.benefit1.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.benefits.benefit1.description") }}
              </p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div
            :class="[
              'group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all duration-500',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 100ms"
          >
            <div
              class="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="mdi:clock-time-four"
                class="text-2xl text-teal-600 dark:text-teal-400"
              />
            </div>
            <div>
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2"
              >
                {{ $t("landing.benefits.benefit2.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.benefits.benefit2.description") }}
              </p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div
            :class="[
              'group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all duration-500',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="mdi:lightbulb-on"
                class="text-2xl text-cyan-600 dark:text-cyan-400"
              />
            </div>
            <div>
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2"
              >
                {{ $t("landing.benefits.benefit3.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.benefits.benefit3.description") }}
              </p>
            </div>
          </div>

          <!-- Benefit 4 -->
          <div
            :class="[
              'group flex items-start gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-500',
              animatedSections.benefits
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10',
            ]"
            style="transition-delay: 300ms"
          >
            <div
              class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
            >
              <Icon
                name="mdi:chart-areaspline"
                class="text-2xl text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h3
                class="text-lg font-bold text-gray-900 dark:text-white mb-2"
              >
                {{ $t("landing.benefits.benefit4.title") }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t("landing.benefits.benefit4.description") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-20 lg:py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 relative overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style="animation-duration: 8s"
        />
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style="animation-duration: 10s; animation-delay: 2s"
        />
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-4xl mx-auto text-center">
          <h2
            class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {{ $t("landing.cta.title") }}
          </h2>
          <p class="text-lg sm:text-xl text-white/90 mb-8">
            {{ $t("landing.cta.subtitle") }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              :to="localePath('/register')"
              class="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl text-center"
            >
              {{ $t("landing.cta.button") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
