export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  profilePhotoUrl?: string;
  instagramUsername?: string;
  currency?: string;
  countriesVisited?: number;
  citiesVisited?: number;
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
  userId?: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers?: number;
  numberOfTravelers?: number;
  type?: TripType;
  tripType?: TripType;
  travelMode?: TravelMode;
  currency: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  days?: TripDay[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  expenses?: Expense[];
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
  googleMapsUrl?: string;
  mapsUrl?: string;
  description?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  cost?: number;
  bestTime?: string;
  notes?: string;
  sortOrder?: number;
  order?: number;
}

export interface Hotel {
  id: string;
  tripId: string;
  hotelName: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  pricePerNight?: number;
  bookingUrl?: string;
  googleMapsUrl?: string;
  notes?: string;
}

export interface Restaurant {
  id: string;
  tripId: string;
  restaurantName: string;
  location?: string;
  meal?: string;
  priceRange?: string;
  googleMapsUrl?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: string;
  description?: string;
  amount: number;
  date?: string;
  notes?: string;
}

export interface UserStats {
  totalTrips: number;
  countriesVisited: number;
  citiesVisited: number;
}
