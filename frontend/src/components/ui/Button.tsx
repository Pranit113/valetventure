import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark border border-transparent shadow-sm',
      secondary: 'bg-surface-2 dark:bg-surface-2-dark text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark border border-transparent',
      outline: 'bg-transparent text-text dark:text-text-dark border border-border dark:border-border-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark',
      ghost: 'bg-transparent text-text dark:text-text-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark border border-transparent',
      danger: 'bg-error text-white hover:bg-red-700 border border-transparent shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-11 px-4 text-sm font-medium',
      lg: 'h-14 px-6 text-base font-medium',
      icon: 'h-11 w-11 flex items-center justify-center p-0',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
