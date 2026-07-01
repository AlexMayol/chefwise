import type { Unit } from '@/lib/domain/units';
import { useUnitOptions } from '@/lib/hooks/use-translated-options';

import { SegmentedControl } from '../ui/segmented-control';

type UnitInputProps = {
  value?: Unit;
  onChange(value: Unit): void;
};

export function UnitInput({ value, onChange }: UnitInputProps) {
  const options = useUnitOptions();
  return <SegmentedControl value={value} options={options} onChange={onChange} />;
}
