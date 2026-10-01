/**
 * Mock Database — persists everything in localStorage.
 * Simulates the Spring Boot backend for the GitHub Pages demo.
 */

import { User, Trip, TripDay, Activity, AuthResponse } from '../types/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 11);
const now = () => new Date().toISOString();
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ─── Storage Keys ───────────────────────────────────────────────────────────

const KEYS = {
  users: 'vv_users',
  trips: 'vv_trips',
  days: 'vv_days',
  activities: 'vv_activities',
  hotels: 'vv_hotels',
  restaurants: 'vv_restaurants',
  expenses: 'vv_expenses',
};

// ─── Raw Storage ────────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── User DB ────────────────────────────────────────────────────────────────

interface StoredUser extends User {
  password: string;
  currency: string;
  profilePhotoUrl?: string;
  instagramUsername?: string;
  countriesVisited: number;
  citiesVisited: number;
  createdAt: string;
}

function getUsers(): StoredUser[] {
  return load<StoredUser>(KEYS.users);
}

function saveUsers(users: StoredUser[]) {
  save(KEYS.users, users);
}

function toUserResponse(u: StoredUser): User {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    displayName: u.displayName,
    bio: u.bio,
    avatarUrl: u.profilePhotoUrl,
    currency: u.currency,
    countriesVisited: u.countriesVisited,
    citiesVisited: u.citiesVisited,
  } as User & { currency: string; countriesVisited: number; citiesVisited: number };
}

// ─── Mock Auth ───────────────────────────────────────────────────────────────

export const mockAuth = {
  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    await delay();
    const users = getUsers();

    if (users.find((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      throw { response: { data: { message: 'Username already taken' }, status: 409 } };
    }
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw { response: { data: { message: 'Email already registered' }, status: 409 } };
    }

    const newUser: StoredUser = {
      id: uid(),
      username: data.username,
      email: data.email,
      password: data.password, // plain for demo — backend hashes with BCrypt
      displayName: data.username,
      bio: '',
      currency: 'INR',
      profilePhotoUrl: '',
      instagramUsername: '',
      countriesVisited: 0,
      citiesVisited: 0,
      createdAt: now(),
    };

    saveUsers([...users, newUser]);

    const token = `demo-token-${newUser.id}-${Date.now()}`;
    return { token, user: toUserResponse(newUser) };
  },

  async login(data: { usernameOrEmail?: string; identifier?: string; password: string }): Promise<AuthResponse> {
    await delay();
    const identifier = (data.usernameOrEmail || data.identifier || '').toLowerCase();
    const users = getUsers();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === identifier ||
        u.email.toLowerCase() === identifier
    );

    if (!user || user.password !== data.password) {
      throw { response: { data: { message: 'Invalid credentials' }, status: 401 } };
    }

    const token = `demo-token-${user.id}-${Date.now()}`;
    return { token, user: toUserResponse(user) };
  },

  async checkUsername(username: string): Promise<{ available: boolean }> {
    await delay(150);
    const users = getUsers();
    const taken = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    return { available: !taken };
  },
};

// ─── Mock Users ──────────────────────────────────────────────────────────────

function getCurrentUserId(token: string): string {
  const parts = token.split('-');
  return parts[2]; // demo-token-{id}-{ts}
}

export const mockUsers = {
  async getMe(token: string): Promise<User> {
    await delay(150);
    const userId = getCurrentUserId(token);
    const user = getUsers().find((u) => u.id === userId);
    if (!user) throw { response: { status: 401 } };
    return toUserResponse(user);
  },

  async updateMe(token: string, data: Partial<StoredUser>): Promise<User> {
    await delay();
    const userId = getCurrentUserId(token);
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw { response: { status: 401 } };
    users[idx] = { ...users[idx], ...data };
    saveUsers(users);
    return toUserResponse(users[idx]);
  },
};

// ─── Trip DB ─────────────────────────────────────────────────────────────────

function getTrips(): Trip[] {
  return load<Trip>(KEYS.trips);
}
function saveTrips(trips: Trip[]) {
  save(KEYS.trips, trips);
}

export const mockTrips = {
  async getAll(token: string): Promise<Trip[]> {
    await delay(200);
    const userId = getCurrentUserId(token);
    return getTrips()
      .filter((t: any) => t.userId === userId)
      .sort((a: any, b: any) => b.createdAt?.localeCompare(a.createdAt));
  },

  async getById(token: string, id: string): Promise<Trip> {
    await delay(150);
    const userId = getCurrentUserId(token);
    const trip = getTrips().find((t: any) => t.id === id && t.userId === userId);
    if (!trip) throw { response: { status: 404, data: { message: 'Trip not found' } } };
    // Attach days
    const days = getDays().filter((d: any) => d.tripId === id).sort((a, b) => a.dayNumber - b.dayNumber);
    const daysWithActivities = days.map((d: any) => ({
      ...d,
      activities: getActivities().filter((a: any) => a.tripDayId === d.id).sort((a: any, b: any) => (a.sortOrder - b.sortOrder)),
    }));
    const hotels = getHotels().filter((h: any) => h.tripId === id);
    const restaurants = getRestaurants().filter((r: any) => r.tripId === id);
    const expenses = getExpenses().filter((e: any) => e.tripId === id);
    return { ...trip, days: daysWithActivities, hotels, restaurants, expenses } as any;
  },

  async create(token: string, data: Partial<Trip>): Promise<Trip> {
    await delay();
    const userId = getCurrentUserId(token);
    const trip: Trip = {
      id: uid(),
      userId,
      name: data.name || 'My Trip',
      destination: data.destination || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      numberOfTravelers: (data as any).numberOfTravelers || 1,
      tripType: (data as any).tripType || 'SOLO',
      travelMode: (data as any).travelMode || 'FLIGHT',
      currency: (data as any).currency || 'INR',
      createdAt: now(),
      updatedAt: now(),
    } as any;
    saveTrips([...getTrips(), trip]);
    return trip;
  },

  async update(token: string, id: string, data: Partial<Trip>): Promise<Trip> {
    await delay();
    const userId = getCurrentUserId(token);
    const trips = getTrips();
    const idx = trips.findIndex((t: any) => t.id === id && t.userId === userId);
    if (idx === -1) throw { response: { status: 404 } };
    trips[idx] = { ...trips[idx], ...data, updatedAt: now() } as any;
    saveTrips(trips);
    return trips[idx];
  },

  async delete(token: string, id: string): Promise<void> {
    await delay();
    const userId = getCurrentUserId(token);
    const trips = getTrips().filter((t: any) => !(t.id === id && t.userId === userId));
    saveTrips(trips);
    // Cascade delete days and activities
    const remainingDayIds = getDays().filter((d: any) => d.tripId !== id).map((d: any) => d.id);
    save(KEYS.days, getDays().filter((d: any) => d.tripId !== id));
    save(KEYS.activities, getActivities().filter((a: any) => remainingDayIds.includes(a.tripDayId)));
    save(KEYS.hotels, getHotels().filter((h: any) => h.tripId !== id));
    save(KEYS.restaurants, getRestaurants().filter((r: any) => r.tripId !== id));
    save(KEYS.expenses, getExpenses().filter((e: any) => e.tripId !== id));
  },
};

// ─── Day DB ───────────────────────────────────────────────────────────────────

function getDays(): any[] {
  return load<any>(KEYS.days);
}

export const mockDays = {
  async create(token: string, tripId: string, data: any): Promise<TripDay> {
    await delay();
    const userId = getCurrentUserId(token);
    // Ownership check
    const trip = getTrips().find((t: any) => t.id === tripId && t.userId === userId);
    if (!trip) throw { response: { status: 403 } };

    const days = getDays().filter((d: any) => d.tripId === tripId);
    const dayNumber = days.length + 1;

    const day: any = {
      id: uid(),
      tripId,
      dayNumber,
      date: data.date || '',
      location: data.location || '',
      notes: data.notes || '',
      activities: [],
      createdAt: now(),
    };
    save(KEYS.days, [...getDays(), day]);
    return { ...day, activities: [] } as TripDay;
  },

  async update(token: string, id: string, data: any): Promise<TripDay> {
    await delay();
    const days = getDays();
    const idx = days.findIndex((d) => d.id === id);
    if (idx === -1) throw { response: { status: 404 } };
    days[idx] = { ...days[idx], ...data };
    save(KEYS.days, days);
    return { ...days[idx], activities: getActivities().filter((a: any) => a.tripDayId === id) } as TripDay;
  },

  async delete(token: string, id: string): Promise<void> {
    await delay();
    save(KEYS.days, getDays().filter((d) => d.id !== id));
    save(KEYS.activities, getActivities().filter((a: any) => a.tripDayId !== id));
  },
};

// ─── Activity DB ──────────────────────────────────────────────────────────────

function getActivities(): any[] {
  return load<any>(KEYS.activities);
}

export const mockActivities = {
  async create(token: string, dayId: string, data: any): Promise<Activity> {
    await delay();
    const activities = getActivities().filter((a: any) => a.tripDayId === dayId);
    const activity: any = {
      id: uid(),
      tripDayId: dayId,
      name: data.name || '',
      time: data.time || '',
      locationName: data.locationName || '',
      googleMapsUrl: data.googleMapsUrl || '',
      description: data.description || '',
      durationMinutes: data.durationMinutes || 0,
      estimatedCost: data.estimatedCost || 0,
      bestTime: data.bestTime || '',
      notes: data.notes || '',
      sortOrder: activities.length,
      createdAt: now(),
    };
    save(KEYS.activities, [...getActivities(), activity]);
    return activity as Activity;
  },

  async update(token: string, id: string, data: any): Promise<Activity> {
    await delay();
    const activities = getActivities();
    const idx = activities.findIndex((a) => a.id === id);
    if (idx === -1) throw { response: { status: 404 } };
    activities[idx] = { ...activities[idx], ...data };
    save(KEYS.activities, activities);
    return activities[idx] as Activity;
  },

  async delete(token: string, id: string): Promise<void> {
    await delay();
    save(KEYS.activities, getActivities().filter((a) => a.id !== id));
  },

  async reorder(token: string, id: string, sortOrder: number): Promise<void> {
    await delay(100);
    const activities = getActivities();
    const idx = activities.findIndex((a) => a.id === id);
    if (idx !== -1) {
      activities[idx].sortOrder = sortOrder;
      save(KEYS.activities, activities);
    }
  },
};

// ─── Hotel DB ─────────────────────────────────────────────────────────────────

function getHotels(): any[] { return load<any>(KEYS.hotels); }

export const mockHotels = {
  async create(token: string, tripId: string, data: any) {
    await delay();
    const hotel = { id: uid(), tripId, ...data, createdAt: now() };
    save(KEYS.hotels, [...getHotels(), hotel]);
    return hotel;
  },
  async update(token: string, id: string, data: any) {
    await delay();
    const hotels = getHotels();
    const idx = hotels.findIndex((h) => h.id === id);
    if (idx !== -1) { hotels[idx] = { ...hotels[idx], ...data }; save(KEYS.hotels, hotels); }
    return hotels[idx];
  },
  async delete(token: string, id: string) {
    await delay();
    save(KEYS.hotels, getHotels().filter((h) => h.id !== id));
  },
};

// ─── Restaurant DB ────────────────────────────────────────────────────────────

function getRestaurants(): any[] { return load<any>(KEYS.restaurants); }

export const mockRestaurants = {
  async create(token: string, tripId: string, data: any) {
    await delay();
    const r = { id: uid(), tripId, ...data, createdAt: now() };
    save(KEYS.restaurants, [...getRestaurants(), r]);
    return r;
  },
  async update(token: string, id: string, data: any) {
    await delay();
    const items = getRestaurants();
    const idx = items.findIndex((r) => r.id === id);
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; save(KEYS.restaurants, items); }
    return items[idx];
  },
  async delete(token: string, id: string) {
    await delay();
    save(KEYS.restaurants, getRestaurants().filter((r) => r.id !== id));
  },
};

// ─── Expense DB ───────────────────────────────────────────────────────────────

function getExpenses(): any[] { return load<any>(KEYS.expenses); }

export const mockExpenses = {
  async create(token: string, tripId: string, data: any) {
    await delay();
    const e = { id: uid(), tripId, ...data, createdAt: now() };
    save(KEYS.expenses, [...getExpenses(), e]);
    return e;
  },
  async update(token: string, id: string, data: any) {
    await delay();
    const items = getExpenses();
    const idx = items.findIndex((e) => e.id === id);
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; save(KEYS.expenses, items); }
    return items[idx];
  },
  async delete(token: string, id: string) {
    await delay();
    save(KEYS.expenses, getExpenses().filter((e) => e.id !== id));
  },
};
