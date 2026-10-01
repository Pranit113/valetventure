import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Compass } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTrips } from '../../hooks/useTrips';
import { getGreeting } from '../../lib/utils';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import TripCard from '../../components/trips/TripCard'; // Assuming we'll create this soon

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trips, isLoading, fetchTrips } = useTrips();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary px-4 pt-12 pb-6 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Compass className="w-48 h-48" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-white/80 text-sm font-medium mb-1">
            {getGreeting()},
          </h1>
          <h2 className="text-white text-2xl font-display font-semibold mb-6">
            {user?.displayName || user?.username} 👋
          </h2>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-text-muted" />
            </div>
            <input
              type="text"
              className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm shadow-sm focus:outline-none text-text"
              placeholder="Where do you want to go?"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl">Your Trips</h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="Your journey starts here"
            description="Create your first itinerary and turn your travel idea into a plan."
            actionLabel="+ Create Your First Trip"
            onAction={() => navigate('/trips/create')}
          />
        )}
      </div>
    </div>
  );
}
