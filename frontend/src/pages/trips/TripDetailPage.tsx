import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/layout/TopBar';
import { useTrip } from '../../hooks/useTrips';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { formatDate } from '../../lib/utils';
import { MapPin, Users, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import DaySwiper from '../../components/trips/DaySwiper';
import { Button } from '../../components/ui/Button';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trip, days, isLoading, fetchTrip } = useTrip(id || '');
  const [activeTab, setActiveTab] = useState<'days' | 'hotels' | 'restaurants' | 'expenses'>('days');

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id, fetchTrip]);

  if (isLoading || !trip) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    if (activeTab === 'days') {
      return (
        <div className="flex-1 flex flex-col py-6">
          <div className="flex justify-between items-center px-4 mb-4">
            <h3 className="font-semibold text-lg">Itinerary</h3>
            <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
              <Plus className="w-4 h-4 mr-1" /> Add Day
            </Button>
          </div>
          <DaySwiper days={days} tripCurrency={trip.currency} />
        </div>
      );
    }

    // Placeholder for other tabs
    return (
      <div className="p-8 text-center text-text-muted">
        <div className="w-16 h-16 mx-auto bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <p>Coming soon!</p>
        <Button variant="outline" className="mt-4">
          + Add {activeTab === 'hotels' ? 'Hotel' : activeTab === 'restaurants' ? 'Restaurant' : 'Expense'}
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
      <TopBar 
        showBack 
        rightElement={
          <div className="flex gap-1">
            <button className="p-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-2-dark">
              <Edit2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-2-dark text-error">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        }
      />
      
      <div className="px-4 py-6 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        <h1 className="text-3xl font-display font-semibold mb-3">{trip.name}</h1>
        
        <div className="flex flex-col gap-2 text-sm text-text-muted dark:text-text-muted-dark">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{trip.destination}</span>
            <span className="mx-2">•</span>
            <Users className="w-4 h-4 mr-2" />
            <span>{trip.travelers} Travelers</span>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark hide-scrollbar">
        {[
          { id: 'days', label: 'Itinerary' },
          { id: 'hotels', label: 'Hotels' },
          { id: 'restaurants', label: 'Restaurants' },
          { id: 'expenses', label: 'Expenses' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
