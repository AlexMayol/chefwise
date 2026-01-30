<script setup lang="ts">
const { t } = useI18n();

// Page meta
useHead({
  title: t("auth.register.title"),
});

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

// Form state
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

// Validation state
const errors = reactive({
  email: "",
  password: "",
  confirmPassword: "",
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

// Validate password strength
const validatePassword = (value: string): boolean => {
  if (!value) {
    errors.password = t("auth.validation.passwordRequired");
    return false;
  }
  if (value.length < 8) {
    errors.password = t("auth.validation.passwordMinLength8");
    return false;
  }
  // Check for at least one uppercase, one lowercase, and one number
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    errors.password = t("auth.validation.passwordStrength");
    return false;
  }
  errors.password = "";
  return true;
};

// Validate confirm password
const validateConfirmPassword = (value: string): boolean => {
  if (!value) {
    errors.confirmPassword = t("auth.validation.confirmPasswordRequired");
    return false;
  }
  if (value !== password.value) {
    errors.confirmPassword = t("auth.validation.passwordsMismatch");
    return false;
  }
  errors.confirmPassword = "";
  return true;
};

// Password strength indicator
const passwordStrength = computed(() => {
  const value = password.value;
  if (!value) return { score: 0, label: "", color: "" };

  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 2)
    return { score: 1, label: t("auth.password.weak"), color: "bg-red-500" };
  if (score <= 4)
    return {
      score: 2,
      label: t("auth.password.medium"),
      color: "bg-yellow-500",
    };
  return {
    score: 3,
    label: t("auth.password.strong"),
    color: "bg-emerald-500",
  };
});

// Handle form submission
const handleSubmit = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate all fields
  const isEmailValid = validateEmail(email.value);
  const isPasswordValid = validatePassword(password.value);
  const isConfirmPasswordValid = validateConfirmPassword(confirmPassword.value);

  if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }

  isLoading.value = true;

  try {
    // TODO: Implement actual registration logic with Supabase in Task 1.3
    const client = useSupabaseClient();
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
    } else {
      // Redirect to login or show success message
      navigateTo("/login?registered=true");
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
        {{ t("auth.register.heading") }}
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t("auth.register.subheading") }}
      </p>
    </div>

    <!-- Error Alert -->
    <BaseAlert v-if="errorMessage" variant="error" class="mb-4">
      {{ errorMessage }}
    </BaseAlert>

    <!-- Register Form -->
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
        <BasePasswordInput
          id="password"
          v-model="password"
          :label="t('auth.fields.password')"
          :placeholder="t('auth.placeholders.password')"
          autocomplete="new-password"
          :error="errors.password"
          @blur="validatePassword(password)"
          @input="validatePassword(password)"
        />
        <!-- Password Strength Indicator -->
        <div v-if="password" class="mt-2">
          <div class="flex items-center gap-2">
            <div
              class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600"
            >
              <div
                class="h-full transition-all duration-300"
                :class="passwordStrength.color"
                :style="{ width: `${(passwordStrength.score / 3) * 100}%` }"
              />
            </div>
            <span
              class="text-xs font-medium"
              :class="{
                'text-red-500': passwordStrength.score === 1,
                'text-yellow-500': passwordStrength.score === 2,
                'text-emerald-500': passwordStrength.score === 3,
              }"
            >
              {{ passwordStrength.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <BasePasswordInput
        id="confirmPassword"
        v-model="confirmPassword"
        :label="t('auth.fields.confirmPassword')"
        :placeholder="t('auth.placeholders.confirmPassword')"
        autocomplete="new-password"
        :error="errors.confirmPassword"
        @blur="validateConfirmPassword(confirmPassword)"
      />

      <!-- Submit Button -->
      <BaseButton
        type="submit"
        variant="primary"
        :loading="isLoading"
        full-width
      >
        {{ isLoading ? t("common.loading") : t("auth.register.submit") }}
      </BaseButton>
    </form>

    <!-- Login Link -->
    <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      {{ t("auth.register.hasAccount") }}
      <NuxtLink
        to="/login"
        class="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
      >
        {{ t("auth.register.signIn") }}
      </NuxtLink>
    </p>
  </div>
</template>
