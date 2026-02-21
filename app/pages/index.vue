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
      class="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32"
    >
      <!-- Gradient Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950"
      />

      <!-- Animated Blob Shapes -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10"
          style="animation-duration: 4s"
        />
        <div
          class="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/10"
          style="animation-duration: 6s; animation-delay: 1s"
        />
      </div>

      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <!-- Hero Content -->
          <div
            :class="[
              'transition-all duration-1000',
              animatedSections.hero
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            <h1
              class="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
            >
              {{ $t("landing.hero.title") }}
              <span
                class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400"
              >
                {{ $t("landing.hero.highlight") }}
              </span>
            </h1>
            <p class="mb-8 text-lg text-gray-600 sm:text-xl dark:text-gray-300">
              {{ $t("landing.hero.subtitle") }}
            </p>
            <div class="flex flex-col gap-4 sm:flex-row">
              <NuxtLink
                :to="localePath('/register')"
                class="transform rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-2xl"
              >
                {{ $t("landing.hero.cta") }}
              </NuxtLink>
              <a
                href="#features"
                class="rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-center text-lg font-semibold text-gray-900 transition-all duration-300 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-emerald-500"
              >
                {{ $t("landing.hero.learnMore") }}
              </a>
            </div>
          </div>

          <!-- Hero Image/Illustration -->
          <div
            :class="[
              'transition-all delay-300 duration-1000',
              animatedSections.hero
                ? 'translate-x-0 opacity-100'
                : 'translate-x-10 opacity-0',
            ]"
          >
            <div class="relative">
              <div
                class="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-2xl dark:from-emerald-500/10 dark:to-teal-500/10"
              />
              <div
                class="relative rounded-3xl bg-white/50 p-8 shadow-2xl backdrop-blur-sm dark:bg-gray-900/50"
              >
                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="transform rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 p-6 transition-transform duration-300 hover:scale-105 dark:from-emerald-900 dark:to-teal-900"
                  >
                    <Icon
                      name="mdi:food-apple"
                      class="mb-3 text-5xl text-emerald-600 dark:text-emerald-400"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature1") }}
                    </p>
                  </div>
                  <div
                    class="transform rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-6 transition-transform duration-300 hover:scale-105 dark:from-teal-900 dark:to-cyan-900"
                  >
                    <Icon
                      name="mdi:chart-line"
                      class="mb-3 text-5xl text-teal-600 dark:text-teal-400"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature2") }}
                    </p>
                  </div>
                  <div
                    class="transform rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 p-6 transition-transform duration-300 hover:scale-105 dark:from-cyan-900 dark:to-blue-900"
                  >
                    <Icon
                      name="mdi:shopping"
                      class="mb-3 text-5xl text-cyan-600 dark:text-cyan-400"
                    />
                    <p
                      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {{ $t("landing.hero.feature3") }}
                    </p>
                  </div>
                  <div
                    class="transform rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-6 transition-transform duration-300 hover:scale-105 dark:from-blue-900 dark:to-indigo-900"
                  >
                    <Icon
                      name="mdi:share-variant"
                      class="mb-3 text-5xl text-blue-600 dark:text-blue-400"
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
      class="bg-white py-20 lg:py-32 dark:bg-gray-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2
            :class="[
              'mb-4 text-3xl font-bold text-gray-900 transition-all duration-1000 sm:text-4xl lg:text-5xl dark:text-white',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.features.title") }}
          </h2>
          <p
            :class="[
              'mx-auto max-w-2xl text-lg text-gray-600 transition-all delay-200 duration-1000 sm:text-xl dark:text-gray-400',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.features.subtitle") }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div
            :class="[
              'group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl dark:border-emerald-900 dark:from-gray-900 dark:to-emerald-950 dark:hover:border-emerald-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:cart" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("landing.features.feature1.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature1.description") }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            :class="[
              'group rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-teal-300 hover:shadow-xl dark:border-teal-900 dark:from-gray-900 dark:to-teal-950 dark:hover:border-teal-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 100ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:chef-hat" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("landing.features.feature2.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature2.description") }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            :class="[
              'group rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-xl dark:border-cyan-900 dark:from-gray-900 dark:to-cyan-950 dark:hover:border-cyan-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:calculator" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("landing.features.feature3.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature3.description") }}
            </p>
          </div>

          <!-- Feature 4 -->
          <div
            :class="[
              'group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl dark:border-blue-900 dark:from-gray-900 dark:to-blue-950 dark:hover:border-blue-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 300ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:compare" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("landing.features.feature4.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature4.description") }}
            </p>
          </div>

          <!-- Feature 5 -->
          <div
            :class="[
              'group rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-indigo-900 dark:from-gray-900 dark:to-indigo-950 dark:hover:border-indigo-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 400ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:history" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              {{ $t("landing.features.feature5.title") }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t("landing.features.feature5.description") }}
            </p>
          </div>

          <!-- Feature 6 -->
          <div
            :class="[
              'group rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl dark:border-purple-900 dark:from-gray-900 dark:to-purple-950 dark:hover:border-purple-700',
              animatedSections.features
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 500ms"
          >
            <div
              class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="mdi:share-variant" class="text-3xl text-white" />
            </div>
            <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
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
      class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 lg:py-32 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2
            :class="[
              'mb-4 text-3xl font-bold text-gray-900 transition-all duration-1000 sm:text-4xl lg:text-5xl dark:text-white',
              animatedSections.howItWorks
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.howItWorks.title") }}
          </h2>
          <p
            :class="[
              'mx-auto max-w-2xl text-lg text-gray-600 transition-all delay-200 duration-1000 sm:text-xl dark:text-gray-400',
              animatedSections.howItWorks
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.howItWorks.subtitle") }}
          </p>
        </div>

        <div class="mx-auto max-w-4xl space-y-12">
          <!-- Step 1 -->
          <div
            :class="[
              'flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row',
              animatedSections.howItWorks
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">1</span>
            </div>
            <div
              class="flex-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
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
              'flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row',
              animatedSections.howItWorks
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">2</span>
            </div>
            <div
              class="flex-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
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
              'flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row',
              animatedSections.howItWorks
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0',
            ]"
            style="transition-delay: 400ms"
          >
            <div
              class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">3</span>
            </div>
            <div
              class="flex-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
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
              'flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row',
              animatedSections.howItWorks
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0',
            ]"
            style="transition-delay: 600ms"
          >
            <div
              class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl"
            >
              <span class="text-3xl font-bold text-white">4</span>
            </div>
            <div
              class="flex-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
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
      class="bg-white py-20 lg:py-32 dark:bg-gray-950"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h2
            :class="[
              'mb-4 text-3xl font-bold text-gray-900 transition-all duration-1000 sm:text-4xl lg:text-5xl dark:text-white',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.benefits.title") }}
          </h2>
          <p
            :class="[
              'mx-auto max-w-2xl text-lg text-gray-600 transition-all delay-200 duration-1000 sm:text-xl dark:text-gray-400',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
          >
            {{ $t("landing.benefits.subtitle") }}
          </p>
        </div>

        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Benefit 1 -->
          <div
            :class="[
              'group flex items-start gap-4 rounded-2xl border border-gray-200 p-6 transition-all duration-500 hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 0ms"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-900"
            >
              <Icon
                name="mdi:currency-usd"
                class="text-2xl text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
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
              'group flex items-start gap-4 rounded-2xl border border-gray-200 p-6 transition-all duration-500 hover:border-teal-300 hover:bg-teal-50 dark:border-gray-800 dark:hover:border-teal-700 dark:hover:bg-teal-950/30',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 100ms"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 transition-transform duration-300 group-hover:scale-110 dark:bg-teal-900"
            >
              <Icon
                name="mdi:clock-time-four"
                class="text-2xl text-teal-600 dark:text-teal-400"
              />
            </div>
            <div>
              <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
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
              'group flex items-start gap-4 rounded-2xl border border-gray-200 p-6 transition-all duration-500 hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-800 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/30',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 200ms"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-100 transition-transform duration-300 group-hover:scale-110 dark:bg-cyan-900"
            >
              <Icon
                name="mdi:lightbulb-on"
                class="text-2xl text-cyan-600 dark:text-cyan-400"
              />
            </div>
            <div>
              <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
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
              'group flex items-start gap-4 rounded-2xl border border-gray-200 p-6 transition-all duration-500 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/30',
              animatedSections.benefits
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0',
            ]"
            style="transition-delay: 300ms"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-900"
            >
              <Icon
                name="mdi:chart-areaspline"
                class="text-2xl text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">
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
      class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-20 lg:py-32 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900"
    >
      <!-- Animated Background -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"
          style="animation-duration: 8s"
        />
        <div
          class="absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"
          style="animation-duration: 10s; animation-delay: 2s"
        />
      </div>

      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl text-center">
          <h2
            class="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            {{ $t("landing.cta.title") }}
          </h2>
          <p class="mb-8 text-lg text-white/90 sm:text-xl">
            {{ $t("landing.cta.subtitle") }}
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <NuxtLink
              :to="localePath('/register')"
              class="hover:shadow-3xl transform rounded-xl bg-white px-8 py-4 text-center text-lg font-semibold text-emerald-600 shadow-2xl transition-all duration-300 hover:scale-105"
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
  0%,
  100% {
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
