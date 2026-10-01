import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from '../../components/layout/TopBar';
import { Button } from '../../components/ui/Button';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Plus, MapPin, Clock, Edit2, Trash2, Navigation, ChevronUp, ChevronDown } from 'lucide-react';
import { dayService } from '../../services/dayService';
import { tripService } from '../../services/tripService';
import { TripDay, Activity } from '../../types/api';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import AddActivityForm from '../../components/forms/AddActivityForm';

export default function DayDetailPage() {
  const { id, dayId } = useParams<{ id: string; dayId: string }>();
  const [day, setDay] = useState<TripDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDay = useCallback(async () => {
    if (!id || !dayId) return;
    setIsLoading(true);
    try {
      // Load from trip (which includes all days with activities)
      const res = await tripService.getById(id);
      const trip = res.data as any;
      const foundDay = (trip.days || []).find((d: any) => d.id === dayId);
      if (foundDay) setDay(foundDay);
    } catch (err) {
      console.error('Failed to load day', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, dayId]);

  useEffect(() => {
    loadDay();
  }, [loadDay]);

  const handleActivityAdded = async () => {
    setIsAddActivityOpen(false);
    setEditingActivity(null);
    await loadDay();
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!window.confirm('Delete this activity?')) return;
    setDeletingId(activityId);
    try {
      await dayService.deleteActivity(activityId);
      await loadDay();
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (activityId: string, direction: 'up' | 'down') => {
    if (!day) return;
    const activities = [...(day.activities || [])].sort(
      (a, b) => (a.sortOrder ?? a.order ?? 0) - (b.sortOrder ?? b.order ?? 0)
    );
    const idx = activities.findIndex((a) => a.id === activityId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === activities.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const currentOrder = activities[idx].sortOrder ?? activities[idx].order ?? idx;
    const swapOrder = activities[swapIdx].sortOrder ?? activities[swapIdx].order ?? swapIdx;

    await Promise.all([
      dayService.reorderActivity(activities[idx].id, swapOrder),
      dayService.reorderActivity(activities[swapIdx].id, currentOrder),
    ]);
    await loadDay();
  };

  if (isLoading && !day) return <LoadingScreen />;
  if (!day) return null;

  const sortedActivities = [...(day.activities || [])].sort(
    (a, b) => (a.sortOrder ?? a.order ?? 0) - (b.sortOrder ?? b.order ?? 0)
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
      <TopBar title="Back to Trip" showBack />

      {/* Day Header */}
      <div className="px-4 py-6 bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
          Day {(day as any).dayNumber ?? (day as any).dayIndex ?? 1}
        </p>
        <h1 className="font-display text-3xl font-semibold mb-1">{day.location || 'Unnamed Location'}</h1>
        {day.date && (
          <p className="text-text-muted dark:text-text-muted-dark text-sm">
            {formatDate(day.date, 'dd MMMM yyyy')}
          </p>
        )}

        <Button onClick={() => { setEditingActivity(null); setIsAddActivityOpen(true); }} className="w-full mt-6">
          <Plus className="w-5 h-5 mr-2" /> Add Activity
        </Button>
      </div>

      {/* Activities Timeline */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : sortedActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface-2 dark:bg-surface-2-dark rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-text-muted dark:text-text-muted-dark" />
            </div>
            <p className="font-semibold text-lg mb-1">No activities yet</p>
            <p className="text-sm text-text-muted dark:text-text-muted-dark mb-6">
              Tap "Add Activity" to start planning your day
            </p>
            <Button onClick={() => setIsAddActivityOpen(true)} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Add Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity, index) => (
              <div key={activity.id} className="relative pl-10 pt-2 pb-2">
                {/* Timeline connector */}
                {index !== sortedActivities.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-border dark:bg-border-dark" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-[7px] top-[14px] w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-bg dark:ring-bg-dark" />

                <div className="bg-surface dark:bg-surface-dark rounded-xl p-4 border border-border dark:border-border-dark shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    {activity.time ? (
                      <div className="flex items-center text-sm font-semibold text-primary">
                        <Clock className="w-4 h-4 mr-1.5" /> {activity.time}
                      </div>
                    ) : <div />}
                    <div className="flex gap-1 text-text-muted">
                      <button
                        onClick={() => handleReorder(activity.id, 'up')}
                        className="p-1.5 hover:text-primary hover:bg-surface-2 dark:hover:bg-surface-2-dark rounded-lg transition-colors"
                        aria-label="Move up"
                        disabled={index === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(activity.id, 'down')}
                        className="p-1.5 hover:text-primary hover:bg-surface-2 dark:hover:bg-surface-2-dark rounded-lg transition-colors"
                        aria-label="Move down"
                        disabled={index === sortedActivities.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingActivity(activity); setIsAddActivityOpen(true); }}
                        className="p-1.5 hover:text-primary hover:bg-surface-2 dark:hover:bg-surface-2-dark rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        disabled={deletingId === activity.id}
                        className="p-1.5 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{activity.name}</h3>

                  {activity.locationName && (
                    <div className="flex items-center text-sm text-text-muted dark:text-text-muted-dark mb-2">
                      <MapPin className="w-4 h-4 mr-1 shrink-0" />
                      <span>{activity.locationName}</span>
                    </div>
                  )}

                  {activity.description && (
                    <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">
                      {activity.description}
                    </p>
                  )}

                  {(activity.durationMinutes || activity.estimatedCost !== undefined || activity.googleMapsUrl || activity.mapsUrl) && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border dark:border-border-dark">
                      {activity.durationMinutes && activity.durationMinutes > 0 && (
                        <span className="text-xs bg-surface-2 dark:bg-surface-2-dark px-2 py-1 rounded-md">
                          ⏱ {Math.floor(activity.durationMinutes / 60) > 0 ? `${Math.floor(activity.durationMinutes / 60)}h ` : ''}{activity.durationMinutes % 60 > 0 ? `${activity.durationMinutes % 60}m` : ''}
                        </span>
                      )}
                      {(activity.estimatedCost !== undefined && activity.estimatedCost > 0) && (
                        <span className="text-xs bg-surface-2 dark:bg-surface-2-dark px-2 py-1 rounded-md">
                          💰 {activity.estimatedCost}
                        </span>
                      )}
                      {(activity.googleMapsUrl || activity.mapsUrl) && (
                        <a
                          href={activity.googleMapsUrl || activity.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md flex items-center hover:bg-primary/20 transition-colors"
                        >
                          <Navigation className="w-3 h-3 mr-1" /> Open Maps
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={isAddActivityOpen}
        onClose={() => { setIsAddActivityOpen(false); setEditingActivity(null); }}
        title={editingActivity ? 'Edit Activity' : 'Add Activity'}
      >
        <AddActivityForm
          dayId={dayId!}
          activity={editingActivity}
          onSuccess={handleActivityAdded}
          onCancel={() => { setIsAddActivityOpen(false); setEditingActivity(null); }}
        />
      </BottomSheet>
    </div>
  );
}
