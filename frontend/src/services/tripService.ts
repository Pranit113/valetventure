import { mockTrips, mockDays } from '../lib/mockDb';

function getToken(): string {
  return localStorage.getItem('token') || '';
}

export const tripService = {
  getAll: async () => {
    const data = await mockTrips.getAll(getToken());
    return { data };
  },

  getById: async (id: string) => {
    const data = await mockTrips.getById(getToken(), id);
    return { data };
  },

  create: async (tripData: any) => {
    const data = await mockTrips.create(getToken(), tripData);
    return { data };
  },

  update: async (id: string, tripData: any) => {
    const data = await mockTrips.update(getToken(), id, tripData);
    return { data };
  },

  delete: async (id: string) => {
    await mockTrips.delete(getToken(), id);
    return { data: {} };
  },

  createDay: async (tripId: string, dayData: any) => {
    const data = await mockDays.create(getToken(), tripId, dayData);
    return { data };
  },

  getDays: async (tripId: string) => {
    const trip = await mockTrips.getById(getToken(), tripId);
    return { data: (trip as any).days || [] };
  },
};
