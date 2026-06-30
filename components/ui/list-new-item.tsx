import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';

import { Button } from '@/components/ui/button';

type ListNewItemProps = {
  href: Href;
  label: string;
};

export function ListNewItem({ href, label }: ListNewItemProps) {
  return (
    <Link href={href} asChild>
      <Button className="w-full" label={label} icon={<Plus size={18} />} />
    </Link>
  );
}
