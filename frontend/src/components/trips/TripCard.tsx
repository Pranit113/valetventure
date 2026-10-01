import { MapPin, Users, Calendar, Plane, Car, Train, Bus } from 'lucide-react';
import { Trip, TripType, TravelMode } from '../../types/api';
import { formatDate } from '../../lib/utils';
import { Card, CardContent } from '../ui/Card';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const getTravelModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case TravelMode.FLIGHT: return <Plane className="w-4 h-4" />;
      case TravelMode.CAR: return <Car className="w-4 h-4" />;
      case TravelMode.TRAIN: return <Train className="w-4 h-4" />;
      case TravelMode.BUS: return <Bus className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTripTypeLabel = (type: TripType) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-4">
            <h3 className="font-display font-semibold text-lg leading-tight mb-1">{trip.name}</h3>
            <div className="flex items-center text-text-muted dark:text-text-muted-dark text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
          <div className="bg-surface-2 dark:bg-surface-2-dark p-2 rounded-lg text-primary">
            {getTravelModeIcon(trip.travelMode)}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-text-muted dark:text-text-muted-dark pt-3 border-t border-border dark:border-border-dark mt-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>{formatDate(trip.startDate, 'MMM d')} - {formatDate(trip.endDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1.5" />
            <span>{trip.travelers} {getTripTypeLabel(trip.type)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
