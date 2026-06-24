import { Pressable, Text, type PressableProps } from 'react-native';

import { elevation } from '@/lib/theme/elevation';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'default' | 'sm';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
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

export function Button({ label, variant = 'primary', size = 'default', className, disabled, style, ...props }: ButtonProps) {
  // Filled actions get a tinted lift; outline/ghost stay flat.
  const lifted = (variant === 'primary' || variant === 'destructive') && !disabled;

  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-2xl active:opacity-90',
        sizeVariants[size],
        containerVariants[variant],
        disabled && 'opacity-50',
        className,
      )}
      style={[lifted ? elevation.raised : undefined, style as object]}
      disabled={disabled}
      {...props}
    >
      <Text className={cn('text-center font-semibold tracking-tight', textSizeVariants[size], textVariants[variant])}>{label}</Text>
    </Pressable>
  );
}
