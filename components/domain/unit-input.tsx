import type { Unit } from '@/lib/domain/units';
import { useUnitOptions } from '@/lib/hooks/use-translated-options';

import { Select } from '../ui/select';

type UnitInputProps = {
  value?: Unit;
  onChange(value: Unit): void;
};

export function UnitInput({ value, onChange }: UnitInputProps) {
  const options = useUnitOptions();
  return <Select value={value} options={options} onChange={onChange} />;
}
