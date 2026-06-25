import { Pressable, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type IconButtonProps = PressableProps & {
  size?: 'sm' | 'md';
  variant?: 'muted' | 'overlay';
  className?: string;
};

const sizeVariants = { sm: 'size-8', md: 'size-10' } as const;
const bgVariants = { muted: 'bg-muted', overlay: 'bg-background/80' } as const;

// Circular icon-only button. Pass an accessibilityLabel for icon-only actions.
export function IconButton({ size = 'md', variant = 'muted', className, children, ...props }: IconButtonProps) {
  return (
    <Pressable
      hitSlop={8}
      className={cn('items-center justify-center rounded-full active:opacity-70', sizeVariants[size], bgVariants[variant], className)}
      {...props}>
      {children}
    </Pressable>
  );
}
