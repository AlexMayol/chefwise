import { type ReactNode, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BottomSheet } from './bottom-sheet';
import { Button } from './button';
import type { SelectOption } from './select';
import { SelectInput } from './select-input';

type CreatableSelectProps<T extends string> = {
  value?: T;
  options: SelectOption<T>[];
  onChange(value: T): void;
  /** Label for the button that opens the create drawer, e.g. "New market". */
  addLabel: string;
  /** Shown in place of the options when none exist yet. */
  emptyLabel?: string;
  /**
   * Renders the create form inside the drawer. Call `onCreated(id)` after creating
   * the entity to select it and close the drawer.
   */
  renderCreateForm(onCreated: (value: T) => void): ReactNode;
};

// Select + inline "create on the fly" drawer. Generic over the entity: pass any
// domain form via renderCreateForm and it just needs to call onCreated(newId).
export function CreatableSelect<T extends string>({
  value,
  options,
  onChange,
  addLabel,
  emptyLabel,
  renderCreateForm,
}: CreatableSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const handleCreated = (created: T) => {
    onChange(created);
    setOpen(false);
  };

  return (
    <View className="flex-row items-center gap-2">
      <View className="flex-1">
        <SelectInput value={value} options={options} onChange={onChange} placeholder={emptyLabel} />
      </View>
      <Button variant="ghost" label="+" accessibilityLabel={addLabel} className="px-4" onPress={() => setOpen(true)} />
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <ScrollView style={{ maxHeight: 480 }} keyboardShouldPersistTaps="handled">
          {renderCreateForm(handleCreated)}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
