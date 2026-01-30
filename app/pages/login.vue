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
    <BaseAlert v-if="errorMessage" variant="error" class="mb-4">
      {{ errorMessage }}
    </BaseAlert>

    <!-- Login Form -->
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Email Field -->
      <BaseInput
        id="email"
        v-model="email"
        type="email"
        :label="t('auth.fields.email')"
        :placeholder="t('auth.placeholders.email')"
        icon="ph:envelope"
        autocomplete="email"
        :error="errors.email"
        @blur="validateEmail(email)"
      />

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
        <BasePasswordInput
          id="password"
          v-model="password"
          :placeholder="t('auth.placeholders.password')"
          autocomplete="current-password"
          :error="errors.password"
          @blur="validatePassword(password)"
        />
      </div>

      <!-- Submit Button -->
      <BaseButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        full-width
      >
        {{ isLoading ? t("common.loading") : t("auth.login.submit") }}
      </BaseButton>
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
