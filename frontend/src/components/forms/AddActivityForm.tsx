import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { dayService } from '../../services/dayService';
import { Activity } from '../../types/api';

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  time: z.string().optional(),
  locationName: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
  bestTime: z.string().optional(),
  notes: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

interface AddActivityFormProps {
  dayId: string;
  activity?: Activity | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddActivityForm({ dayId, activity, onSuccess, onCancel }: AddActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      time: '09:00',
    },
  });

  useEffect(() => {
    if (activity) {
      reset({
        name: activity.name,
        time: activity.time || '',
        locationName: activity.locationName || '',
        googleMapsUrl: (activity as any).googleMapsUrl || activity.mapsUrl || '',
        description: activity.description || '',
        durationMinutes: activity.durationMinutes,
        estimatedCost: (activity as any).estimatedCost ?? (activity as any).cost,
        bestTime: activity.bestTime || '',
        notes: activity.notes || '',
      });
    } else {
      reset({ time: '09:00' });
    }
  }, [activity, reset]);

  const onSubmit = async (data: ActivityForm) => {
    setIsLoading(true);
    try {
      if (activity) {
        await dayService.updateActivity(activity.id, data);
      } else {
        await dayService.createActivity(dayId, data);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to save activity', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
      <Input
        label="Activity Name *"
        placeholder="e.g. Visit Fort Kochi"
        {...register('name')}
        error={errors.name?.message}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Time"
          type="time"
          {...register('time')}
          error={errors.time?.message}
        />
        <Input
          label="Duration (mins)"
          type="number"
          placeholder="e.g. 120"
          {...register('durationMinutes')}
          error={errors.durationMinutes?.message}
        />
      </div>

      <Input
        label="Location Name"
        placeholder="e.g. Fort Kochi, Kerala"
        {...register('locationName')}
      />

      <Input
        label="Google Maps URL"
        placeholder="https://maps.google.com/..."
        {...register('googleMapsUrl')}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          Description
        </label>
        <textarea
          className="w-full rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 text-sm focus:border-primary focus:outline-none min-h-[90px] text-text dark:text-text-dark resize-none"
          placeholder="What to see, tips, notes..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Estimated Cost"
          type="number"
          placeholder="0"
          {...register('estimatedCost')}
        />
        <Input
          label="Best Time"
          placeholder="e.g. Morning"
          {...register('bestTime')}
        />
      </div>

      <Input
        label="Notes"
        placeholder="Any extra notes..."
        {...register('notes')}
      />

      <div className="pt-2 flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {activity ? 'Save Changes' : 'Add Activity'}
        </Button>
      </div>
    </form>
  );
}
