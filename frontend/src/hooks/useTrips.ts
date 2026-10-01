import { useState, useCallback } from 'react';
import { tripService } from '../services/tripService';
import { Trip, TripDay } from '../types/api';
import { useApi } from './useApi';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { isLoading, error, execute } = useApi(tripService.getAll, {
    onSuccess: (data) => setTrips(data)
  });

  const fetchTrips = useCallback(() => {
    execute();
  }, [execute]);

  return { trips, isLoading, error, fetchTrips, setTrips };
}

export function useTrip(id: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<TripDay[]>([]);
  
  const { isLoading: isTripLoading, error: tripError, execute: fetchTripDetails } = useApi(() => tripService.getById(id), {
    onSuccess: (data) => setTrip(data)
  });
  
  const { isLoading: isDaysLoading, error: daysError, execute: fetchTripDays } = useApi(() => tripService.getDays(id), {
    onSuccess: (data) => setDays(data)
  });

  const fetchTrip = useCallback(async () => {
    if (!id) return;
    await Promise.all([
      fetchTripDetails(),
      fetchTripDays()
    ]);
  }, [id, fetchTripDetails, fetchTripDays]);

  return { 
    trip, 
    days, 
    isLoading: isTripLoading || isDaysLoading, 
    error: tripError || daysError, 
    fetchTrip,
    setDays 
  };
}
