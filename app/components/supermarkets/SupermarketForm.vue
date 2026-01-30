<script setup lang="ts">
import type { Supermarket, CreateSupermarketDTO } from "~/types/supermarket";

const { t } = useI18n();

// Props
const props = withDefaults(
  defineProps<{
    /** Existing supermarket data for editing (optional) */
    supermarket?: Supermarket;
    /** Whether the form is in a loading/submitting state */
    isSubmitting?: boolean;
  }>(),
  {
    supermarket: undefined,
    isSubmitting: false,
  },
);

// Emits
const emit = defineEmits<{
  submit: [data: CreateSupermarketDTO];
  cancel: [];
}>();

// Form state
const name = ref(props.supermarket?.name ?? "");
const location = ref(props.supermarket?.location ?? "");
const logoUrl = ref(props.supermarket?.logo_url ?? "");

// Validation state
const errors = reactive({
  name: "",
});

// Track if form has been touched
const touched = reactive({
  name: false,
});

// Validate name
const validateName = (value: string): boolean => {
  if (!value.trim()) {
    errors.name = t("supermarkets.validation.nameRequired");
    return false;
  }
  if (value.trim().length < 2) {
    errors.name = t("supermarkets.validation.nameMinLength");
    return false;
  }
  errors.name = "";
  return true;
};

// Computed: Check if form is valid
const isFormValid = computed(() => {
  return name.value.trim().length >= 2;
});

// Handle form submission
const handleSubmit = () => {
  touched.name = true;

  const isNameValid = validateName(name.value);

  if (!isNameValid) {
    return;
  }

  const formData: CreateSupermarketDTO = {
    name: name.value.trim(),
    location: location.value.trim() || undefined,
    logo_url: logoUrl.value.trim() || undefined,
  };

  emit("submit", formData);
};

// Handle cancel
const handleCancel = () => {
  emit("cancel");
};

// Watch for prop changes (when editing)
watch(
  () => props.supermarket,
  (newVal) => {
    if (newVal) {
      name.value = newVal.name;
      location.value = newVal.location ?? "";
      logoUrl.value = newVal.logo_url ?? "";
    }
  },
  { immediate: true },
);
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Name Field -->
    <BaseInput
      id="supermarket-name"
      v-model="name"
      :label="t('supermarkets.form.name')"
      :placeholder="t('supermarkets.form.namePlaceholder')"
      icon="ph:storefront"
      required
      :error="errors.name && touched.name ? errors.name : undefined"
      @blur="
        touched.name = true;
        validateName(name);
      "
    />

    <!-- Location Field -->
    <BaseInput
      id="supermarket-location"
      v-model="location"
      :label="t('supermarkets.form.location')"
      :placeholder="t('supermarkets.form.locationPlaceholder')"
      icon="ph:map-pin"
    />

    <!-- Logo Upload Field (Placeholder - Cloudinary integration pending) -->
    <div>
      <label
        for="supermarket-logo"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ t("supermarkets.form.logo") }}
      </label>
      <div
        class="flex items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
      >
        <!-- Logo Preview -->
        <div
          class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-700"
        >
          <NuxtImg
            v-if="logoUrl"
            :src="logoUrl"
            alt="Supermarket logo"
            class="h-12 w-12 rounded object-cover"
          />
          <Icon
            v-else
            name="ph:image"
            size="32"
            class="text-gray-400 dark:text-gray-500"
          />
        </div>

        <!-- Upload Area -->
        <div class="flex-1">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t("supermarkets.form.logoHint") }}
          </p>
          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
            PNG, JPG up to 2MB
          </p>
          <!-- TODO: Implement Cloudinary upload in Task 0.6 -->
          <input
            id="supermarket-logo"
            v-model="logoUrl"
            type="url"
            placeholder="https://example.com/logo.png"
            class="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <BaseButton
        type="button"
        variant="secondary"
        :disabled="props.isSubmitting"
        @click="handleCancel"
      >
        {{ t("common.cancel") }}
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        :loading="props.isSubmitting"
        :disabled="!isFormValid"
      >
        <template v-if="props.supermarket">
          {{
            props.isSubmitting
              ? t("common.loading")
              : t("supermarkets.edit.submit")
          }}
        </template>
        <template v-else>
          {{
            props.isSubmitting
              ? t("common.loading")
              : t("supermarkets.create.submit")
          }}
        </template>
      </BaseButton>
    </div>
  </form>
</template>
