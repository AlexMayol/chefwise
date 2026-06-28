import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { TextInputProps } from 'react-native';

import { useTranslation } from '@/lib/i18n';

import { FormField } from './form-field';
import { Input } from './input';

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  multiline?: boolean;
  affix?: string;
  // Applied to the FormField wrapper, e.g. "flex-1" for side-by-side fields.
  className?: string;
};

// Controller + FormField + Input + error-key translation in one. The value is
// normalized to a string so it serves text, nullable-string, and numeric fields
// alike (numeric schemas coerce the string back on submit).
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  multiline,
  affix,
  className,
}: ControlledInputProps<T>) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField className={className} label={label} error={fieldState.error?.message ? t(fieldState.error.message) : undefined}>
          <Input
            accessibilityLabel={label}
            value={field.value == null ? '' : String(field.value)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            multiline={multiline}
            affix={affix}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        </FormField>
      )}
    />
  );
}
