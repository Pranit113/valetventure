import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export default function AppLayout() {
  const location = useLocation();
  // Don't show bottom nav on create trip wizard as it's a focused task
  const showBottomNav = !location.pathname.startsWith('/trips/create');

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark w-full max-w-md mx-auto shadow-2xl overflow-x-hidden relative">
      <main className={`flex flex-col min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
