import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { TripDay } from '../../types/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface DayCardProps {
  day: TripDay;
  tripCurrency: string;
}

export default function DayCard({ day, tripCurrency }: DayCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col bg-surface dark:bg-surface-dark border-2 border-border dark:border-border-dark">
      <div className="bg-surface-2 dark:bg-surface-2-dark p-4 border-b border-border dark:border-border-dark">
        <div className="flex justify-between items-center mb-1">
          <span className="font-display font-bold text-sm tracking-widest text-primary uppercase">Day {day.dayIndex}</span>
          <span className="font-semibold text-sm">{formatDate(day.date, 'dd MMMM')}</span>
        </div>
        <h3 className="font-display text-xl font-semibold">{day.location}</h3>
        
        <div className="flex items-center gap-4 mt-3 text-xs font-medium text-text-muted dark:text-text-muted-dark">
          <span>{day.activities?.length || 0} activities</span>
          <span>Est. {formatCurrency(day.estimatedCost || 0, tripCurrency)}</span>
        </div>
      </div>
      
      <CardContent className="flex-1 p-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {day.activities && day.activities.length > 0 ? (
            day.activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-12 shrink-0 pt-0.5 text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  {activity.time}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text dark:text-text-dark">{activity.name}</h4>
                  {activity.locationName && (
                    <div className="flex items-center text-xs text-text-muted dark:text-text-muted-dark mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate max-w-[150px]">{activity.locationName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-text-muted dark:text-text-muted-dark">
              No activities planned for this day.
            </div>
          )}
          
          {day.activities && day.activities.length > 4 && (
            <div className="text-xs font-medium text-primary text-center pt-2">
              +{day.activities.length - 4} more activities
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="p-4 pt-0 mt-auto">
        <Button 
          variant="outline" 
          fullWidth 
          onClick={() => navigate(`/trips/${day.tripId}/day/${day.id}`)}
          className="bg-surface dark:bg-surface-dark"
        >
          View Day Details <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}
