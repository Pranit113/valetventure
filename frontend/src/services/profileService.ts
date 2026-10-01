import api from '../lib/axios';
import { User, UserStats } from '../types/api';

export const profileService = {
  getProfile: () => api.get<User>('/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/profile', data),
  getStats: () => api.get<UserStats>('/profile/stats'),
};
