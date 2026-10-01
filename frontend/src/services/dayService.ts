import api from '../lib/axios';
import { TripDay, Activity } from '../types/api';

export const dayService = {
  getById: (id: string) => api.get<TripDay>(`/days/${id}`),
  addActivity: (dayId: string, data: Partial<Activity>) => api.post<Activity>(`/days/${dayId}/activities`, data),
  updateActivity: (id: string, data: Partial<Activity>) => api.put<Activity>(`/activities/${id}`, data),
  deleteActivity: (id: string) => api.delete(`/activities/${id}`),
  reorderActivities: (dayId: string, activityIds: string[]) => api.put(`/days/${dayId}/activities/reorder`, { activityIds }),
};
