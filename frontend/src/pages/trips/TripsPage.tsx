import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Compass } from 'lucide-react';
import { TopBar } from '../../components/layout/TopBar';
import { useTrips } from '../../hooks/useTrips';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import TripCard from '../../components/trips/TripCard';

export default function TripsPage() {
  const navigate = useNavigate();
  const { trips, isLoading, fetchTrips } = useTrips();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
      <TopBar title="All Trips" />
      
      <div className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-4 pb-12">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No trips yet"
            description="You haven't planned any trips. Create one to get started."
            actionLabel="+ Create Trip"
            onAction={() => navigate('/trips/create')}
          />
        )}
      </div>
    </div>
  );
}
