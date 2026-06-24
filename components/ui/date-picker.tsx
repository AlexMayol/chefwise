import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { formatDate } from '@/lib/formatting/date';
import { useTranslation } from '@/lib/i18n';
import type { SupportedLocale } from '@/lib/i18n';
import { getDesignTokens } from '@/lib/theme/tokens';

type DatePickerProps = {
  value: string; // ISO string
  onChange(iso: string): void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const tokens = getDesignTokens(colorScheme);
  const [show, setShow] = useState(false);
  const date = new Date(value);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShow(false);
    if (selected) {
      onChange(selected.toISOString());
    }
  };

  const open = () => {
    // ponytail: Android picker is imperative; iOS/web render the component inline
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: date, mode: 'date', onChange: handleChange });
    } else {
      setShow(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={open}
        style={{
          borderWidth: 1,
          borderColor: tokens.input,
          backgroundColor: tokens.background,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: tokens.foreground, fontSize: 16 }}>
          {formatDate(date, i18n.language as SupportedLocale)}
        </Text>
      </Pressable>
      {show ? <DateTimePicker value={date} mode="date" onChange={handleChange} /> : null}
    </>
  );
}
