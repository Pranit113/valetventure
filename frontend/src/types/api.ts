export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export enum TripType {
  SOLO = 'SOLO',
  COUPLE = 'COUPLE',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  GROUP = 'GROUP'
}

export enum TravelMode {
  CAR = 'CAR',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  FLIGHT = 'FLIGHT',
  MIXED = 'MIXED'
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  type: TripType;
  travelMode: TravelMode;
  currency: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripDay {
  id: string;
  tripId: string;
  date: string;
  dayIndex: number;
  location: string;
  estimatedCost: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  dayId: string;
  name: string;
  time: string; // HH:MM
  locationName?: string;
  mapsUrl?: string;
  description?: string;
  durationMinutes?: number;
  cost?: number;
  bestTime?: string;
  notes?: string;
  order: number;
}

export interface UserStats {
  totalTrips: number;
  countriesVisited: number;
  citiesVisited: number;
}
