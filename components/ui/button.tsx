import { Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type ButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
};

const variants = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  ghost: 'bg-transparent border border-border',
};

const textVariants = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  ghost: 'text-foreground',
};

export function Button({ label, variant = 'primary', className, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      className={cn('rounded-xl px-4 py-3 active:opacity-80', variants[variant], disabled && 'opacity-50', className)}
      disabled={disabled}
      {...props}
    >
      <Text className={cn('text-center text-base font-semibold', textVariants[variant])}>{label}</Text>
    </Pressable>
  );
}
