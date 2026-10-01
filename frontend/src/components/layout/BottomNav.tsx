import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/trips', icon: Compass, label: 'Trips' },
    { to: '/trips/create', icon: PlusCircle, label: 'Create', isAction: true },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-border dark:border-border-dark pb-safe">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              item.isAction ? "-mt-6" : "",
              isActive 
                ? (item.isAction ? "" : "text-primary") 
                : "text-text-muted dark:text-text-muted-dark hover:text-text dark:hover:text-text-dark"
            )}
          >
            {({ isActive }) => (
              <>
                {item.isAction ? (
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95",
                    isActive ? "bg-primary-dark" : "bg-primary"
                  )}>
                    <item.icon className="w-6 h-6" />
                  </div>
                ) : (
                  <>
                    <item.icon className={cn("w-6 h-6", isActive ? "fill-primary/20" : "")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
