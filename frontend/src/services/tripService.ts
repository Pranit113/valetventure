import api from '../lib/axios';
import { Trip, TripDay } from '../types/api';

export const tripService = {
  getAll: () => api.get<Trip[]>('/trips'),
  getById: (id: string) => api.get<Trip>(`/trips/${id}`),
  create: (data: Partial<Trip>) => api.post<Trip>('/trips', data),
  update: (id: string, data: Partial<Trip>) => api.put<Trip>(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  getDays: (tripId: string) => api.get<TripDay[]>(`/trips/${tripId}/days`),
  createDay: (tripId: string, data: Partial<TripDay>) => api.post<TripDay>(`/trips/${tripId}/days`, data),
};
