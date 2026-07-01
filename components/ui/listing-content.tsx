import { Link, type Href } from 'expo-router';
import { Plus } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ListNewItem } from '@/components/ui/list-new-item';
import { LoadingState } from '@/components/ui/loading-state';
import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { getListingCreateVisibility } from '@/lib/ui/listing-create-actions';

type ListingCreateEmptyActionProps = {
  href: Href;
  label: string;
};

export function ListingCreateEmptyAction({ href, label }: ListingCreateEmptyActionProps) {
  const tokens = useDesignTokens();

  return (
    <Link href={href} asChild>
      <Button label={label} icon={<Plus size={18} color={tokens.primaryForeground} />} />
    </Link>
  );
}

type ListingContentProps = {
  loading: boolean;
  sourceEmpty: boolean;
  itemCount: number;
  query: string;
  newHref: Href;
  newLabel: string;
  emptyTitle: string;
  children: ReactNode;
};

export function ListingContent({
  loading,
  sourceEmpty,
  itemCount,
  query,
  newHref,
  newLabel,
  emptyTitle,
  children,
}: ListingContentProps) {
  const { showListFooterNew, showFilteredEmptyNew } = getListingCreateVisibility(query, itemCount);

  if (loading && sourceEmpty) {
    return <LoadingState />;
  }

  if (itemCount === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        action={showFilteredEmptyNew ? <ListingCreateEmptyAction href={newHref} label={newLabel} /> : undefined}
      />
    );
  }

  return (
    <View className="gap-2">
      {children}
      {showListFooterNew ? <ListNewItem href={newHref} label={newLabel} /> : null}
    </View>
  );
}
