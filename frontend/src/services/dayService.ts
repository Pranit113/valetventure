import { mockDays, mockActivities } from '../lib/mockDb';

function getToken(): string {
  return localStorage.getItem('token') || '';
}

export const dayService = {
  createDay: async (tripId: string, data: any) => {
    const result = await mockDays.create(getToken(), tripId, data);
    return { data: result };
  },

  updateDay: async (dayId: string, data: any) => {
    const result = await mockDays.update(getToken(), dayId, data);
    return { data: result };
  },

  deleteDay: async (dayId: string) => {
    await mockDays.delete(getToken(), dayId);
    return { data: {} };
  },

  createActivity: async (dayId: string, data: any) => {
    const result = await mockActivities.create(getToken(), dayId, data);
    return { data: result };
  },

  updateActivity: async (activityId: string, data: any) => {
    const result = await mockActivities.update(getToken(), activityId, data);
    return { data: result };
  },

  deleteActivity: async (activityId: string) => {
    await mockActivities.delete(getToken(), activityId);
    return { data: {} };
  },

  reorderActivity: async (activityId: string, sortOrder: number) => {
    await mockActivities.reorder(getToken(), activityId, sortOrder);
    return { data: {} };
  },
};
