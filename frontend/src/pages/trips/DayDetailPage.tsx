import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Plus, MapPin, Clock, Edit2, Trash2, GripVertical, Navigation } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { dayService } from '../../services/dayService';
import { tripService } from '../../services/tripService';
import { TripDay, Activity } from '../../types/api';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { formatDate } from '../../lib/utils';
import AddActivityForm from '../../components/forms/AddActivityForm';

export default function DayDetailPage() {
  const { id, dayId } = useParams<{ id: string, dayId: string }>();
  const navigate = useNavigate();
  const [day, setDay] = useState<TripDay | null>(null);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const { execute: fetchDay, isLoading } = useApi(() => dayService.getById(dayId!), {
    onSuccess: (data) => setDay(data),
  });

  // Since we don't have a real backend, we'll mock the day data if it fails
  useEffect(() => {
    if (dayId) {
      fetchDay().catch(() => {
        // Mock data fallback
        setDay({
          id: dayId,
          tripId: id!,
          date: new Date().toISOString(),
          dayIndex: 1,
          location: 'Kochi',
          estimatedCost: 2500,
          activities: [
            {
              id: '1',
              dayId: dayId,
              name: 'Start from Hotel',
              time: '08:00 AM',
              order: 1
            },
            {
              id: '2',
              dayId: dayId,
              name: 'Fort Kochi',
              time: '10:00 AM',
              locationName: 'Fort Kochi, Kerala',
              mapsUrl: 'https://maps.google.com',
              description: 'Explore the historic area.',
              durationMinutes: 120,
              cost: 0,
              order: 2
            }
          ]
        });
      });
    }
  }, [dayId]);

  if (isLoading && !day) {
    return <LoadingScreen />;
  }

  if (!day) return null;

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
      <TopBar title="Back to Trip" showBack />
      
      <div className="px-4 py-6 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <h2 className="text-primary font-display font-bold text-sm tracking-widest uppercase mb-1">Day {day.dayIndex}</h2>
        <h1 className="font-display text-3xl font-semibold mb-1">{day.location}</h1>
        <p className="text-text-muted dark:text-text-muted-dark">{formatDate(day.date, 'dd MMMM yyyy')}</p>
        
        <Button 
          onClick={() => setIsAddActivityOpen(true)}
          className="w-full mt-6"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Activity
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          {day.activities?.map((activity, index) => (
            <div key={activity.id} className="relative pl-10 pt-2 pb-6">
              {/* Timeline line */}
              {index !== day.activities.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-border dark:bg-border-dark" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-[7px] top-[14px] w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-bg dark:ring-bg-dark" />
              
              <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 border border-border dark:border-border-dark shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-sm font-semibold text-primary">
                    <Clock className="w-4 h-4 mr-1.5" /> {activity.time}
                  </div>
                  <div className="flex gap-2 text-text-muted">
                    <button className="p-1 hover:text-text"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-error"><Trash2 className="w-4 h-4" /></button>
                    <button className="p-1 cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-1">{activity.name}</h3>
                
                {activity.locationName && (
                  <div className="flex items-center text-sm text-text-muted dark:text-text-muted-dark mb-3">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    <span>{activity.locationName}</span>
                  </div>
                )}
                
                {activity.description && (
                  <p className="text-sm text-text-muted dark:text-text-muted-dark mb-3">
                    {activity.description}
                  </p>
                )}

                {(activity.durationMinutes || activity.cost !== undefined || activity.mapsUrl) && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border dark:border-border-dark">
                    {activity.durationMinutes && (
                      <span className="text-xs bg-surface-2 dark:bg-surface-2-dark px-2 py-1 rounded-md">
                        {Math.floor(activity.durationMinutes / 60)}h {activity.durationMinutes % 60}m
                      </span>
                    )}
                    {activity.cost !== undefined && (
                      <span className="text-xs bg-surface-2 dark:bg-surface-2-dark px-2 py-1 rounded-md">
                        Cost: {activity.cost}
                      </span>
                    )}
                    {activity.mapsUrl && (
                      <a href={activity.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md flex items-center hover:bg-primary/20 transition-colors">
                        <Navigation className="w-3 h-3 mr-1" /> Open Map
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet 
        isOpen={isAddActivityOpen} 
        onClose={() => setIsAddActivityOpen(false)}
        title="Add Activity"
      >
        <AddActivityForm 
          onSuccess={() => {
            setIsAddActivityOpen(false);
            // In a real app, refresh day data here
          }}
          onCancel={() => setIsAddActivityOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}
