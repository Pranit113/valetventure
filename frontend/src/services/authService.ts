import api from '../lib/axios';
import { AuthResponse } from '../types/api';

export const authService = {
  login: (data: any) => api.post<AuthResponse>('/auth/login', data),
  register: (data: any) => api.post<AuthResponse>('/auth/register', data),
  checkUsername: (username: string) => api.get<{ available: boolean }>(`/auth/check-username?username=${username}`),
};
