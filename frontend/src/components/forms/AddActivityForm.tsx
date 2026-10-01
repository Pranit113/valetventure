import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const activitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  time: z.string().min(1, 'Time is required'),
  locationName: z.string().optional(),
  mapsUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  durationMinutes: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

interface AddActivityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddActivityForm({ onSuccess, onCancel }: AddActivityFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      time: '09:00',
    }
  });

  const onSubmit = (data: ActivityForm) => {
    // In a real app, this would call an API
    console.log('Activity saved:', data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Activity Name *"
        placeholder="e.g. Visit Museum"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Time *"
          type="time"
          {...register('time')}
          error={errors.time?.message}
        />
        <Input
          label="Duration (mins)"
          type="number"
          placeholder="e.g. 120"
          {...register('durationMinutes', { valueAsNumber: true })}
          error={errors.durationMinutes?.message}
        />
      </div>

      <Input
        label="Location Name"
        placeholder="e.g. The Louvre"
        {...register('locationName')}
      />

      <Input
        label="Google Maps URL"
        placeholder="https://maps.google.com/..."
        {...register('mapsUrl')}
        error={errors.mapsUrl?.message}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          Description
        </label>
        <textarea
          className="w-full rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 text-sm focus:border-primary focus:outline-none min-h-[100px]"
          placeholder="Activity details..."
          {...register('description')}
        />
      </div>

      <Input
        label="Estimated Cost"
        type="number"
        placeholder="0"
        {...register('cost', { valueAsNumber: true })}
      />

      <div className="pt-4 flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Save Activity
        </Button>
      </div>
    </form>
  );
}
