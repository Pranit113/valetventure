import { mockAuth } from '../lib/mockDb';
import { AuthResponse } from '../types/api';

export const authService = {
  login: async (data: any): Promise<{ data: AuthResponse }> => {
    const result = await mockAuth.login(data);
    return { data: result };
  },

  register: async (data: any): Promise<{ data: AuthResponse }> => {
    const result = await mockAuth.register(data);
    return { data: result };
  },

  checkUsername: async (username: string): Promise<{ data: { available: boolean } }> => {
    const result = await mockAuth.checkUsername(username);
    return { data: result };
  },
};
