<script setup lang="ts">
const { t } = useI18n();

// Page meta
useHead({
  title: t("auth.login.title"),
});

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

// Form state
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const errorMessage = ref("");

// Validation state
const errors = reactive({
  email: "",
  password: "",
});

// Validate email format
const validateEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    errors.email = t("auth.validation.emailRequired");
    return false;
  }
  if (!emailRegex.test(value)) {
    errors.email = t("auth.validation.emailInvalid");
    return false;
  }
  errors.email = "";
  return true;
};

// Validate password
const validatePassword = (value: string): boolean => {
  if (!value) {
    errors.password = t("auth.validation.passwordRequired");
    return false;
  }
  if (value.length < 6) {
    errors.password = t("auth.validation.passwordMinLength");
    return false;
  }
  errors.password = "";
  return true;
};

// Handle form submission
const handleSubmit = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate all fields
  const isEmailValid = validateEmail(email.value);
  const isPasswordValid = validatePassword(password.value);

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  isLoading.value = true;

  try {
    // TODO: Implement actual login logic with Supabase in Task 1.3
    const client = useSupabaseClient();
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
    } else {
      // Redirect to dashboard on success
      navigateTo("/dashboard");
    }
  } catch {
    errorMessage.value = t("auth.errors.generic");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Title -->
    <div class="mb-6 text-center">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ t("auth.login.heading") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("auth.login.subheading") }}
      </p>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
    >
      <Icon name="ph:warning-circle" size="18" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Login Form -->
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Email Field -->
      <div>
        <label
          for="email"
          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ t("auth.fields.email") }}
        </label>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              name="ph:envelope"
              size="18"
              class="text-gray-400 dark:text-gray-500"
            />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            :placeholder="t('auth.placeholders.email')"
            class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-emerald-500"
            :class="{
              'border-red-500 focus:border-red-500 focus:ring-red-500/20':
                errors.email,
            }"
            @blur="validateEmail(email)"
          />
        </div>
        <p v-if="errors.email" class="mt-1.5 text-xs text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div>
        <div class="mb-1.5 flex items-center justify-between">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {{ t("auth.fields.password") }}
          </label>
          <NuxtLink
            to="/forgot-password"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            {{ t("auth.login.forgotPassword") }}
          </NuxtLink>
        </div>
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              name="ph:lock"
              size="18"
              class="text-gray-400 dark:text-gray-500"
            />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :placeholder="t('auth.placeholders.password')"
            class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-emerald-500"
            :class="{
              'border-red-500 focus:border-red-500 focus:ring-red-500/20':
                errors.password,
            }"
            @blur="validatePassword(password)"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            @click="showPassword = !showPassword"
          >
            <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" size="18" />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1.5 text-xs text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-800"
      >
        <Icon
          v-if="isLoading"
          name="ph:spinner"
          size="20"
          class="animate-spin"
        />
        <span>{{
          isLoading ? t("common.loading") : t("auth.login.submit")
        }}</span>
      </button>
    </form>

    <!-- Register Link -->
    <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      {{ t("auth.login.noAccount") }}
      <NuxtLink
        to="/register"
        class="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
      >
        {{ t("auth.login.signUp") }}
      </NuxtLink>
    </p>
  </div>
</template>
