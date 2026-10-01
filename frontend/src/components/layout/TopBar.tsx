import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function TopBar({ title, showBack, rightElement }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex-1 flex items-center">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <div className="flex-2 text-center">
          {title && <h1 className="font-display font-semibold text-lg truncate px-2">{title}</h1>}
        </div>
        
        <div className="flex-1 flex justify-end items-center">
          {rightElement}
        </div>
      </div>
    </header>
  );
}
