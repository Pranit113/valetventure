import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center h-full min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-surface-2 dark:bg-surface-2-dark flex items-center justify-center mb-6 text-primary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-text-muted dark:text-text-muted-dark mb-8 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="px-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
