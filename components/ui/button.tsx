import type { ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';

import { useDesignTokens } from '@/lib/hooks/use-design-tokens';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'default' | 'sm';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  // Optional leading adornment (e.g. a "+" icon) rendered before the label.
  icon?: ReactNode;
};

const containerVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-destructive',
  ghost: 'border border-border bg-transparent',
};

const textVariants: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive-foreground',
  ghost: 'text-foreground',
};

const sizeVariants: Record<ButtonSize, string> = {
  default: 'px-5 py-3.5',
  sm: 'px-3.5 py-2',
};

const textSizeVariants: Record<ButtonSize, string> = {
  default: 'text-base',
  sm: 'text-sm',
};

export function Button({ label, variant = 'primary', size = 'default', icon, className, disabled, style, ...props }: ButtonProps) {
  const tokens = useDesignTokens();
  const iconColor = {
    primary: tokens.primaryForeground,
    secondary: tokens.secondaryForeground,
    destructive: tokens.destructiveForeground,
    ghost: tokens.foreground,
  }[variant];
  const renderedIcon =
    icon && isValidElement(icon)
      ? cloneElement(icon as ReactElement<{ color?: string }>, { color: iconColor })
      : icon;

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-xl active:opacity-90',
        sizeVariants[size],
        containerVariants[variant],
        disabled && 'opacity-50',
        className,
      )}
      style={style}
      disabled={disabled}
      {...props}
    >
      {renderedIcon}
      <Text className={cn('text-center font-semibold tracking-tight', textSizeVariants[size], textVariants[variant])}>{label}</Text>
    </Pressable>
  );
}
