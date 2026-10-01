import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-2 dark:bg-surface-2-dark text-text dark:text-text-dark',
    primary: 'bg-primary text-white',
    secondary: 'bg-accent text-white',
    outline: 'border border-border dark:border-border-dark text-text dark:text-text-dark',
    success: 'bg-success/10 text-success border border-success/20',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
