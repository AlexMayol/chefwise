import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';

type ListingScreenHeaderProps = {
  title: string;
  newHref: Href;
  newLabel: string;
};

export function ListingScreenHeader({ title, newHref, newLabel }: ListingScreenHeaderProps) {
  const tokens = useDesignTokens();

  return (
    <View className="flex-row items-center gap-2">
      <Text className="flex-1 text-3xl font-bold tracking-tight text-foreground">{title}</Text>
      <Link href={newHref} asChild>
        <Button label={newLabel} size="sm" icon={<Plus size={16} color={tokens.primaryForeground} />} />
      </Link>
    </View>
  );
}
